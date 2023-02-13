import prisma from "@lib/prisma";
import { HttpMethod } from "@types";
import { getServerSession } from "next-auth/next";

import type { NextApiRequest, NextApiResponse } from "next";
// import { requestWrapper } from "../auth/[...nextauth]";
import { requestWrapper } from "@twol/auth";
/*
 * Note: This endpoint is to switch from an account to another
 */

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const opts = requestWrapper(req, res);
  const session = await getServerSession(req, res, opts[2]);
  if (!session) return res.status(401).end();

  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { ongId = false } = req.query;

  if (Array.isArray(ongId))
    return res
      .status(400)
      .end("Mauvaise requête. Le paramètre email ne peut pas être un tableau.");

  try {
    if (ongId && ongId.length !== 0) {
      //validate userId format
      if (!/^[a-z0-9]*$/i.test(ongId)) {
        const available = "ongId invalid";
        return res.status(200).json(available);
      }

      if (session.user.id?.length === 0) {
        const available = "can't find session";
        return res.status(200).json(available);
      }

      const oId = ongId as string;

      const stopAccount = await prisma.b2E.updateMany({
        where: {
          userId: session.user.id,
          inUse: true,
        },
        data: {
          inUse: false,
        },
      });

      if (!stopAccount) {
        const available = "Issue while switching account";
        return res.status(200).json(available);
      }

      const activateAccount = await prisma.b2E.updateMany({
        where: {
          ongId: oId,
          userId: session.user.id,
        },
        data: {
          inUse: true,
        },
      });

      if (!activateAccount) {
        const available = "Issue while switching account";
        return res.status(200).json(available);
      }

      const dataONG = await prisma.oNG.findUnique({
        where: {
          id: oId,
        },
        select: {
          registered_name: true,
          name_set: true,
          id: true,
          B2E: {
            where: {
              userId: session.user.id,
              inUse: true,
            },
            select: {
              role: true,
              defaultHomepage: true,
              PermissionSets: {
                select:{
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
                }
              }
            },
          },
        },
      });

      if (!dataONG) {
        const available = "Issue while getting new ngo data";
        return res.status(200).json(available);
      }

      const dataOngConnected = await prisma.b2E.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          role: true,
          ongId: true,
          inUse: true,
          ong: {
            select: {
              registered_name: true,
              name_set: true,
            },
          },
        },
      });

      if (dataOngConnected === null && session.user.id!.length !== 0) {
        const available = "unknownOngList";
        return res.status(200).json(available);
      }
      let ongName: string;
      if (dataONG.name_set !== null) {
        ongName = dataONG.name_set;
      } else {
        ongName = dataONG.registered_name;
      }
      const available = {
        defaultHomepage: dataONG.B2E[0].defaultHomepage,
        inUseOngId: dataONG.id,
        inUseOngName: ongName,
        role: dataONG.B2E[0].role,
        ongConnected: dataOngConnected,
        permissionSet: dataONG.B2E[0].PermissionSets,
      };
      return res.status(200).json(available);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
