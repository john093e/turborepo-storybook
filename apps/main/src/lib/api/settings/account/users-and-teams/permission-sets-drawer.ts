import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Teams } from ".prisma/client";
import type { Session } from "next-auth";

/**
 * Get PermissionSetsDrawer Settings
 *
 * Fetches & returns all users from an account available depending
 * on a `userId` for fetching ong and the following filter query parameter.
 * - userId
 * - permissionSetId
 *
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getPermissionSetsDrawerSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  id: string,
  name: string,
  accountOwner: boolean,
  editable: boolean,
  predefined: boolean,
  super_admin: boolean,
  //CRM
  crm_contacts_delete: number,
  crm_contacts_edit: number,
  crm_contacts_view: number,
  crm_companies_delete: number,
  crm_companies_edit: number,
  crm_companies_view: number,
  crm_deals_delete: number,
  crm_deals_edit: number,
  crm_deals_view: number,
  crm_tickets_delte: number,
  crm_tickets_edit: number,
  crm_tickets_view: number,
  crm_tasks_edit: number,
  crm_tasks_view: number,
  crm_notes_view: number,
  crm_custom_objects_delete: number,
  crm_custom_objects_edit: number,
  crm_custom_objects_view: number,
  crm_workflows_delete: boolean,
  crm_workflows_edit: boolean,
  crm_workflows_view: boolean,
  crm_communicate: number,
  crm_bulk_delete: boolean,
  crm_import: boolean,
  crm_export: boolean,
  crm_edit_property_settings: boolean,
  crm_chatflows: boolean,
  crm_customs_views: boolean,
  //Marketing
  marketing_lists_edit: boolean,
  marketing_lists_view: boolean,
  marketing_forms: boolean,
  marketing_files: boolean,
  marketing_marketing_access: boolean,
  marketing_ads_publish: boolean,
  marketing_ads_view: boolean,
  marketing_campaigns_edit: boolean,
  marketing_campaigns_view: boolean,
  marketing_email_edit: boolean,
  marketing_email_publish: boolean,
  marketing_email_view: boolean,
  marketing_social: number,
  marketing_content_staging: boolean,
  marketing_blog_edit: boolean,
  marketing_blog_publish: boolean,
  marketing_blog_view: boolean,
  marketing_landing_pages_edit: boolean,
  marketing_landing_pages_publish: boolean,
  marketing_landing_pages_view: boolean,
  marketing_website_pages_edit: boolean,
  marketing_website_pages_publish: boolean,
  marketing_website_pages_view: boolean,
  marketing_hubdb_edit: boolean,
  marketing_hubdb_publish: boolean,
  marketing_hubdb_view: boolean,
  marketing_url_redirects_edit: boolean,
  marketing_url_redirects_view: boolean,
  marketing_design_tools: boolean,
  //Sales
  sales_manage_product_library: boolean,
  sales_create_custom_line_items: boolean,
  sales_sales_access: boolean,
  sales_templates: boolean,
  sales_create_scheduling_pages_for_others: boolean,
  sales_sales_professional: boolean,
  sales_forecast_edit: number,
  sales_forecast_view: number,
  sales_playbooks_edit: boolean,
  sales_playbooks_publish: boolean,
  sales_playbooks_view: boolean,
  sales_sequences: boolean,
  sales_bulk_enroll_sequences: boolean,
  sales_manage_payment_links: boolean,
  sales_manage_payments_and_subscriptions: boolean,
  //Services
  service_service_access: boolean,
  service_templates: boolean,
  service_create_scheduling_pages_for_others: boolean,
  //Reports
  reports_data_quality_tools_access: boolean,
  reports_reports_access: boolean,
  reports_dashboard_reports_and_analytics_create: boolean,
  reports_dashboard_reports_and_analytics_edit: boolean,
  reports_dashboard_reports_and_analytics_view: boolean,
  reports_marketing_reports: boolean,
  //Account
  account_marketing_contacts_access: boolean,
  account_app_marketplace_access: boolean,
  account_asset_marketplace_access: boolean,
  account_gdpr_delete_contacts: boolean,
  account_hubdb_table_settings: boolean,
  account_global_content_settings: boolean,
  account_website_settings: boolean,
  account_reports_and_dashboards: boolean,
  account_domain_settings: boolean,
  account_account_access: boolean,
  account_add_and_edit_users: boolean,
  account_add_and_edit_teams: boolean,
  account_partition_by_teams: boolean,
  account_presets: boolean,
  account_edit_account_defaults: boolean,
  account_modify_billing_and_change_name_on_contract: boolean,
  account_add_and_edit_developer_apps_and_test_accounts: boolean,
  account_user_table_access: boolean,
  account_availability_management: boolean,
}>> {
  const { userId, permissionSetId } = req.query;
  // TODO validate data
  // userId
  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  // permission set id
  if (Array.isArray(permissionSetId))
    return res
      .status(400)
      .end("Bad request. The team id parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  try {
    if (userId) {
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
          // if update get the selected teams settings
          const permissionSet = await prisma.permissionSets.findMany({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
              id: permissionSetId,
            },
            select: {
              id: true,
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
            },
          });

          // construct response
          if (permissionSet) {
            return res.status(200).json(permissionSet);

          } else {
            return res.status(500).end("Server failed to fetch Permission Set data");

          }

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
 * Create PermissionSetsDrawer
 *
 * Creates a new Team from a set of provided query parameters.
 * These include:
 *  - name
 *  - parentTeamId
 *  - users <Array>
 *  - userId
 *
 * Once created, the new PermissionSetsDrawer `email` and `link` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
interface PermissionSetsData {
  "CRM": {
    "Contacts": {
      "Delete": number,
      "Edit": number,
      "View": number
    },
    "Companies": {
      "Delete": number,
      "Edit": number,
      "View": number
    },
    "Deals": {
      "Delete": number,
      "Edit": number,
      "View": number
    },
    "Tickets": {
      "Delete": number,
      "Edit": number,
      "View": number
    },
    "Tasks": {
      "Edit": number,
      "View": number
    },
    "Notes": {
      "View": number
    },
    "Custom Objects": {
      "Delete": number,
      "Edit": number,
      "View": number
    },
    "Workflows": {
      "Delete": boolean,
      "Edit": boolean,
      "View": boolean
    },
    "Communicate": number,
    "Bulk delete": boolean,
    "Import": boolean,
    "Export": boolean,
    "Edit property settings": boolean,
    "Chatflows": boolean,
    "Custom views": boolean
  },
  "Marketing": {
    "Lists": {
      "Edit": boolean,
      "View": boolean
    },
    "Forms": boolean,
    "Files": boolean,
    "Marketing Access": boolean,
    "Ads": {
      "Publish": boolean,
      "View": boolean
    },
    "Campaigns": {
      "Edit": boolean,
      "View": boolean
    },
    "Email": {
      "Edit": boolean,
      "Publish": boolean,
      "View": boolean
    },
    "Social": number,
    "Content staging": boolean,
    "Blog": {
      "Edit": boolean,
      "Publish": boolean,
      "View": boolean
    },
    "Landing pages": {
      "Edit": boolean,
      "Publish": boolean,
      "View": boolean
    },
    "Website pages": {
      "Edit": boolean,
      "Publish": boolean,
      "View": boolean
    },
    "HubDB": {
      "Edit": boolean,
      "Publish": boolean,
      "View": boolean
    },
    "URL Redirects": {
      "Edit": boolean,
      "View": boolean
    },
    "Design tools": boolean
  },
  "Sales": {
    "Manage product library": boolean,
    "Create custom line items": boolean,
    "Sales Access": boolean,
    "Templates": boolean,
    "Create scheduling pages for others": boolean,
    "Sales Professional": boolean,
    "Forecast": {
      "Edit": number,
      "View": number
    },
    "Playbooks": {
      "Edit": boolean,
      "Publish": boolean,
      "View": boolean
    },
    "Sequences": boolean,
    "Bulk enroll sequences": boolean,
    "Manage payment links": boolean,
    "Manage payments and subscriptions": boolean
  },
  "Service": {
    "Service Access": boolean,
    "Templates": boolean,
    "Create scheduling pages for others": boolean
  },
  "Reports": {
    "Data quality tools access": boolean,
    "Reports Access": boolean,
    "Dashboard, reports, and analytics": {
      "Create": boolean,
      "Edit": boolean,
      "View": boolean
    },
    "Marketing reports": boolean
  },
  "Account": {
    "Marketing contacts access": boolean,
    "App Marketplace access": boolean,
    "Asset Marketplace access": boolean,
    "GDPR delete contacts": boolean,
    "HubDB table settings": boolean,
    "Global content settings": boolean,
    "Website settings": boolean,
    "Reports and dashboards": boolean,
    "Domain settings": boolean,
    "Account Access": boolean,
    "Add and edit users": boolean,
    "Add and edit teams": boolean,
    "Partition by teams": boolean,
    "Presets": boolean,
    "Edit account defaults": boolean,
    "Modify billing and change name on contract": boolean,
    "Add and edit developer apps and test accounts": boolean,
    "User table access": boolean,
    "Availability Management": boolean
  }
}

export async function createPermissionSetsDrawerSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { userId, name, setAsSuperAdmin, setAsSuperAdminWithSalesPro } = req.body;

  const newPermission = req.body.permissionDataSet as PermissionSetsData;

  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (Array.isArray(name))
    return res
      .status(400)
      .end("Bad request. name parameter cannot be an array.");

  if (Array.isArray(setAsSuperAdmin))
    return res
      .status(400)
      .end("Bad request. setAsSuperAdmin parameter cannot be an array.");

  if (Array.isArray(setAsSuperAdminWithSalesPro))
    return res
      .status(400)
      .end("Bad request. setAsSuperAdminWithSalesPro parameter cannot be an array.");

  if (typeof newPermission !== 'object' || Array.isArray(newPermission) || newPermission === null)
    return res
      .status(400)
      .end("Bad request. permission parameter bad format.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  try {
    // check if we got user id
    if (userId) {
      //check if userId exist and fetch his data :
      // B2E.ongId
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
      // Check if we fetch something
      if (fetchOngId) {
        // check if we fetch an NGO related to the userId
        if (fetchOngId.B2E[0].ongId) {
          // Add permission set in db
          // We can create the permission set
          if (name && name !== "" && setAsSuperAdmin) {
            const responsePermissionSet = await prisma.oNG.update({
              where: {
                id: fetchOngId.B2E[0].ongId,
              },
              data: {
                PermissionSets: {
                  create: {
                    name: name,
                    predefined: true,
                    accountOwner: false,
                    editable: true,
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
                    sales_sales_professional: setAsSuperAdminWithSalesPro ? true : false,
                    sales_forecast_edit: setAsSuperAdminWithSalesPro ? 1 : 4,
                    sales_forecast_view: setAsSuperAdminWithSalesPro ? 1 : 4,
                    sales_playbooks_edit: setAsSuperAdminWithSalesPro ? true : false,
                    sales_playbooks_publish: setAsSuperAdminWithSalesPro ? true : false,
                    sales_playbooks_view: setAsSuperAdminWithSalesPro ? true : false,
                    sales_sequences: setAsSuperAdminWithSalesPro ? true : false,
                    sales_bulk_enroll_sequences: setAsSuperAdminWithSalesPro ? true : false,
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
            });
            if (responsePermissionSet) {
              return res.status(201).json("allGood");
            } else {
              return res.status(500).end("Server failed to create the permission set");
            }
          } else if (name && name !== "" && newPermission) {
            const responsePermissionSet = await prisma.oNG.update({
              where: {
                id: fetchOngId.B2E[0].ongId,
              },
              data: {
                PermissionSets: {
                  create: {
                    name: name,
                    predefined: true,
                    accountOwner: false,
                    editable: true,
                    super_admin: false,
                    crm_contacts_delete: newPermission["CRM"]["Contacts"]["Delete"],
                    crm_contacts_edit: newPermission["CRM"]["Contacts"]["Edit"],
                    crm_contacts_view: newPermission["CRM"]["Contacts"]["View"],
                    crm_companies_delete: newPermission["CRM"]["Companies"]["Delete"],
                    crm_companies_edit: newPermission["CRM"]["Companies"]["Edit"],
                    crm_companies_view: newPermission["CRM"]["Companies"]["View"],
                    crm_deals_delete: newPermission["CRM"]["Deals"]["Delete"],
                    crm_deals_edit: newPermission["CRM"]["Deals"]["Edit"],
                    crm_deals_view: newPermission["CRM"]["Deals"]["View"],
                    crm_tickets_delte: newPermission["CRM"]["Tickets"]["Delete"],
                    crm_tickets_edit: newPermission["CRM"]["Tickets"]["Edit"],
                    crm_tickets_view: newPermission["CRM"]["Tickets"]["View"],
                    crm_tasks_edit: newPermission["CRM"]["Tasks"]["Edit"],
                    crm_tasks_view: newPermission["CRM"]["Tasks"]["View"],
                    crm_notes_view: newPermission["CRM"]["Notes"]["View"],
                    crm_custom_objects_delete: newPermission["CRM"]["Custom Objects"]["Delete"],
                    crm_custom_objects_edit: newPermission["CRM"]["Custom Objects"]["Edit"],
                    crm_custom_objects_view: newPermission["CRM"]["Custom Objects"]["View"],
                    crm_workflows_delete: newPermission["CRM"]["Workflows"]["Delete"],
                    crm_workflows_edit: newPermission["CRM"]["Workflows"]["Edit"],
                    crm_workflows_view: newPermission["CRM"]["Workflows"]["View"],
                    crm_communicate: newPermission["CRM"]["Communicate"],
                    crm_bulk_delete: newPermission["CRM"]["Bulk delete"],
                    crm_import: newPermission["CRM"]["Import"],
                    crm_export: newPermission["CRM"]["Export"],
                    crm_edit_property_settings: newPermission["CRM"]["Edit property settings"],
                    crm_chatflows: newPermission["CRM"]["Chatflows"],
                    crm_customs_views: newPermission["CRM"]["Custom views"],
                    marketing_lists_edit: newPermission["Marketing"]["Lists"]["Edit"],
                    marketing_lists_view: newPermission["Marketing"]["Lists"]["View"],
                    marketing_forms: newPermission["Marketing"]["Forms"],
                    marketing_files: newPermission["Marketing"]["Files"],
                    marketing_marketing_access: newPermission["Marketing"]["Marketing Access"],
                    marketing_ads_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Ads"]["Publish"] : false,
                    marketing_ads_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Ads"]["View"] : false,
                    marketing_campaigns_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Campaigns"]["Edit"] : false,
                    marketing_campaigns_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Campaigns"]["View"] : false,
                    marketing_email_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Email"]["Edit"] : false,
                    marketing_email_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Email"]["Publish"] : false,
                    marketing_email_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Email"]["View"] : false,
                    marketing_social: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Social"] : 4,
                    marketing_content_staging: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Content staging"] : false,
                    marketing_blog_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Blog"]["Edit"] : false,
                    marketing_blog_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Blog"]["Publish"] : false,
                    marketing_blog_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Blog"]["View"] : false,
                    marketing_landing_pages_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Landing pages"]["Edit"] : false,
                    marketing_landing_pages_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Landing pages"]["Publish"] : false,
                    marketing_landing_pages_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Landing pages"]["View"] : false,
                    marketing_website_pages_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Website pages"]["Edit"] : false,
                    marketing_website_pages_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Website pages"]["Publish"] : false,
                    marketing_website_pages_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Website pages"]["View"] : false,
                    marketing_hubdb_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["HubDB"]["Edit"] : false,
                    marketing_hubdb_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["HubDB"]["Publish"] : false,
                    marketing_hubdb_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["HubDB"]["View"] : false,
                    marketing_url_redirects_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["URL Redirects"]["Edit"] : false,
                    marketing_url_redirects_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["URL Redirects"]["View"] : false,
                    marketing_design_tools: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Design tools"] : false,
                    sales_manage_product_library: newPermission["Sales"]["Manage product library"],
                    sales_create_custom_line_items: newPermission["Sales"]["Create custom line items"],
                    sales_sales_access: newPermission["Sales"]["Sales Access"],
                    sales_templates: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Templates"] : false,
                    sales_create_scheduling_pages_for_others: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Create scheduling pages for others"] : false,
                    sales_sales_professional: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] : false,
                    sales_forecast_edit: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Forecast"]["Edit"] : 3 : 3,
                    sales_forecast_view: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Forecast"]["View"] : 4 : 4,
                    sales_playbooks_edit: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Playbooks"]["Edit"] : false : false,
                    sales_playbooks_publish: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Playbooks"]["Publish"] : false : false,
                    sales_playbooks_view: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Playbooks"]["View"] : false : false,
                    sales_sequences: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Sequences"] : false : false,
                    sales_bulk_enroll_sequences: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Bulk enroll sequences"] : false : false,
                    sales_manage_payment_links: newPermission["Sales"]["Manage payment links"],
                    sales_manage_payments_and_subscriptions: newPermission["Sales"]["Manage payments and subscriptions"],
                    service_service_access: newPermission["Service"]["Service Access"],
                    service_templates: newPermission["Service"]["Service Access"] ? newPermission["Service"]["Templates"] : false,
                    service_create_scheduling_pages_for_others: newPermission["Service"]["Service Access"] ? newPermission["Service"]["Create scheduling pages for others"] : false,
                    reports_data_quality_tools_access: newPermission["Reports"]["Data quality tools access"],
                    reports_reports_access: newPermission["Reports"]["Reports Access"],
                    reports_dashboard_reports_and_analytics_create: newPermission["Reports"]["Reports Access"] ? newPermission["Reports"]["Dashboard, reports, and analytics"]["Create"] : false,
                    reports_dashboard_reports_and_analytics_edit: newPermission["Reports"]["Reports Access"] ? newPermission["Reports"]["Dashboard, reports, and analytics"]["Edit"] : false,
                    reports_dashboard_reports_and_analytics_view: newPermission["Reports"]["Reports Access"] ? newPermission["Reports"]["Dashboard, reports, and analytics"]["View"] : false,
                    reports_marketing_reports: newPermission["Reports"]["Reports Access"] ? newPermission["Reports"]["Marketing reports"] : false,
                    account_marketing_contacts_access: newPermission["Account"]["Marketing contacts access"],
                    account_app_marketplace_access: newPermission["Account"]["App Marketplace access"],
                    account_asset_marketplace_access: newPermission["Account"]["Asset Marketplace access"],
                    account_gdpr_delete_contacts: newPermission["Account"]["GDPR delete contacts"],
                    account_hubdb_table_settings: newPermission["Account"]["HubDB table settings"],
                    account_global_content_settings: newPermission["Account"]["Global content settings"],
                    account_website_settings: newPermission["Account"]["Website settings"],
                    account_reports_and_dashboards: newPermission["Account"]["Reports and dashboards"],
                    account_domain_settings: newPermission["Account"]["Domain settings"],
                    account_account_access: newPermission["Account"]["Account Access"],
                    account_add_and_edit_users: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Add and edit users"] : false,
                    account_add_and_edit_teams: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Add and edit teams"] : false,
                    account_partition_by_teams: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Partition by teams"] : false,
                    account_presets: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Presets"] : false,
                    account_edit_account_defaults: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Edit account defaults"] : false,
                    account_modify_billing_and_change_name_on_contract: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Modify billing and change name on contract"] : false,
                    account_add_and_edit_developer_apps_and_test_accounts: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Add and edit developer apps and test accounts"] : false,
                    account_user_table_access: newPermission["Account"]["Account Access"] ? newPermission["Account"]["User table access"] : false,
                    account_availability_management: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Availability Management"] : false,
                  },
                },
              },
            });
            if (responsePermissionSet) {
              return res.status(201).json("allGood");
            } else {
              return res.status(500).end("Server failed to create the permission set");
            }
          } else {
            return res.status(500).end("Server failed to create the permission set");
          }
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
 * Update Team Settings
 *
 * Updates a Team settings using a collection of provided
 * query parameters. These include the following:
 *  - userId
 *  - id
 *  - name
 *  - permissionDataSet
 *  - setAsSuperAdmin
 *  - setAsSuperAdminWithSalesPro
 *  - userId
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function updatePermissionSetsDrawerSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { id, userId, name, setAsSuperAdmin, setAsSuperAdminWithSalesPro } = req.body;

  const newPermission = req.body.permissionDataSet as PermissionSetsData;

  if (Array.isArray(id))
    return res
      .status(400)
      .end("Bad request. the Team id parameter cannot be an array.");

  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (Array.isArray(name))
    return res
      .status(400)
      .end("Bad request. name parameter cannot be an array.");

  if (Array.isArray(setAsSuperAdmin))
    return res
      .status(400)
      .end("Bad request. setAsSuperAdmin parameter cannot be an array.");

  if (Array.isArray(setAsSuperAdminWithSalesPro))
    return res
      .status(400)
      .end("Bad request. setAsSuperAdminWithSalesPro parameter cannot be an array.");

  if (typeof newPermission !== 'object' || Array.isArray(newPermission) || newPermission === null)
    return res
      .status(400)
      .end("Bad request. permission parameter bad format.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  try {
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
        // Add permission set in db
        // We can create the permission set
        if (name && name !== "") {
          const responsePermissionSet = await prisma.permissionSets.updateMany({
            where: {
              id: id,
              ong: {
                id: fetchOngId.B2E[0].ongId,
              },
              predefined: true,
              editable: true,
              accountOwner: false,
            },
            data: {
              name: name,
              predefined: true,
              accountOwner: false,
              editable: true,
              super_admin: false,
              crm_contacts_delete: newPermission["CRM"]["Contacts"]["Delete"],
              crm_contacts_edit: newPermission["CRM"]["Contacts"]["Edit"],
              crm_contacts_view: newPermission["CRM"]["Contacts"]["View"],
              crm_companies_delete: newPermission["CRM"]["Companies"]["Delete"],
              crm_companies_edit: newPermission["CRM"]["Companies"]["Edit"],
              crm_companies_view: newPermission["CRM"]["Companies"]["View"],
              crm_deals_delete: newPermission["CRM"]["Deals"]["Delete"],
              crm_deals_edit: newPermission["CRM"]["Deals"]["Edit"],
              crm_deals_view: newPermission["CRM"]["Deals"]["View"],
              crm_tickets_delte: newPermission["CRM"]["Tickets"]["Delete"],
              crm_tickets_edit: newPermission["CRM"]["Tickets"]["Edit"],
              crm_tickets_view: newPermission["CRM"]["Tickets"]["View"],
              crm_tasks_edit: newPermission["CRM"]["Tasks"]["Edit"],
              crm_tasks_view: newPermission["CRM"]["Tasks"]["View"],
              crm_notes_view: newPermission["CRM"]["Notes"]["View"],
              crm_custom_objects_delete: newPermission["CRM"]["Custom Objects"]["Delete"],
              crm_custom_objects_edit: newPermission["CRM"]["Custom Objects"]["Edit"],
              crm_custom_objects_view: newPermission["CRM"]["Custom Objects"]["View"],
              crm_workflows_delete: newPermission["CRM"]["Workflows"]["Delete"],
              crm_workflows_edit: newPermission["CRM"]["Workflows"]["Edit"],
              crm_workflows_view: newPermission["CRM"]["Workflows"]["View"],
              crm_communicate: newPermission["CRM"]["Communicate"],
              crm_bulk_delete: newPermission["CRM"]["Bulk delete"],
              crm_import: newPermission["CRM"]["Import"],
              crm_export: newPermission["CRM"]["Export"],
              crm_edit_property_settings: newPermission["CRM"]["Edit property settings"],
              crm_chatflows: newPermission["CRM"]["Chatflows"],
              crm_customs_views: newPermission["CRM"]["Custom views"],
              marketing_lists_edit: newPermission["Marketing"]["Lists"]["Edit"],
              marketing_lists_view: newPermission["Marketing"]["Lists"]["View"],
              marketing_forms: newPermission["Marketing"]["Forms"],
              marketing_files: newPermission["Marketing"]["Files"],
              marketing_marketing_access: newPermission["Marketing"]["Marketing Access"],
              marketing_ads_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Ads"]["Publish"] : false,
              marketing_ads_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Ads"]["View"] : false,
              marketing_campaigns_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Campaigns"]["Edit"] : false,
              marketing_campaigns_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Campaigns"]["View"] : false,
              marketing_email_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Email"]["Edit"] : false,
              marketing_email_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Email"]["Publish"] : false,
              marketing_email_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Email"]["View"] : false,
              marketing_social: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Social"] : 4,
              marketing_content_staging: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Content staging"] : false,
              marketing_blog_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Blog"]["Edit"] : false,
              marketing_blog_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Blog"]["Publish"] : false,
              marketing_blog_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Blog"]["View"] : false,
              marketing_landing_pages_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Landing pages"]["Edit"] : false,
              marketing_landing_pages_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Landing pages"]["Publish"] : false,
              marketing_landing_pages_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Landing pages"]["View"] : false,
              marketing_website_pages_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Website pages"]["Edit"] : false,
              marketing_website_pages_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Website pages"]["Publish"] : false,
              marketing_website_pages_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Website pages"]["View"] : false,
              marketing_hubdb_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["HubDB"]["Edit"] : false,
              marketing_hubdb_publish: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["HubDB"]["Publish"] : false,
              marketing_hubdb_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["HubDB"]["View"] : false,
              marketing_url_redirects_edit: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["URL Redirects"]["Edit"] : false,
              marketing_url_redirects_view: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["URL Redirects"]["View"] : false,
              marketing_design_tools: newPermission["Marketing"]["Marketing Access"] ? newPermission["Marketing"]["Design tools"] : false,
              sales_manage_product_library: newPermission["Sales"]["Manage product library"],
              sales_create_custom_line_items: newPermission["Sales"]["Create custom line items"],
              sales_sales_access: newPermission["Sales"]["Sales Access"],
              sales_templates: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Templates"] : false,
              sales_create_scheduling_pages_for_others: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Create scheduling pages for others"] : false,
              sales_sales_professional: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] : false,
              sales_forecast_edit: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Forecast"]["Edit"] : 3 : 3,
              sales_forecast_view: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Forecast"]["View"] : 4 : 4,
              sales_playbooks_edit: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Playbooks"]["Edit"] : false : false,
              sales_playbooks_publish: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Playbooks"]["Publish"] : false : false,
              sales_playbooks_view: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Playbooks"]["View"] : false : false,
              sales_sequences: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Sequences"] : false : false,
              sales_bulk_enroll_sequences: newPermission["Sales"]["Sales Access"] ? newPermission["Sales"]["Sales Professional"] ? newPermission["Sales"]["Bulk enroll sequences"] : false : false,
              sales_manage_payment_links: newPermission["Sales"]["Manage payment links"],
              sales_manage_payments_and_subscriptions: newPermission["Sales"]["Manage payments and subscriptions"],
              service_service_access: newPermission["Service"]["Service Access"],
              service_templates: newPermission["Service"]["Service Access"] ? newPermission["Service"]["Templates"] : false,
              service_create_scheduling_pages_for_others: newPermission["Service"]["Service Access"] ? newPermission["Service"]["Create scheduling pages for others"] : false,
              reports_data_quality_tools_access: newPermission["Reports"]["Data quality tools access"],
              reports_reports_access: newPermission["Reports"]["Reports Access"],
              reports_dashboard_reports_and_analytics_create: newPermission["Reports"]["Reports Access"] ? newPermission["Reports"]["Dashboard, reports, and analytics"]["Create"] : false,
              reports_dashboard_reports_and_analytics_edit: newPermission["Reports"]["Reports Access"] ? newPermission["Reports"]["Dashboard, reports, and analytics"]["Edit"] : false,
              reports_dashboard_reports_and_analytics_view: newPermission["Reports"]["Reports Access"] ? newPermission["Reports"]["Dashboard, reports, and analytics"]["View"] : false,
              reports_marketing_reports: newPermission["Reports"]["Reports Access"] ? newPermission["Reports"]["Marketing reports"] : false,
              account_marketing_contacts_access: newPermission["Account"]["Marketing contacts access"],
              account_app_marketplace_access: newPermission["Account"]["App Marketplace access"],
              account_asset_marketplace_access: newPermission["Account"]["Asset Marketplace access"],
              account_gdpr_delete_contacts: newPermission["Account"]["GDPR delete contacts"],
              account_hubdb_table_settings: newPermission["Account"]["HubDB table settings"],
              account_global_content_settings: newPermission["Account"]["Global content settings"],
              account_website_settings: newPermission["Account"]["Website settings"],
              account_reports_and_dashboards: newPermission["Account"]["Reports and dashboards"],
              account_domain_settings: newPermission["Account"]["Domain settings"],
              account_account_access: newPermission["Account"]["Account Access"],
              account_add_and_edit_users: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Add and edit users"] : false,
              account_add_and_edit_teams: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Add and edit teams"] : false,
              account_partition_by_teams: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Partition by teams"] : false,
              account_presets: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Presets"] : false,
              account_edit_account_defaults: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Edit account defaults"] : false,
              account_modify_billing_and_change_name_on_contract: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Modify billing and change name on contract"] : false,
              account_add_and_edit_developer_apps_and_test_accounts: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Add and edit developer apps and test accounts"] : false,
              account_user_table_access: newPermission["Account"]["Account Access"] ? newPermission["Account"]["User table access"] : false,
              account_availability_management: newPermission["Account"]["Account Access"] ? newPermission["Account"]["Availability Management"] : false,
            }
          });
          if(responsePermissionSet){
              return res.status(201).json("allGood");
            } else {
              return res.status(500).end("Server failed to create the permission set");
            }
        } else {
          return res.status(500).end("Data format not good");
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
