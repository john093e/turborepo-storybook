import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";
import { unstable_getServerSession } from "next-auth/next";

import type { NextApiRequest, NextApiResponse } from "next";
import { requestWrapper } from "../auth/[...nextauth]";

/*
 * Note: This endpoint is to return wich charity is actually in use and the role of the user
 */

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const opts = requestWrapper(req, res);
  const session = await unstable_getServerSession(req, res, opts[2]);
  if (!session) return res.status(401).end();

  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId = false } = req.query;

  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Mauvaise requête. Le paramètre email ne peut pas être un tableau.");

  try {
    if (userId && userId.length !== 0) {
      //validate userId format
      if (!/^[a-z0-9]*$/i.test(userId)) {
        const available = "userId invalid";
        return res.status(500).end(available);
      }
      if (userId !== session.user.id) {
        const available = "userId mismatch session";
        return res.status(500).end(available);
      }

      const uId = userId as string;

      const dataUser = await prisma.user.findFirst({
        where: {
          id: uId,
        },
        select: {
          dateFormat: true,
          email: true,
          firstname: true,
          image: true,
          lastname: true,
          language: true,
          B2E: {
            where: {
              inUse: true,
            },
            select: {
              defaultHomepage: true,
              role: true,
              ongId: true,
              PermissionSets : {
                select: {
                  name: true,
                  accountOwner: true,
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
                },
              },
            },
          },
        },
      });

      if (dataUser === null && uId.length !== 0) {
        const available = "unknown";
        return res.status(500).end(available);
      } else if (dataUser !== null) {

        const oId = dataUser.B2E[0].ongId as string;
        const dataONG = await prisma.oNG.findUnique({
          where: {
            id: oId,
          },
          select: {
            registered_name: true,
            account_name: true,
            id: true,
          },
        });

        if (dataONG === null && oId.length !== 0) {
          const available = "unknownOngLinked";
          return res.status(500).end(available);

        } else if (dataONG !== null) {
          const dataOngConnected = await prisma.b2E.findMany({
            where: {
              userId: uId,
              status: 2,
            },
            select: {
              inUse: true,
              ong: {
                select: {
                  registered_name: true,
                  account_name: true,
                },
              },
              ongId: true,
              role: true,
            },
          });

          if (dataOngConnected === null && uId.length !== 0) {
            const available = "unknownOngList";
            return res.status(500).end(available);
          } else if (dataOngConnected !== null) {
            let ongName: string;
            if (dataONG.account_name !== null) {
              ongName = dataONG.account_name;
            } else {
              ongName = dataONG.registered_name;
            }

            const available = {
              dateFormat: dataUser.dateFormat,
              defaultHomepage: dataUser.B2E[0].defaultHomepage,
              email: dataUser.email,
              firstname: dataUser.firstname,
              fullName: dataUser.firstname + " " + dataUser.lastname,
              image: dataUser.image,
              inUseOngId: dataONG.id,
              inUseOngName: ongName,
              language: dataUser.language,
              lastname: dataUser.lastname,
              ongConnected: dataOngConnected,
              role: dataUser.B2E[0].role,
              permissionSet: dataUser.B2E[0].PermissionSets,
            };
            return res.status(200).json(available);
          } else {
            const available = "error";
            return res.status(500).end(available);
          }
        } else {
          const available = "error";
          return res.status(500).end(available);
        }
      } else {
        const available = "error";
        return res.status(500).end(available);
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
