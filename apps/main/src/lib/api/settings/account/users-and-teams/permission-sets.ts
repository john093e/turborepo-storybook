import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { PermissionSets } from ".prisma/client";
import type { Session } from "next-auth";


/**
 * Get PermissionSets Settings
 *
 * Fetches & returns all users from an account available depending
 * on a `userId` for fetching ong and the following filter query parameter.
 * - userId
 * - toSkip
 * - toTake
 * - searchTerm
 * - toOrderBy
 * - toOrderByStartWith
 *
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getPermissionSetsSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<PermissionSets> | (PermissionSets | null)>> {
  const { userId, toSkip, toTake, searchTerm, toOrderBy, toOrderByStartWith } =
    req.query;
  // TODO validate data
  // userId | take | skip
  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  if (
    toTake === null ||
    toTake === undefined ||
    toSkip === null ||
    toSkip === undefined
  ) {
    return res.status(500).end("Server failed to get pagination");
  }

  if (
    toOrderBy === null ||
    toOrderBy === undefined ||
    toOrderByStartWith === null ||
    toOrderByStartWith === undefined
  ) {
    return res.status(500).end("Server failed to get OrderBy data");
  }

  if (Array.isArray(searchTerm))
    return res
      .status(400)
      .end("Bad request. searchTerm parameter cannot be an array.");

  try {
    if (userId) {
      const fetchOngId = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          B2E: {
            where: {
              inUse: true,
            },
            select: {
              ongId: true,
            },
          },
        },
      });
      if (fetchOngId) {
        if (fetchOngId.B2E[0].ongId) {
          const take: number = +toTake;
          const skip: number = +toSkip;

          const searchTermFilter =
            searchTerm !== "" && searchTerm !== null
              ? { name: { contains: searchTerm as string } }
              : {};

          // Count PermissionSets
          const permissionSetsCount = await prisma.permissionSets.count({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
              predefined: true,
              ...searchTermFilter,
            },
          });
          //TODO
          // order by :
          // - name
          // - access
          // - lastActive
          const OrderBySet =
            toOrderBy !== "" &&
              toOrderBy !== null &&
              toOrderByStartWith !== "" &&
              toOrderByStartWith !== null
              ? toOrderBy === "name"
                ? {
                  orderBy: {
                    [toOrderBy as string]: toOrderByStartWith as string,
                  },
                }
                : toOrderBy === "users"
                  ? {
                    orderBy: {
                      B2E: {
                        _count: toOrderByStartWith as string,
                      },
                    },
                  }
                  : undefined
              : undefined;

          const permissionSets = await prisma.permissionSets.findMany({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
              predefined: true,
              ...searchTermFilter,
            },
            select: {
              id: true,
              name: true,
              super_admin: true,
              editable: true,
              sales_sales_professional: true,
              marketing_marketing_access: true,
              sales_sales_access: true,
              service_service_access: true,
              reports_reports_access: true,
              account_account_access: true,
              _count: {
                select: {
                  B2E: true,
                },
              },
            },
            skip: take * (skip - 1),
            take: take,
            ...OrderBySet,
          });



          let dataToSend: {
            id: string;
            name: string | null;
            editable: boolean;
            access: {
              SuperAdmin: boolean;
              SalesProfessional: boolean;
              Marketing: boolean;
              Sales: boolean;
              Service: boolean;
              Reports: boolean;
              Account: boolean;
            };
            users: number;
          }[] = [];

          if (permissionSets.length > 0) {
            permissionSets.map(permissionSet => {
              dataToSend.push({
                id: permissionSet.id,
                name: permissionSet.name,
                editable: permissionSet.editable,
                access: {
                  SuperAdmin: permissionSet.super_admin ? permissionSet.super_admin : false,
                  SalesProfessional: permissionSet.sales_sales_professional,
                  Marketing: permissionSet.marketing_marketing_access,
                  Sales: permissionSet.sales_sales_access,
                  Service: permissionSet.service_service_access,
                  Reports: permissionSet.reports_reports_access,
                  Account: permissionSet.account_account_access,
                },
                users: permissionSet._count.B2E,
              })
            })
          }

          const response = {
            data: dataToSend,
            pagination: {
              total: permissionSetsCount,
              pageCount: Math.ceil(permissionSetsCount / take),
              currentPage: skip,
              perPage: take,
              from: (skip - 1) * take + 1,
              to: (skip - 1) * take + permissionSets.length,
            },
          };

          return res.status(200).json(response);
        } else {
          return res.status(500).end("Server failed to get Account ID");
        }
      } else {
        return res.status(500).end("You don't have an account connected");
      }
    } else {
      return res.status(500).end("Server failed to get user ID");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * TODO
 * Delete Permission Set
 *
 * Deletes a team from the database using a provided `userId` & the team "id" query
 * parameter.
 * - userId
 * - id
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function deletePermissionSetsSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { userId, id } = req.query;

  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (Array.isArray(id))
    return res
      .status(400)
      .end("Bad request. the team id parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  try {
    // fetch the user NGO
    const fetchOngId = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        B2E: {
          where: {
            inUse: true,
          },
          select: {
            ongId: true,
          },
        },
      },
    });
    if (fetchOngId) {
      if (fetchOngId.B2E[0].ongId) {
        // get the permission sets data and B2E relation
        const getB2Erelation = await prisma.permissionSets.findFirst({
          where: {
            id: id,
            ongId: fetchOngId.B2E[0].ongId,
          },
          select: {
            name: true,
            predefined: true,
            accountOwner: true,
            editable: true,
            super_admin: true,
            crm_contacts_delete: true,
            crm_contacts_edit: true,
            crm_contacts_view: true,
            crm_companies_delete: true,
            crm_companies_edit: true,
            crm_companies_view: true,
            crm_deals_delete: true,
            crm_deals_edit: true,
            crm_deals_view: true,
            crm_tickets_delte: true,
            crm_tickets_edit: true,
            crm_tickets_view: true,
            crm_tasks_edit: true,
            crm_tasks_view: true,
            crm_notes_view: true,
            crm_custom_objects_delete: true,
            crm_custom_objects_edit: true,
            crm_custom_objects_view: true,
            crm_workflows_delete: true,
            crm_workflows_edit: true,
            crm_workflows_view: true,
            crm_communicate: true,
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
            marketing_social: true,
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
            sales_forecast_edit: true,
            sales_forecast_view: true,
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
            B2E: {
              select: {
                id: true,
              }
            }
          }
        });

        if (getB2Erelation) {
          // we got the permission
          //check the permission is deletable
          if (getB2Erelation.editable || !getB2Erelation.accountOwner) {
            // check the permission got B2E
            if (getB2Erelation.B2E.length > 0) {
              // Function for creating permission
              async function createPermission(B2EId:string, ongId: string, permissionSetDataToSet: any) {
                return await prisma.oNG.update({
                  where: {
                    id: ongId,
                  },
                  data: {
                    PermissionSets: {
                      create: {
                          predefined: false,
                          accountOwner: false,
                          editable: true,
                          super_admin: permissionSetDataToSet.super_admin,
                          crm_contacts_delete: permissionSetDataToSet.crm_contacts_delete,
                          crm_contacts_edit: permissionSetDataToSet.crm_contacts_edit,
                          crm_contacts_view: permissionSetDataToSet.crm_contacts_view,
                          crm_companies_delete: permissionSetDataToSet.crm_companies_delete,
                          crm_companies_edit: permissionSetDataToSet.crm_companies_edit,
                          crm_companies_view: permissionSetDataToSet.crm_companies_view,
                          crm_deals_delete: permissionSetDataToSet.crm_deals_delete,
                          crm_deals_edit: permissionSetDataToSet.crm_deals_edit,
                          crm_deals_view: permissionSetDataToSet.crm_deals_view,
                          crm_tickets_delte: permissionSetDataToSet.crm_tickets_delte,
                          crm_tickets_edit: permissionSetDataToSet.crm_tickets_edit,
                          crm_tickets_view: permissionSetDataToSet.crm_tickets_view,
                          crm_tasks_edit: permissionSetDataToSet.crm_tasks_edit,
                          crm_tasks_view: permissionSetDataToSet.crm_tasks_view,
                          crm_notes_view: permissionSetDataToSet.crm_notes_view,
                          crm_custom_objects_delete: permissionSetDataToSet.crm_custom_objects_delete,
                          crm_custom_objects_edit: permissionSetDataToSet.crm_custom_objects_edit,
                          crm_custom_objects_view: permissionSetDataToSet.crm_custom_objects_view,
                          crm_workflows_delete: permissionSetDataToSet.crm_workflows_delete,
                          crm_workflows_edit: permissionSetDataToSet.crm_workflows_edit,
                          crm_workflows_view: permissionSetDataToSet.crm_workflows_view,
                          crm_communicate: permissionSetDataToSet.crm_communicate,
                          crm_bulk_delete: permissionSetDataToSet.crm_bulk_delete,
                          crm_import: permissionSetDataToSet.crm_import,
                          crm_export: permissionSetDataToSet.crm_export,
                          crm_edit_property_settings: permissionSetDataToSet.crm_edit_property_settings,
                          crm_chatflows: permissionSetDataToSet.crm_chatflows,
                          crm_customs_views: permissionSetDataToSet.crm_customs_views,
                          marketing_lists_edit: permissionSetDataToSet.marketing_lists_edit,
                          marketing_lists_view: permissionSetDataToSet.marketing_lists_view,
                          marketing_forms: permissionSetDataToSet.marketing_forms,
                          marketing_files: permissionSetDataToSet.marketing_files,
                          marketing_marketing_access: permissionSetDataToSet.marketing_marketing_access,
                          marketing_ads_publish: permissionSetDataToSet.marketing_ads_publish,
                          marketing_ads_view: permissionSetDataToSet.marketing_ads_view,
                          marketing_campaigns_edit: permissionSetDataToSet.marketing_campaigns_edit,
                          marketing_campaigns_view: permissionSetDataToSet.marketing_campaigns_view,
                          marketing_email_edit: permissionSetDataToSet.marketing_email_edit,
                          marketing_email_publish: permissionSetDataToSet.marketing_email_publish,
                          marketing_email_view: permissionSetDataToSet.marketing_email_view,
                          marketing_social: permissionSetDataToSet.marketing_social,
                          marketing_content_staging: permissionSetDataToSet.marketing_content_staging,
                          marketing_blog_edit: permissionSetDataToSet.marketing_blog_edit,
                          marketing_blog_publish: permissionSetDataToSet.marketing_blog_publish,
                          marketing_blog_view: permissionSetDataToSet.marketing_blog_view,
                          marketing_landing_pages_edit: permissionSetDataToSet.marketing_landing_pages_edit,
                          marketing_landing_pages_publish: permissionSetDataToSet.marketing_landing_pages_publish,
                          marketing_landing_pages_view: permissionSetDataToSet.marketing_landing_pages_view,
                          marketing_website_pages_edit: permissionSetDataToSet.marketing_website_pages_edit,
                          marketing_website_pages_publish: permissionSetDataToSet.marketing_website_pages_publish,
                          marketing_website_pages_view: permissionSetDataToSet.marketing_website_pages_view,
                          marketing_hubdb_edit: permissionSetDataToSet.marketing_hubdb_edit,
                          marketing_hubdb_publish: permissionSetDataToSet.marketing_hubdb_publish,
                          marketing_hubdb_view: permissionSetDataToSet.marketing_hubdb_view,
                          marketing_url_redirects_edit: permissionSetDataToSet.marketing_url_redirects_edit,
                          marketing_url_redirects_view: permissionSetDataToSet.marketing_url_redirects_view,
                          marketing_design_tools: permissionSetDataToSet.marketing_design_tools,
                          sales_manage_product_library: permissionSetDataToSet.sales_manage_product_library,
                          sales_create_custom_line_items: permissionSetDataToSet.sales_create_custom_line_items,
                          sales_sales_access: permissionSetDataToSet.sales_sales_access,
                          sales_templates: permissionSetDataToSet.sales_templates,
                          sales_create_scheduling_pages_for_others: permissionSetDataToSet.sales_create_scheduling_pages_for_others,
                          sales_sales_professional: permissionSetDataToSet.sales_sales_professional,
                          sales_forecast_edit: permissionSetDataToSet.sales_forecast_edit,
                          sales_forecast_view: permissionSetDataToSet.sales_forecast_view,
                          sales_playbooks_edit: permissionSetDataToSet.sales_playbooks_edit,
                          sales_playbooks_publish: permissionSetDataToSet.sales_playbooks_publish,
                          sales_playbooks_view: permissionSetDataToSet.sales_playbooks_view,
                          sales_sequences: permissionSetDataToSet.sales_sequences,
                          sales_bulk_enroll_sequences: permissionSetDataToSet.sales_bulk_enroll_sequences,
                          sales_manage_payment_links: permissionSetDataToSet.sales_manage_payment_links,
                          sales_manage_payments_and_subscriptions: permissionSetDataToSet.sales_manage_payments_and_subscriptions,
                          service_service_access: permissionSetDataToSet.service_service_access,
                          service_templates: permissionSetDataToSet.service_templates,
                          service_create_scheduling_pages_for_others: permissionSetDataToSet.service_create_scheduling_pages_for_others,
                          reports_data_quality_tools_access: permissionSetDataToSet.reports_data_quality_tools_access,
                          reports_reports_access: permissionSetDataToSet.reports_reports_access,
                          reports_dashboard_reports_and_analytics_create: permissionSetDataToSet.reports_dashboard_reports_and_analytics_create,
                          reports_dashboard_reports_and_analytics_edit: permissionSetDataToSet.reports_dashboard_reports_and_analytics_edit,
                          reports_dashboard_reports_and_analytics_view: permissionSetDataToSet.reports_dashboard_reports_and_analytics_view,
                          reports_marketing_reports: permissionSetDataToSet.reports_marketing_reports,
                          account_marketing_contacts_access: permissionSetDataToSet.account_marketing_contacts_access,
                          account_app_marketplace_access: permissionSetDataToSet.account_app_marketplace_access,
                          account_asset_marketplace_access: permissionSetDataToSet.account_asset_marketplace_access,
                          account_gdpr_delete_contacts: permissionSetDataToSet.account_gdpr_delete_contacts,
                          account_hubdb_table_settings: permissionSetDataToSet.account_hubdb_table_settings,
                          account_global_content_settings: permissionSetDataToSet.account_global_content_settings,
                          account_website_settings: permissionSetDataToSet.account_website_settings,
                          account_reports_and_dashboards: permissionSetDataToSet.account_reports_and_dashboards,
                          account_domain_settings: permissionSetDataToSet.account_domain_settings,
                          account_account_access: permissionSetDataToSet.account_account_access,
                          account_add_and_edit_users: permissionSetDataToSet.account_add_and_edit_users,
                          account_add_and_edit_teams: permissionSetDataToSet.account_add_and_edit_teams,
                          account_partition_by_teams: permissionSetDataToSet.account_partition_by_teams,
                          account_presets: permissionSetDataToSet.account_presets,
                          account_edit_account_defaults: permissionSetDataToSet.account_edit_account_defaults,
                          account_modify_billing_and_change_name_on_contract: permissionSetDataToSet.account_modify_billing_and_change_name_on_contract,
                          account_add_and_edit_developer_apps_and_test_accounts: permissionSetDataToSet.account_add_and_edit_developer_apps_and_test_accounts,
                          account_user_table_access: permissionSetDataToSet.account_user_table_access,
                          account_availability_management: permissionSetDataToSet.account_availability_management,
                          B2E:{
                            connect: {
                              id: B2EId,
                            }
                          }
                      }
                    },
                  },
                });
              };
              // for each B2E create a permission set
              for (const user of getB2Erelation.B2E) {
                const permissionCreated = await createPermission(user.id, fetchOngId.B2E[0].ongId, getB2Erelation);
                if (permissionCreated) {
                  // do nothing
                }else{
                  // stop the process we got an issue
                  return res.status(500).end("Server failed to delete this permission set");
                }
              }


              // delete the permission sets
              const deletePermissionSet = await prisma.permissionSets.delete({
                where: {
                  id: id,
                },
              });
              if(deletePermissionSet) {
                return res.status(200).end();
              }else{
                //we could succeed to delete this permission set
                return res.status(500).end("Server failed to delete this permission set");
              }

 
            } else {
              // there is no B2E so we can delete directly the permission
              const deletePermissionSet = await prisma.permissionSets.delete({
                where: {
                  id: id,
                },
              });
              if(deletePermissionSet) {
                return res.status(200).end();
              }else{
                //we could succeed to delete this permission set
                return res.status(500).end("Server failed to delete this permission set");
              }
            }
          } else {
            //we can't delete this permission set
            return res.status(500).end("Can't delete this permission set");
          }
        } else {
          // there is no permission set
          return res.status(500).end("Server failed to get permission set");
        }
      } else {
        return res.status(500).end("Server failed to get Account ID");
      }
    } else {
      return res.status(500).end("You don't have an account connected");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Account Settings
 *
 * Updates an Account settings using a collection of provided
 * query parameters. These include the following:
 *  - account_name
 *  - dateFormat
 *  - fiscalYear
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function updatePermissionSetsSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<PermissionSets>> {
  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  const data = JSON.parse(req.body);
  //TODO : validate data
  //  - account_name
  //  - dateFormat
  //  - fiscalYear
  try {
    const fetchOngId = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: {
        B2E: {
          where: {
            inUse: true,
          },
          select: {
            ongId: true,
          },
        },
      },
    });

    if (fetchOngId) {
      if (fetchOngId.B2E[0].ongId) {
        const response = await prisma.oNG.update({
          where: {
            id: fetchOngId.B2E[0].ongId,
          },
          data: {
            account_name: data.account_name,
            dateFormat: data.dateFormat,
            fiscalYear: data.fiscalYear,
          },
        });
        return res.status(200).json(response);
      }
      return res.status(500).end("Server failed to get Account ID");
    }
    return res.status(500).end("You don't have an account connected");
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}


