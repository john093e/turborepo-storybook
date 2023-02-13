import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ONG, B2E } from ".prisma/client";
import type { Session } from "next-auth";
import { useState } from "react";
import { hashPassword, cyrb53 } from "@twol/utils/auth/passwords";
import { decrypt } from "@twol/utils/auth/crypto";

import { compare } from "bcryptjs";
/**
 * Get ONG
 *
 * Fetches & returns either a single or all ONG available depending on
 * whether a `ongId` query parameter is provided. If not all ONG are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getONG(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<B2E> | (B2E | null)>> {
  const { ongId } = req.query;

  if (Array.isArray(ongId))
    return res
      .status(400)
      .end("Bad request. ongId parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  try {
    if (ongId) {
      const settings = await prisma.b2E.findFirst({
        where: {
          ong: {
            id: ongId,
          },
          user: {
            id: session.user.id,
          },
        },
        select: {
          ongId: true,
          ong: {
            select: {
              registered_name: true,
              registered_charity_number: true,
              registered_address: true,
              registered_postcode: true,
              registered_postcode_name: true,
              name_set: true,
              charity_number_set: true,
              address_set: true,
              address_postcode_set: true,
              postcode_name_set: true,
            },
          },
        },
      });
      if (settings) {
        const ongUniq = {
          id: settings?.ongId,
          registered_name: settings?.ong?.registered_name,
          registered_charity_number: settings?.ong?.registered_charity_number,
          registered_address: settings?.ong?.registered_address,
          registered_postcode: settings?.ong?.registered_postcode,
          registered_postcode_name: settings?.ong?.registered_postcode_name,
          name_set: settings?.ong?.name_set,
          charity_number_set: settings?.ong?.charity_number_set,
          address_set: settings?.ong?.address_set,
          address_postcode_set: settings?.ong?.address_postcode_set,
          postcode_name_set: settings?.ong?.postcode_name_set,
        };
        return res.status(200).json(ongUniq);
      } else {
        return res.status(500).end("An error occured while fetching data");
      }
    }

    const ongs = await prisma.b2E.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
      select: {
        ongId: true,
        ong: {
          select: {
            registered_name: true,
            registered_charity_number: true,
            registered_address: true,
            registered_postcode: true,
            registered_postcode_name: true,
            name_set: true,
            charity_number_set: true,
            address_set: true,
            address_postcode_set: true,
            postcode_name_set: true,
          },
        },
      },
    });
    const initialState: {
      id: string | null;
      registered_name: string | undefined;
      registered_charity_number: string | undefined;
      registered_address: string | undefined;
      registered_postcode: number | undefined;
      registered_postcode_name: string | undefined;
      name_set: string | null | undefined;
      charity_number_set: string | null | undefined;
      address_set: string | null | undefined;
      address_postcode_set: number | null | undefined;
      postcode_name_set: string | null | undefined;
    }[] = [];
    if (ongs) {
      if (ongs.length > 0) {
        ongs.map((ong) => {
          let new_ong = {
            id: ong?.ongId,
            registered_name: ong?.ong?.registered_name,
            registered_charity_number: ong?.ong?.registered_charity_number,
            registered_address: ong?.ong?.registered_address,
            registered_postcode: ong?.ong?.registered_postcode,
            registered_postcode_name: ong?.ong?.registered_postcode_name,
            name_set: ong?.ong?.name_set,
            charity_number_set: ong?.ong?.charity_number_set,
            address_set: ong?.ong?.address_set,
            address_postcode_set: ong?.ong?.address_postcode_set,
            postcode_name_set: ong?.ong?.postcode_name_set,
          };
          initialState.push(new_ong);
        });
      }
    }

    return res.status(200).json(initialState);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create ONG
 *
 * Creates a new ONG from a set of provided query parameters.
 * These include:
 *  - registered_name
 *  - registered_charity_number
 *  - registered_address
 *  - registered_postcode
 *  - registered_postcode_name
 *
 * Once created, the ONG new `ongId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createONG(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  ongId: string;
}>> {
  const {
    registered_name,
    registered_charity_number,
    registered_address,
    registered_postcode,
    registered_postcode_name,
  } = req.body;

  const given_registered_charity_number: string =
    req.body.registered_charity_number.replace(/\D/g, "");

  try {
    const response = await prisma.oNG.create({
      data: {
        registered_name: registered_name,
        registered_charity_number: given_registered_charity_number,
        registered_address: registered_address,
        registered_postcode: registered_postcode,
        registered_postcode_name: registered_postcode_name,
      },
    });

    return res.status(201).json({
      ongId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete ONG
 *
 * Deletes an ONG from the database using a provided `ongId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteONG(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse> {
  const { ongId } = req.query;

  if (Array.isArray(ongId))
    return res
      .status(400)
      .end("Bad request. ongId parameter cannot be an array.");

  try {
    await prisma.$transaction([
      prisma.post.deleteMany({
        where: {
          site: {
            ong: {
              id: ongId,
            },
          },
        },
      }),
      prisma.site.deleteMany({
        where: {
          ong: {
            id: ongId,
          },
        },
      }),
      prisma.oNG.delete({
        where: {
          id: ongId,
        },
      }),
    ]);

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update ONG
 *
 * Updates a ONG & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - activated
 *  - activated_at
 *  - activated_by
 *  - charity_number_set
 *  - name_set
 *  - address_set
 *  - postcode_set
 *  - postcode_name_set
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateONG(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<ONG>> {
  const {
    activated,
    activated_at,
    activated_by,
    charity_number_set,
    name_set,
    address_set,
    address_postcode_set,
    postcode_name_set,
  } = req.body;

  const given_charity_number_set: string = req.body.charity_number_set.replace(
    /\D/g,
    ""
  );
  // const subdomain = sub.length > 0 ? sub : currentSubdomain;

  try {
    const response = await prisma.oNG.update({
      where: {
        charity_number_set: given_charity_number_set,
      },
      data: {
        activated,
        activated_at,
        activated_by,
        charity_number_set,
        name_set,
        address_set,
        address_postcode_set,
        postcode_name_set,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Activate ONG
 *
 * Updates a site & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - charityNumber
 *  - firstName
 *  - lastName
 *  - email
 *  - password
 *  - passwordConfirmation
 *  - marketingAccept
 *  - activated
 *  - verificationNumber
 *
 *
 * Will return one of the following :
 * - An error occured
 * - unknown
 * - alreadyActivated
 * -
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function activateONG(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<ONG>> {
  const {
    charityNumber,
    firstName,
    lastName,
    language,
    email,
    passwordIv,
    passwordContent,
    passwordConfirmationIv,
    passwordConfirmationContent,
    marketingAccept,
    activated,
    verificationNumber,
  } = req.body;

  // 0- Validate data before processing them
  const given_charity_number_set: string = req.body.charityNumber.replace(
    /\D/g,
    ""
  );
  const given_verificationNumber: string = req.body.verificationNumber.replace(
    /\D/g,
    ""
  );
  if (given_charity_number_set.length === 0) {
    const available = "given_charity_number_set";
    return res.status(200).json(available);
  }

  if (given_verificationNumber.length !== 9) {
    const available = "given_verificationNumber";
    return res.status(200).json(available);
  }

  //validate Email
  if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(email)) {
    const available = "email invalid";
    return res.status(200).json(available);
  }

  //validate First and last name
  if (!firstName || !lastName) {
  } else {
    if (
      !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(
        firstName
      )
    ) {
      const available = "firstname invalid";
      return res.status(200).json(available);
    }
    if (
      !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(
        lastName
      )
    ) {
      const available = "lastname invalid";
      return res.status(200).json(available);
    }
  }
  /* TODO - MANAGE LANGUAGE  */
  if (language !== "fr") {
    const error = "LanguageError";
    return res.status(200).json(error);
  }

  if (
    passwordIv === "" ||
    passwordContent === "" ||
    passwordConfirmationIv === "" ||
    passwordConfirmationContent === ""
  ) {
    const error = "Password format invalid";
    return res.status(200).json(error);
  }
  const hashPasswordReceived = {
    iv: passwordIv as string,
    content: passwordContent as string,
  };
  const password = decrypt(hashPasswordReceived) as string;

  const hashPasswordConfirmationReceived = {
    iv: passwordConfirmationIv as string,
    content: passwordConfirmationContent as string,
  };
  const passwordConfirmation = decrypt(
    hashPasswordConfirmationReceived
  ) as string;

  if (password !== passwordConfirmation) {
    const available = "invalidPassword";
    return res.status(200).json(available);
  }
  const hashedPassword = await hashPassword(password);

  if (
    req.body.marketingAccept !== true &&
    req.body.marketingAccept !== null &&
    req.body.marketingAccept !== false
  ) {
    const available = "invalidMarketingValue";
    return res.status(200).json(available);
  }

  try {
    //0- First Check the OTP
    //Hash the email
    const hashEmail = await cyrb53(email);
    const date = new Date();
    date.setDate(date.getDate());

    //0.1 -- delete outdated token
    const deleteOutdatedOTP = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lte: date,
        },
      },
    });
    if (deleteOutdatedOTP === null) {
      const available = "An error occured";
      return res.status(500).end(available);
    }

    const checkOTP = await prisma.verificationToken.findFirst({
      where: {
        identifier: hashEmail,
        token: given_verificationNumber,
      },
      select: {
        expires: true,
        token: true,
      },
    });
    if (checkOTP === null) {
      // Stop the process the OTP does not exist
      const available = "unknownOTP";
      return res.status(200).json(available);
    }
    if (checkOTP.expires === null || checkOTP.expires < date) {
      // Stop the process the OTP is expired
      const available = "OTPExpired";
      return res.status(200).json(available);
    }

    if (checkOTP.token !== null) {
      // all good we can delete the OTP
      const deleteUsedOTP = await prisma.verificationToken.deleteMany({
        where: {
          identifier: hashEmail,
          token: given_verificationNumber,
          expires: checkOTP.expires,
        },
      });
      if (deleteUsedOTP === null) {
        const available = "An error occured";
        return res.status(500).end(available);
      }
    } else {
      const available = "An error occured";
      return res.status(500).end(available);
    }

    // 1- Check ONG is existing in DB
    const check = await prisma.oNG.findFirst({
      where: {
        registered_charity_number: given_charity_number_set,
      },
      select: {
        registered_name: true,
        activated: true,
      },
    });
    if (check === null) {
      // Stop the process the charity does not exist
      const available = "unknown";
      return res.status(200).json(available);
    } else if (check !== null) {
      // Good we can continue
      // 2 - Check if charity is activate
      if (check.activated === false) {
        // Good we can continue
        // 3 - Check if User exist
        const userCheck = await prisma.user.findFirst({
          where: {
            email: email,
          },
          select: {
            id: true,
            firstname: true,
            lastname: true,
            password: true,
          },
        });
        if (userCheck !== null) {
          // User Exist
          // 4- We can update the charity in order to activate it and pass the user

          // 4.1- check if password exist and if it exist check if it match
          if (userCheck.password !== null) {
            const isValid = await compare(password, userCheck.password);
            if (isValid) {
            } else {
              const available = "wrongPassword";
              return res.status(200).json(available);
            }
          }
          // 4.2- we can process the relation and updates
          // 4.2.2- Create the relation in User
          const response = await prisma.user.update({
            where: {
              id: userCheck.id,
            },
            data: {
              firstname: userCheck.firstname === null ? firstName : userCheck.firstname,
              lastname: userCheck.password === null ? lastName : userCheck.password,
              marketingAccept: marketingAccept,
              password: userCheck.password === null ? hashedPassword : userCheck.password,
              ONG: {
                connect: {
                  registered_charity_number: given_charity_number_set,
                },
              },
              B2E: {
                updateMany: {
                  where: {
                    inUse: true,
                  },
                  data: {
                    inUse: false,
                  },
                },
                create: {
                  role: 2,
                  status: 2,
                  ong: {
                    connect: {
                      registered_charity_number: given_charity_number_set,
                    },
                  },
                  PermissionSets: {
                    create: {
                      name: "Account Owner",
                      accountOwner: true,
                      editable: false,
                      predefined: false,
                      super_admin: true,
                      crm_contacts_delete: 1,
                      crm_contacts_edit: 1,
                      crm_contacts_view: 1,
                      crm_companies_delete: 1,
                      crm_companies_edit: 1,
                      crm_companies_view: 1,
                      crm_deals_delete: 1,
                      crm_deals_edit: 1,
                      crm_deals_view: 1,
                      crm_tickets_delte: 1,
                      crm_tickets_edit: 1,
                      crm_tickets_view: 1,
                      crm_tasks_edit: 1,
                      crm_tasks_view: 1,
                      crm_notes_view: 1,
                      crm_custom_objects_delete: 1,
                      crm_custom_objects_edit: 1,
                      crm_custom_objects_view: 1,
                      crm_workflows_delete: true,
                      crm_workflows_edit: true,
                      crm_workflows_view: true,
                      crm_communicate: 1,
                      crm_bulk_delete: true,
                      crm_import: true,
                      crm_export: true,
                      crm_edit_property_settings: true,
                      crm_chatflows: true,
                      crm_customs_views: true,
                      marketing_lists_edit: true,
                      marketing_lists_view: true,
                      marketing_forms: true,
                      marketing_files: true,
                      marketing_marketing_access: true,
                      marketing_ads_publish: true,
                      marketing_ads_view: true,
                      marketing_campaigns_edit: true,
                      marketing_campaigns_view: true,
                      marketing_email_edit: true,
                      marketing_email_publish: true,
                      marketing_email_view: true,
                      marketing_social: 1,
                      marketing_content_staging: true,
                      marketing_blog_edit: true,
                      marketing_blog_publish: true,
                      marketing_blog_view: true,
                      marketing_landing_pages_edit: true,
                      marketing_landing_pages_publish: true,
                      marketing_landing_pages_view: true,
                      marketing_website_pages_edit: true,
                      marketing_website_pages_publish: true,
                      marketing_website_pages_view: true,
                      marketing_hubdb_edit: true,
                      marketing_hubdb_publish: true,
                      marketing_hubdb_view: true,
                      marketing_url_redirects_edit: true,
                      marketing_url_redirects_view: true,
                      marketing_design_tools: true,
                      sales_manage_product_library: true,
                      sales_create_custom_line_items: true,
                      sales_sales_access: true,
                      sales_templates: true,
                      sales_create_scheduling_pages_for_others: true,
                      sales_sales_professional: true,
                      sales_forecast_edit: 1,
                      sales_forecast_view: 1,
                      sales_playbooks_edit: true,
                      sales_playbooks_publish: true,
                      sales_playbooks_view: true,
                      sales_sequences: true,
                      sales_bulk_enroll_sequences: true,
                      sales_manage_payment_links: true,
                      sales_manage_payments_and_subscriptions: true,
                      service_service_access: true,
                      service_templates: true,
                      service_create_scheduling_pages_for_others: true,
                      reports_data_quality_tools_access: true,
                      reports_reports_access: true,
                      reports_dashboard_reports_and_analytics_create: true,
                      reports_dashboard_reports_and_analytics_edit: true,
                      reports_dashboard_reports_and_analytics_view: true,
                      reports_marketing_reports: true,
                      account_marketing_contacts_access: true,
                      account_app_marketplace_access: true,
                      account_asset_marketplace_access: true,
                      account_gdpr_delete_contacts: true,
                      account_hubdb_table_settings: true,
                      account_global_content_settings: true,
                      account_website_settings: true,
                      account_reports_and_dashboards: true,
                      account_domain_settings: true,
                      account_account_access: true,
                      account_add_and_edit_users: true,
                      account_add_and_edit_teams: true,
                      account_partition_by_teams: true,
                      account_presets: true,
                      account_edit_account_defaults: true,
                      account_modify_billing_and_change_name_on_contract: true,
                      account_add_and_edit_developer_apps_and_test_accounts: true,
                      account_user_table_access: true,
                      account_availability_management: true,
                      ong: {
                        connect: {
                          registered_charity_number: given_charity_number_set,
                        },
                      },
                    },
                  }
                },
              },
            },
          });
          if (response) {
            // 4.2.3- Create the relation in ONG
            const response_2 = await prisma.oNG.update({
              where: {
                registered_charity_number: given_charity_number_set,
              },
              data: {
                activated,
                charity_number_set: given_charity_number_set,
                PermissionSets: {
                  createMany: {
                    data: [
                      {
                        name: "Super Admin",
                        accountOwner: false,
                        editable: false,
                        predefined: true,
                        super_admin: true,
                        crm_contacts_delete: 1,
                        crm_contacts_edit: 1,
                        crm_contacts_view: 1,
                        crm_companies_delete: 1,
                        crm_companies_edit: 1,
                        crm_companies_view: 1,
                        crm_deals_delete: 1,
                        crm_deals_edit: 1,
                        crm_deals_view: 1,
                        crm_tickets_delte: 1,
                        crm_tickets_edit: 1,
                        crm_tickets_view: 1,
                        crm_tasks_edit: 1,
                        crm_tasks_view: 1,
                        crm_notes_view: 1,
                        crm_custom_objects_delete: 1,
                        crm_custom_objects_edit: 1,
                        crm_custom_objects_view: 1,
                        crm_workflows_delete: true,
                        crm_workflows_edit: true,
                        crm_workflows_view: true,
                        crm_communicate: 1,
                        crm_bulk_delete: true,
                        crm_import: true,
                        crm_export: true,
                        crm_edit_property_settings: true,
                        crm_chatflows: true,
                        crm_customs_views: true,
                        marketing_lists_edit: true,
                        marketing_lists_view: true,
                        marketing_forms: true,
                        marketing_files: true,
                        marketing_marketing_access: true,
                        marketing_ads_publish: true,
                        marketing_ads_view: true,
                        marketing_campaigns_edit: true,
                        marketing_campaigns_view: true,
                        marketing_email_edit: true,
                        marketing_email_publish: true,
                        marketing_email_view: true,
                        marketing_social: 1,
                        marketing_content_staging: true,
                        marketing_blog_edit: true,
                        marketing_blog_publish: true,
                        marketing_blog_view: true,
                        marketing_landing_pages_edit: true,
                        marketing_landing_pages_publish: true,
                        marketing_landing_pages_view: true,
                        marketing_website_pages_edit: true,
                        marketing_website_pages_publish: true,
                        marketing_website_pages_view: true,
                        marketing_hubdb_edit: true,
                        marketing_hubdb_publish: true,
                        marketing_hubdb_view: true,
                        marketing_url_redirects_edit: true,
                        marketing_url_redirects_view: true,
                        marketing_design_tools: true,
                        sales_manage_product_library: true,
                        sales_create_custom_line_items: true,
                        sales_sales_access: true,
                        sales_templates: true,
                        sales_create_scheduling_pages_for_others: true,
                        sales_sales_professional: false,
                        sales_forecast_edit: 4,
                        sales_forecast_view: 3,
                        sales_playbooks_edit: false,
                        sales_playbooks_publish: false,
                        sales_playbooks_view: false,
                        sales_sequences: false,
                        sales_bulk_enroll_sequences: false,
                        sales_manage_payment_links: true,
                        sales_manage_payments_and_subscriptions: true,
                        service_service_access: true,
                        service_templates: true,
                        service_create_scheduling_pages_for_others: true,
                        reports_data_quality_tools_access: true,
                        reports_reports_access: true,
                        reports_dashboard_reports_and_analytics_create: true,
                        reports_dashboard_reports_and_analytics_edit: true,
                        reports_dashboard_reports_and_analytics_view: true,
                        reports_marketing_reports: true,
                        account_marketing_contacts_access: true,
                        account_app_marketplace_access: true,
                        account_asset_marketplace_access: true,
                        account_gdpr_delete_contacts: true,
                        account_hubdb_table_settings: true,
                        account_global_content_settings: true,
                        account_website_settings: true,
                        account_reports_and_dashboards: true,
                        account_domain_settings: true,
                        account_account_access: true,
                        account_add_and_edit_users: true,
                        account_add_and_edit_teams: true,
                        account_partition_by_teams: true,
                        account_presets: true,
                        account_edit_account_defaults: true,
                        account_modify_billing_and_change_name_on_contract: true,
                        account_add_and_edit_developer_apps_and_test_accounts: true,
                        account_user_table_access: true,
                        account_availability_management: true,
                      },{
                        name: "Super Admin with Sales Pro",
                        accountOwner: false,
                        editable: false,
                        predefined: true,
                        super_admin: true,
                        crm_contacts_delete: 1,
                        crm_contacts_edit: 1,
                        crm_contacts_view: 1,
                        crm_companies_delete: 1,
                        crm_companies_edit: 1,
                        crm_companies_view: 1,
                        crm_deals_delete: 1,
                        crm_deals_edit: 1,
                        crm_deals_view: 1,
                        crm_tickets_delte: 1,
                        crm_tickets_edit: 1,
                        crm_tickets_view: 1,
                        crm_tasks_edit: 1,
                        crm_tasks_view: 1,
                        crm_notes_view: 1,
                        crm_custom_objects_delete: 1,
                        crm_custom_objects_edit: 1,
                        crm_custom_objects_view: 1,
                        crm_workflows_delete: true,
                        crm_workflows_edit: true,
                        crm_workflows_view: true,
                        crm_communicate: 1,
                        crm_bulk_delete: true,
                        crm_import: true,
                        crm_export: true,
                        crm_edit_property_settings: true,
                        crm_chatflows: true,
                        crm_customs_views: true,
                        marketing_lists_edit: true,
                        marketing_lists_view: true,
                        marketing_forms: true,
                        marketing_files: true,
                        marketing_marketing_access: true,
                        marketing_ads_publish: true,
                        marketing_ads_view: true,
                        marketing_campaigns_edit: true,
                        marketing_campaigns_view: true,
                        marketing_email_edit: true,
                        marketing_email_publish: true,
                        marketing_email_view: true,
                        marketing_social: 1,
                        marketing_content_staging: true,
                        marketing_blog_edit: true,
                        marketing_blog_publish: true,
                        marketing_blog_view: true,
                        marketing_landing_pages_edit: true,
                        marketing_landing_pages_publish: true,
                        marketing_landing_pages_view: true,
                        marketing_website_pages_edit: true,
                        marketing_website_pages_publish: true,
                        marketing_website_pages_view: true,
                        marketing_hubdb_edit: true,
                        marketing_hubdb_publish: true,
                        marketing_hubdb_view: true,
                        marketing_url_redirects_edit: true,
                        marketing_url_redirects_view: true,
                        marketing_design_tools: true,
                        sales_manage_product_library: true,
                        sales_create_custom_line_items: true,
                        sales_sales_access: true,
                        sales_templates: true,
                        sales_create_scheduling_pages_for_others: true,
                        sales_sales_professional: true,
                        sales_forecast_edit: 1,
                        sales_forecast_view: 1,
                        sales_playbooks_edit: true,
                        sales_playbooks_publish: true,
                        sales_playbooks_view: true,
                        sales_sequences: true,
                        sales_bulk_enroll_sequences: true,
                        sales_manage_payment_links: true,
                        sales_manage_payments_and_subscriptions: true,
                        service_service_access: true,
                        service_templates: true,
                        service_create_scheduling_pages_for_others: true,
                        reports_data_quality_tools_access: true,
                        reports_reports_access: true,
                        reports_dashboard_reports_and_analytics_create: true,
                        reports_dashboard_reports_and_analytics_edit: true,
                        reports_dashboard_reports_and_analytics_view: true,
                        reports_marketing_reports: true,
                        account_marketing_contacts_access: true,
                        account_app_marketplace_access: true,
                        account_asset_marketplace_access: true,
                        account_gdpr_delete_contacts: true,
                        account_hubdb_table_settings: true,
                        account_global_content_settings: true,
                        account_website_settings: true,
                        account_reports_and_dashboards: true,
                        account_domain_settings: true,
                        account_account_access: true,
                        account_add_and_edit_users: true,
                        account_add_and_edit_teams: true,
                        account_partition_by_teams: true,
                        account_presets: true,
                        account_edit_account_defaults: true,
                        account_modify_billing_and_change_name_on_contract: true,
                        account_add_and_edit_developer_apps_and_test_accounts: true,
                        account_user_table_access: true,
                        account_availability_management: true,
                      }
                    ],
                  }
                }
              },
            });
            return res.status(200).json(response_2);
          } else {
            // Stop the process the user creation had an issue
            const available = "userCreationIssue";
            return res.status(200).json(available);
          }
        } else {
          // We need to create a user first
          // 4.1 - Create a User
          const responseUser = await prisma.user.create({
            data: {
              firstname: firstName,
              lastname: lastName,
              language: language,
              email: email,
              password: hashedPassword,
              marketingAccept: marketingAccept,
              ONG: {
                connect: {
                  registered_charity_number: given_charity_number_set,
                },
              },
              B2E: {
                create: {
                  role: 2,
                  status: 2,
                  ong: {
                    connect: {
                      registered_charity_number: given_charity_number_set,
                    },
                  },
                  PermissionSets: {
                    create: {
                      name: "Account Owner",
                      accountOwner: true,
                      editable: false,
                      predefined: false,
                      super_admin: true,
                      crm_contacts_delete: 1,
                      crm_contacts_edit: 1,
                      crm_contacts_view: 1,
                      crm_companies_delete: 1,
                      crm_companies_edit: 1,
                      crm_companies_view: 1,
                      crm_deals_delete: 1,
                      crm_deals_edit: 1,
                      crm_deals_view: 1,
                      crm_tickets_delte: 1,
                      crm_tickets_edit: 1,
                      crm_tickets_view: 1,
                      crm_tasks_edit: 1,
                      crm_tasks_view: 1,
                      crm_notes_view: 1,
                      crm_custom_objects_delete: 1,
                      crm_custom_objects_edit: 1,
                      crm_custom_objects_view: 1,
                      crm_workflows_delete: true,
                      crm_workflows_edit: true,
                      crm_workflows_view: true,
                      crm_communicate: 1,
                      crm_bulk_delete: true,
                      crm_import: true,
                      crm_export: true,
                      crm_edit_property_settings: true,
                      crm_chatflows: true,
                      crm_customs_views: true,
                      marketing_lists_edit: true,
                      marketing_lists_view: true,
                      marketing_forms: true,
                      marketing_files: true,
                      marketing_marketing_access: true,
                      marketing_ads_publish: true,
                      marketing_ads_view: true,
                      marketing_campaigns_edit: true,
                      marketing_campaigns_view: true,
                      marketing_email_edit: true,
                      marketing_email_publish: true,
                      marketing_email_view: true,
                      marketing_social: 1,
                      marketing_content_staging: true,
                      marketing_blog_edit: true,
                      marketing_blog_publish: true,
                      marketing_blog_view: true,
                      marketing_landing_pages_edit: true,
                      marketing_landing_pages_publish: true,
                      marketing_landing_pages_view: true,
                      marketing_website_pages_edit: true,
                      marketing_website_pages_publish: true,
                      marketing_website_pages_view: true,
                      marketing_hubdb_edit: true,
                      marketing_hubdb_publish: true,
                      marketing_hubdb_view: true,
                      marketing_url_redirects_edit: true,
                      marketing_url_redirects_view: true,
                      marketing_design_tools: true,
                      sales_manage_product_library: true,
                      sales_create_custom_line_items: true,
                      sales_sales_access: true,
                      sales_templates: true,
                      sales_create_scheduling_pages_for_others: true,
                      sales_sales_professional: true,
                      sales_forecast_edit: 1,
                      sales_forecast_view: 1,
                      sales_playbooks_edit: true,
                      sales_playbooks_publish: true,
                      sales_playbooks_view: true,
                      sales_sequences: true,
                      sales_bulk_enroll_sequences: true,
                      sales_manage_payment_links: true,
                      sales_manage_payments_and_subscriptions: true,
                      service_service_access: true,
                      service_templates: true,
                      service_create_scheduling_pages_for_others: true,
                      reports_data_quality_tools_access: true,
                      reports_reports_access: true,
                      reports_dashboard_reports_and_analytics_create: true,
                      reports_dashboard_reports_and_analytics_edit: true,
                      reports_dashboard_reports_and_analytics_view: true,
                      reports_marketing_reports: true,
                      account_marketing_contacts_access: true,
                      account_app_marketplace_access: true,
                      account_asset_marketplace_access: true,
                      account_gdpr_delete_contacts: true,
                      account_hubdb_table_settings: true,
                      account_global_content_settings: true,
                      account_website_settings: true,
                      account_reports_and_dashboards: true,
                      account_domain_settings: true,
                      account_account_access: true,
                      account_add_and_edit_users: true,
                      account_add_and_edit_teams: true,
                      account_partition_by_teams: true,
                      account_presets: true,
                      account_edit_account_defaults: true,
                      account_modify_billing_and_change_name_on_contract: true,
                      account_add_and_edit_developer_apps_and_test_accounts: true,
                      account_user_table_access: true,
                      account_availability_management: true,
                      ong: {
                        connect: {
                          registered_charity_number: given_charity_number_set,
                        },
                      },
                    },
                  }
                },
              },
            },
          });
          if (responseUser) {
            const account = await prisma.account.create({
              data: {
                userId: responseUser.id,
                type: "credentials",
                provider: "admin-login",
                providerAccountId: responseUser.id,
              },
            });
            // 5 - We can update the charity in order to activate it and pass the user
            const responseONG = await prisma.oNG.update({
              where: {
                registered_charity_number: given_charity_number_set,
              },
              data: {
                activated,
                charity_number_set: given_charity_number_set,
                PermissionSets: {
                  createMany: {
                    data: [
                      {
                        name: "Super Admin",
                        accountOwner: false,
                        predefined: true,
                        editable: false,
                        super_admin: true,
                        crm_contacts_delete: 1,
                        crm_contacts_edit: 1,
                        crm_contacts_view: 1,
                        crm_companies_delete: 1,
                        crm_companies_edit: 1,
                        crm_companies_view: 1,
                        crm_deals_delete: 1,
                        crm_deals_edit: 1,
                        crm_deals_view: 1,
                        crm_tickets_delte: 1,
                        crm_tickets_edit: 1,
                        crm_tickets_view: 1,
                        crm_tasks_edit: 1,
                        crm_tasks_view: 1,
                        crm_notes_view: 1,
                        crm_custom_objects_delete: 1,
                        crm_custom_objects_edit: 1,
                        crm_custom_objects_view: 1,
                        crm_workflows_delete: true,
                        crm_workflows_edit: true,
                        crm_workflows_view: true,
                        crm_communicate: 1,
                        crm_bulk_delete: true,
                        crm_import: true,
                        crm_export: true,
                        crm_edit_property_settings: true,
                        crm_chatflows: true,
                        crm_customs_views: true,
                        marketing_lists_edit: true,
                        marketing_lists_view: true,
                        marketing_forms: true,
                        marketing_files: true,
                        marketing_marketing_access: true,
                        marketing_ads_publish: true,
                        marketing_ads_view: true,
                        marketing_campaigns_edit: true,
                        marketing_campaigns_view: true,
                        marketing_email_edit: true,
                        marketing_email_publish: true,
                        marketing_email_view: true,
                        marketing_social: 1,
                        marketing_content_staging: true,
                        marketing_blog_edit: true,
                        marketing_blog_publish: true,
                        marketing_blog_view: true,
                        marketing_landing_pages_edit: true,
                        marketing_landing_pages_publish: true,
                        marketing_landing_pages_view: true,
                        marketing_website_pages_edit: true,
                        marketing_website_pages_publish: true,
                        marketing_website_pages_view: true,
                        marketing_hubdb_edit: true,
                        marketing_hubdb_publish: true,
                        marketing_hubdb_view: true,
                        marketing_url_redirects_edit: true,
                        marketing_url_redirects_view: true,
                        marketing_design_tools: true,
                        sales_manage_product_library: true,
                        sales_create_custom_line_items: true,
                        sales_sales_access: true,
                        sales_templates: true,
                        sales_create_scheduling_pages_for_others: true,
                        sales_sales_professional: false,
                        sales_forecast_edit: 4,
                        sales_forecast_view: 3,
                        sales_playbooks_edit: false,
                        sales_playbooks_publish: false,
                        sales_playbooks_view: false,
                        sales_sequences: false,
                        sales_bulk_enroll_sequences: false,
                        sales_manage_payment_links: true,
                        sales_manage_payments_and_subscriptions: true,
                        service_service_access: true,
                        service_templates: true,
                        service_create_scheduling_pages_for_others: true,
                        reports_data_quality_tools_access: true,
                        reports_reports_access: true,
                        reports_dashboard_reports_and_analytics_create: true,
                        reports_dashboard_reports_and_analytics_edit: true,
                        reports_dashboard_reports_and_analytics_view: true,
                        reports_marketing_reports: true,
                        account_marketing_contacts_access: true,
                        account_app_marketplace_access: true,
                        account_asset_marketplace_access: true,
                        account_gdpr_delete_contacts: true,
                        account_hubdb_table_settings: true,
                        account_global_content_settings: true,
                        account_website_settings: true,
                        account_reports_and_dashboards: true,
                        account_domain_settings: true,
                        account_account_access: true,
                        account_add_and_edit_users: true,
                        account_add_and_edit_teams: true,
                        account_partition_by_teams: true,
                        account_presets: true,
                        account_edit_account_defaults: true,
                        account_modify_billing_and_change_name_on_contract: true,
                        account_add_and_edit_developer_apps_and_test_accounts: true,
                        account_user_table_access: true,
                        account_availability_management: true,
                      },{
                        name: "Super Admin with Sales Pro",
                        accountOwner: false,
                        editable: false,
                        predefined: true,
                        super_admin: true,
                        crm_contacts_delete: 1,
                        crm_contacts_edit: 1,
                        crm_contacts_view: 1,
                        crm_companies_delete: 1,
                        crm_companies_edit: 1,
                        crm_companies_view: 1,
                        crm_deals_delete: 1,
                        crm_deals_edit: 1,
                        crm_deals_view: 1,
                        crm_tickets_delte: 1,
                        crm_tickets_edit: 1,
                        crm_tickets_view: 1,
                        crm_tasks_edit: 1,
                        crm_tasks_view: 1,
                        crm_notes_view: 1,
                        crm_custom_objects_delete: 1,
                        crm_custom_objects_edit: 1,
                        crm_custom_objects_view: 1,
                        crm_workflows_delete: true,
                        crm_workflows_edit: true,
                        crm_workflows_view: true,
                        crm_communicate: 1,
                        crm_bulk_delete: true,
                        crm_import: true,
                        crm_export: true,
                        crm_edit_property_settings: true,
                        crm_chatflows: true,
                        crm_customs_views: true,
                        marketing_lists_edit: true,
                        marketing_lists_view: true,
                        marketing_forms: true,
                        marketing_files: true,
                        marketing_marketing_access: true,
                        marketing_ads_publish: true,
                        marketing_ads_view: true,
                        marketing_campaigns_edit: true,
                        marketing_campaigns_view: true,
                        marketing_email_edit: true,
                        marketing_email_publish: true,
                        marketing_email_view: true,
                        marketing_social: 1,
                        marketing_content_staging: true,
                        marketing_blog_edit: true,
                        marketing_blog_publish: true,
                        marketing_blog_view: true,
                        marketing_landing_pages_edit: true,
                        marketing_landing_pages_publish: true,
                        marketing_landing_pages_view: true,
                        marketing_website_pages_edit: true,
                        marketing_website_pages_publish: true,
                        marketing_website_pages_view: true,
                        marketing_hubdb_edit: true,
                        marketing_hubdb_publish: true,
                        marketing_hubdb_view: true,
                        marketing_url_redirects_edit: true,
                        marketing_url_redirects_view: true,
                        marketing_design_tools: true,
                        sales_manage_product_library: true,
                        sales_create_custom_line_items: true,
                        sales_sales_access: true,
                        sales_templates: true,
                        sales_create_scheduling_pages_for_others: true,
                        sales_sales_professional: true,
                        sales_forecast_edit: 1,
                        sales_forecast_view: 1,
                        sales_playbooks_edit: true,
                        sales_playbooks_publish: true,
                        sales_playbooks_view: true,
                        sales_sequences: true,
                        sales_bulk_enroll_sequences: true,
                        sales_manage_payment_links: true,
                        sales_manage_payments_and_subscriptions: true,
                        service_service_access: true,
                        service_templates: true,
                        service_create_scheduling_pages_for_others: true,
                        reports_data_quality_tools_access: true,
                        reports_reports_access: true,
                        reports_dashboard_reports_and_analytics_create: true,
                        reports_dashboard_reports_and_analytics_edit: true,
                        reports_dashboard_reports_and_analytics_view: true,
                        reports_marketing_reports: true,
                        account_marketing_contacts_access: true,
                        account_app_marketplace_access: true,
                        account_asset_marketplace_access: true,
                        account_gdpr_delete_contacts: true,
                        account_hubdb_table_settings: true,
                        account_global_content_settings: true,
                        account_website_settings: true,
                        account_reports_and_dashboards: true,
                        account_domain_settings: true,
                        account_account_access: true,
                        account_add_and_edit_users: true,
                        account_add_and_edit_teams: true,
                        account_partition_by_teams: true,
                        account_presets: true,
                        account_edit_account_defaults: true,
                        account_modify_billing_and_change_name_on_contract: true,
                        account_add_and_edit_developer_apps_and_test_accounts: true,
                        account_user_table_access: true,
                        account_availability_management: true,
                      }
                    ],
                  }
                }
              },
            });
            return res.status(200).json(responseONG);
          } else {
            // Stop the process the user creation had an issue
            const available = "userCreationIssue";
            return res.status(200).json(available);
          }
        }
      } else {
        // Stop the process the charity is already activated
        const available = "alreadyActivated";
        return res.status(200).json(available);
      }
    } else {
      const available = "An error occured";
      return res.status(500).end(available);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
