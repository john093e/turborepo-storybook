import {
  protectedProcedure,
  publicProcedure,
  createTRPCRouter,
} from '../../../../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
interface PermissionSetsData {
  CRM: {
    Contacts: {
      Delete: number
      Edit: number
      View: number
    }
    Companies: {
      Delete: number
      Edit: number
      View: number
    }
    Deals: {
      Delete: number
      Edit: number
      View: number
    }
    Tickets: {
      Delete: number
      Edit: number
      View: number
    }
    Tasks: {
      Edit: number
      View: number
    }
    Notes: {
      View: number
    }
    'Custom Objects': {
      Delete: number
      Edit: number
      View: number
    }
    Workflows: {
      Delete: boolean
      Edit: boolean
      View: boolean
    }
    Communicate: number
    'Bulk delete': boolean
    Import: boolean
    Export: boolean
    'Edit property settings': boolean
    Chatflows: boolean
    'Custom views': boolean
  }
  Marketing: {
    Lists: {
      Edit: boolean
      View: boolean
    }
    Forms: boolean
    Files: boolean
    'Marketing Access': boolean
    Ads: {
      Publish: boolean
      View: boolean
    }
    Campaigns: {
      Edit: boolean
      View: boolean
    }
    Email: {
      Edit: boolean
      Publish: boolean
      View: boolean
    }
    Social: number
    'Content staging': boolean
    Blog: {
      Edit: boolean
      Publish: boolean
      View: boolean
    }
    'Landing pages': {
      Edit: boolean
      Publish: boolean
      View: boolean
    }
    'Website pages': {
      Edit: boolean
      Publish: boolean
      View: boolean
    }
    HubDB: {
      Edit: boolean
      Publish: boolean
      View: boolean
    }
    'URL Redirects': {
      Edit: boolean
      View: boolean
    }
    'Design tools': boolean
  }
  Sales: {
    'Manage product library': boolean
    'Create custom line items': boolean
    'Sales Access': boolean
    Templates: boolean
    'Create scheduling pages for others': boolean
    'Sales Professional': boolean
    Forecast: {
      Edit: number
      View: number
    }
    Playbooks: {
      Edit: boolean
      Publish: boolean
      View: boolean
    }
    Sequences: boolean
    'Bulk enroll sequences': boolean
    'Manage payment links': boolean
    'Manage payments and subscriptions': boolean
  }
  Service: {
    'Service Access': boolean
    Templates: boolean
    'Create scheduling pages for others': boolean
  }
  Reports: {
    'Data quality tools access': boolean
    'Reports Access': boolean
    'Dashboard, reports, and analytics': {
      Create: boolean
      Edit: boolean
      View: boolean
    }
    'Marketing reports': boolean
  }
  Account: {
    'Marketing contacts access': boolean
    'App Marketplace access': boolean
    'Asset Marketplace access': boolean
    'GDPR delete contacts': boolean
    'HubDB table settings': boolean
    'Global content settings': boolean
    'Website settings': boolean
    'Reports and dashboards': boolean
    'Domain settings': boolean
    'Account Access': boolean
    'Add and edit users': boolean
    'Add and edit teams': boolean
    'Partition by teams': boolean
    Presets: boolean
    'Edit account defaults': boolean
    'Modify billing and change name on contract': boolean
    'Add and edit developer apps and test accounts': boolean
    'User table access': boolean
    'Availability Management': boolean
  }
}
export const adminSettingsAccountUsersAndTeamsPermissionSetsRouter =
  createTRPCRouter({
    /**
     * 1 - getPermissionSetsSettings :
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
     */
    getPermissionSetsSettings: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          toSkip: z.string(),
          toTake: z.string(),
          searchTerm: z.string(),
          toOrderBy: z.string(),
          toOrderByStartWith: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        // TODO validate data
        // userId | take | skip
        if (Array.isArray(input.userId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (!ctx.session.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Server failed to get session user ID',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (ctx.session.user.id !== input.userId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You don't have access to this user data",
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        if (
          input.toTake === null ||
          input.toTake === undefined ||
          input.toSkip === null ||
          input.toSkip === undefined
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Server failed to get pagination',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        if (
          input.toOrderBy === null ||
          input.toOrderBy === undefined ||
          input.toOrderByStartWith === null ||
          input.toOrderByStartWith === undefined
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Server failed to get OrderBy data',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        if (Array.isArray(input.searchTerm)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre searchTerm ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        try {
          if (input.userId) {
            const fetchOngId = await ctx.prisma.user.findFirst({
              where: {
                id: input.userId,
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
            })
            if (fetchOngId && fetchOngId.B2E[0] !== undefined) {
              if (fetchOngId.B2E[0].ongId) {
                const take: number = +input.toTake
                const skip: number = +input.toSkip

                const searchTermFilter =
                  input.searchTerm !== '' && input.searchTerm !== null
                    ? { name: { contains: input.searchTerm as string } }
                    : {}

                // Count PermissionSets
                const permissionSetsCount =
                  await ctx.prisma.permissionSets.count({
                    where: {
                      ongId: fetchOngId.B2E[0].ongId,
                      predefined: true,
                      ...searchTermFilter,
                    },
                  })
                //TODO
                // order by :
                // - name
                // - access
                // - lastActive
                const OrderBySet =
                  input.toOrderBy !== '' &&
                  input.toOrderBy !== null &&
                  input.toOrderByStartWith !== '' &&
                  input.toOrderByStartWith !== null
                    ? input.toOrderBy === 'name'
                      ? {
                          orderBy: {
                            [input.toOrderBy as string]:
                              input.toOrderByStartWith as string,
                          },
                        }
                      : input.toOrderBy === 'users'
                      ? {
                          orderBy: {
                            B2E: {
                              _count: input.toOrderByStartWith as string,
                            },
                          },
                        }
                      : undefined
                    : undefined

                const permissionSets = await ctx.prisma.permissionSets.findMany(
                  {
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
                  }
                )

                let dataToSend: {
                  id: string
                  name: string | null
                  editable: boolean
                  access: {
                    SuperAdmin: boolean
                    SalesProfessional: boolean
                    Marketing: boolean
                    Sales: boolean
                    Service: boolean
                    Reports: boolean
                    Account: boolean
                  }
                  users: number
                }[] = []

                if (permissionSets.length > 0) {
                  permissionSets.map((permissionSet) => {
                    dataToSend.push({
                      id: permissionSet.id,
                      name: permissionSet.name,
                      editable: permissionSet.editable,
                      access: {
                        SuperAdmin: permissionSet.super_admin
                          ? permissionSet.super_admin
                          : false,
                        SalesProfessional:
                          permissionSet.sales_sales_professional,
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
                }

                return response
              } else {
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message: 'Server failed to get Account ID',
                  // optional: pass the original error to retain stack trace
                  // cause: error,
                })
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "You don't have an account connected",
                // optional: pass the original error to retain stack trace
                // cause: error,
              })
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Server failed to get user ID',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
            // optional: pass the original error to retain stack trace
            cause: error,
          })
        }
      }),
    /**
     * 2 - deleteTeamsSettings :
     * Delete Team
     *
     * Deletes a team from the database using a provided `userId` & the team "id" query
     * parameter.
     * - userId
     * - id
     *
     */
    deleteTeamsSettings: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          id: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (Array.isArray(input.userId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (!Array.isArray(input.id)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre emails doit être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (!ctx.session.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Server failed to get session user ID',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (ctx.session.user.id !== input.userId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You don't have access to this user data",
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        try {
          // fetch the user NGO
          const fetchOngId = await ctx.prisma.user.findFirst({
            where: {
              id: input.userId,
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
          })
          if (fetchOngId && fetchOngId.B2E[0] !== undefined) {
            if (fetchOngId.B2E[0].ongId) {
              // get the permission sets data and B2E relation
              const getB2Erelation = await ctx.prisma.permissionSets.findFirst({
                where: {
                  id: input.id,
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
                    },
                  },
                },
              })

              if (getB2Erelation) {
                // we got the permission
                //check the permission is deletable
                if (getB2Erelation.editable || !getB2Erelation.accountOwner) {
                  // check the permission got B2E
                  if (getB2Erelation.B2E.length > 0) {
                    // Function for creating permission
                    async function createPermission(
                      B2EId: string,
                      ongId: string,
                      permissionSetDataToSet: any
                    ) {
                      return await ctx.prisma.oNG.update({
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
                              crm_contacts_delete:
                                permissionSetDataToSet.crm_contacts_delete,
                              crm_contacts_edit:
                                permissionSetDataToSet.crm_contacts_edit,
                              crm_contacts_view:
                                permissionSetDataToSet.crm_contacts_view,
                              crm_companies_delete:
                                permissionSetDataToSet.crm_companies_delete,
                              crm_companies_edit:
                                permissionSetDataToSet.crm_companies_edit,
                              crm_companies_view:
                                permissionSetDataToSet.crm_companies_view,
                              crm_deals_delete:
                                permissionSetDataToSet.crm_deals_delete,
                              crm_deals_edit:
                                permissionSetDataToSet.crm_deals_edit,
                              crm_deals_view:
                                permissionSetDataToSet.crm_deals_view,
                              crm_tickets_delte:
                                permissionSetDataToSet.crm_tickets_delte,
                              crm_tickets_edit:
                                permissionSetDataToSet.crm_tickets_edit,
                              crm_tickets_view:
                                permissionSetDataToSet.crm_tickets_view,
                              crm_tasks_edit:
                                permissionSetDataToSet.crm_tasks_edit,
                              crm_tasks_view:
                                permissionSetDataToSet.crm_tasks_view,
                              crm_notes_view:
                                permissionSetDataToSet.crm_notes_view,
                              crm_custom_objects_delete:
                                permissionSetDataToSet.crm_custom_objects_delete,
                              crm_custom_objects_edit:
                                permissionSetDataToSet.crm_custom_objects_edit,
                              crm_custom_objects_view:
                                permissionSetDataToSet.crm_custom_objects_view,
                              crm_workflows_delete:
                                permissionSetDataToSet.crm_workflows_delete,
                              crm_workflows_edit:
                                permissionSetDataToSet.crm_workflows_edit,
                              crm_workflows_view:
                                permissionSetDataToSet.crm_workflows_view,
                              crm_communicate:
                                permissionSetDataToSet.crm_communicate,
                              crm_bulk_delete:
                                permissionSetDataToSet.crm_bulk_delete,
                              crm_import: permissionSetDataToSet.crm_import,
                              crm_export: permissionSetDataToSet.crm_export,
                              crm_edit_property_settings:
                                permissionSetDataToSet.crm_edit_property_settings,
                              crm_chatflows:
                                permissionSetDataToSet.crm_chatflows,
                              crm_customs_views:
                                permissionSetDataToSet.crm_customs_views,
                              marketing_lists_edit:
                                permissionSetDataToSet.marketing_lists_edit,
                              marketing_lists_view:
                                permissionSetDataToSet.marketing_lists_view,
                              marketing_forms:
                                permissionSetDataToSet.marketing_forms,
                              marketing_files:
                                permissionSetDataToSet.marketing_files,
                              marketing_marketing_access:
                                permissionSetDataToSet.marketing_marketing_access,
                              marketing_ads_publish:
                                permissionSetDataToSet.marketing_ads_publish,
                              marketing_ads_view:
                                permissionSetDataToSet.marketing_ads_view,
                              marketing_campaigns_edit:
                                permissionSetDataToSet.marketing_campaigns_edit,
                              marketing_campaigns_view:
                                permissionSetDataToSet.marketing_campaigns_view,
                              marketing_email_edit:
                                permissionSetDataToSet.marketing_email_edit,
                              marketing_email_publish:
                                permissionSetDataToSet.marketing_email_publish,
                              marketing_email_view:
                                permissionSetDataToSet.marketing_email_view,
                              marketing_social:
                                permissionSetDataToSet.marketing_social,
                              marketing_content_staging:
                                permissionSetDataToSet.marketing_content_staging,
                              marketing_blog_edit:
                                permissionSetDataToSet.marketing_blog_edit,
                              marketing_blog_publish:
                                permissionSetDataToSet.marketing_blog_publish,
                              marketing_blog_view:
                                permissionSetDataToSet.marketing_blog_view,
                              marketing_landing_pages_edit:
                                permissionSetDataToSet.marketing_landing_pages_edit,
                              marketing_landing_pages_publish:
                                permissionSetDataToSet.marketing_landing_pages_publish,
                              marketing_landing_pages_view:
                                permissionSetDataToSet.marketing_landing_pages_view,
                              marketing_website_pages_edit:
                                permissionSetDataToSet.marketing_website_pages_edit,
                              marketing_website_pages_publish:
                                permissionSetDataToSet.marketing_website_pages_publish,
                              marketing_website_pages_view:
                                permissionSetDataToSet.marketing_website_pages_view,
                              marketing_hubdb_edit:
                                permissionSetDataToSet.marketing_hubdb_edit,
                              marketing_hubdb_publish:
                                permissionSetDataToSet.marketing_hubdb_publish,
                              marketing_hubdb_view:
                                permissionSetDataToSet.marketing_hubdb_view,
                              marketing_url_redirects_edit:
                                permissionSetDataToSet.marketing_url_redirects_edit,
                              marketing_url_redirects_view:
                                permissionSetDataToSet.marketing_url_redirects_view,
                              marketing_design_tools:
                                permissionSetDataToSet.marketing_design_tools,
                              sales_manage_product_library:
                                permissionSetDataToSet.sales_manage_product_library,
                              sales_create_custom_line_items:
                                permissionSetDataToSet.sales_create_custom_line_items,
                              sales_sales_access:
                                permissionSetDataToSet.sales_sales_access,
                              sales_templates:
                                permissionSetDataToSet.sales_templates,
                              sales_create_scheduling_pages_for_others:
                                permissionSetDataToSet.sales_create_scheduling_pages_for_others,
                              sales_sales_professional:
                                permissionSetDataToSet.sales_sales_professional,
                              sales_forecast_edit:
                                permissionSetDataToSet.sales_forecast_edit,
                              sales_forecast_view:
                                permissionSetDataToSet.sales_forecast_view,
                              sales_playbooks_edit:
                                permissionSetDataToSet.sales_playbooks_edit,
                              sales_playbooks_publish:
                                permissionSetDataToSet.sales_playbooks_publish,
                              sales_playbooks_view:
                                permissionSetDataToSet.sales_playbooks_view,
                              sales_sequences:
                                permissionSetDataToSet.sales_sequences,
                              sales_bulk_enroll_sequences:
                                permissionSetDataToSet.sales_bulk_enroll_sequences,
                              sales_manage_payment_links:
                                permissionSetDataToSet.sales_manage_payment_links,
                              sales_manage_payments_and_subscriptions:
                                permissionSetDataToSet.sales_manage_payments_and_subscriptions,
                              service_service_access:
                                permissionSetDataToSet.service_service_access,
                              service_templates:
                                permissionSetDataToSet.service_templates,
                              service_create_scheduling_pages_for_others:
                                permissionSetDataToSet.service_create_scheduling_pages_for_others,
                              reports_data_quality_tools_access:
                                permissionSetDataToSet.reports_data_quality_tools_access,
                              reports_reports_access:
                                permissionSetDataToSet.reports_reports_access,
                              reports_dashboard_reports_and_analytics_create:
                                permissionSetDataToSet.reports_dashboard_reports_and_analytics_create,
                              reports_dashboard_reports_and_analytics_edit:
                                permissionSetDataToSet.reports_dashboard_reports_and_analytics_edit,
                              reports_dashboard_reports_and_analytics_view:
                                permissionSetDataToSet.reports_dashboard_reports_and_analytics_view,
                              reports_marketing_reports:
                                permissionSetDataToSet.reports_marketing_reports,
                              account_marketing_contacts_access:
                                permissionSetDataToSet.account_marketing_contacts_access,
                              account_app_marketplace_access:
                                permissionSetDataToSet.account_app_marketplace_access,
                              account_asset_marketplace_access:
                                permissionSetDataToSet.account_asset_marketplace_access,
                              account_gdpr_delete_contacts:
                                permissionSetDataToSet.account_gdpr_delete_contacts,
                              account_hubdb_table_settings:
                                permissionSetDataToSet.account_hubdb_table_settings,
                              account_global_content_settings:
                                permissionSetDataToSet.account_global_content_settings,
                              account_website_settings:
                                permissionSetDataToSet.account_website_settings,
                              account_reports_and_dashboards:
                                permissionSetDataToSet.account_reports_and_dashboards,
                              account_domain_settings:
                                permissionSetDataToSet.account_domain_settings,
                              account_account_access:
                                permissionSetDataToSet.account_account_access,
                              account_add_and_edit_users:
                                permissionSetDataToSet.account_add_and_edit_users,
                              account_add_and_edit_teams:
                                permissionSetDataToSet.account_add_and_edit_teams,
                              account_partition_by_teams:
                                permissionSetDataToSet.account_partition_by_teams,
                              account_presets:
                                permissionSetDataToSet.account_presets,
                              account_edit_account_defaults:
                                permissionSetDataToSet.account_edit_account_defaults,
                              account_modify_billing_and_change_name_on_contract:
                                permissionSetDataToSet.account_modify_billing_and_change_name_on_contract,
                              account_add_and_edit_developer_apps_and_test_accounts:
                                permissionSetDataToSet.account_add_and_edit_developer_apps_and_test_accounts,
                              account_user_table_access:
                                permissionSetDataToSet.account_user_table_access,
                              account_availability_management:
                                permissionSetDataToSet.account_availability_management,
                              B2E: {
                                connect: {
                                  id: B2EId,
                                },
                              },
                            },
                          },
                        },
                      })
                    }
                    // for each B2E create a permission set
                    for (const user of getB2Erelation.B2E) {
                      const permissionCreated = await createPermission(
                        user.id,
                        fetchOngId.B2E[0].ongId,
                        getB2Erelation
                      )
                      if (permissionCreated) {
                        // do nothing
                      } else {
                        // stop the process we got an issue
                        throw new TRPCError({
                          code: 'INTERNAL_SERVER_ERROR',
                          message:
                            'Server failed to delete this permission set',
                          // optional: pass the original error to retain stack trace
                          // cause: error,
                        })
                      }
                    }

                    // delete the permission sets
                    const deletePermissionSet =
                      await ctx.prisma.permissionSets.delete({
                        where: {
                          id: input.id,
                        },
                      })
                    if (deletePermissionSet) {
                      return
                    } else {
                      //we could succeed to delete this permission set
                      throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Server failed to delete this permission set',
                        // optional: pass the original error to retain stack trace
                        // cause: error,
                      })
                    }
                  } else {
                    // there is no B2E so we can delete directly the permission
                    const deletePermissionSet =
                      await ctx.prisma.permissionSets.delete({
                        where: {
                          id: input.id,
                        },
                      })
                    if (deletePermissionSet) {
                      return
                    } else {
                      //we could not succeed to delete this permission set
                      throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Server failed to delete this permission set',
                        // optional: pass the original error to retain stack trace
                        // cause: error,
                      })
                    }
                  }
                } else {
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Can't delete this permission set",
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              } else {
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message: 'Server failed to get permission set',
                  // optional: pass the original error to retain stack trace
                  // cause: error,
                })
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Server failed to get Account ID',
                // optional: pass the original error to retain stack trace
                // cause: error,
              })
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: "You don't have an account connected.",
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
            // optional: pass the original error to retain stack trace
            cause: error,
          })
        }
      }),
    /**
     * 3 - getPermissionSetsDrawerSettings :
     * Get PermissionSetsDrawer Settings
     *
     * Fetches & returns all users from an account available depending
     * on a `userId` for fetching ong and the following filter query parameter.
     * - userId
     * - permissionSetId
     *
     *
     */
    getPermissionSetsDrawerSettings: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          permissionSetId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (Array.isArray(input.userId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (!Array.isArray(input.permissionSetId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre emails doit être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (!ctx.session.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Server failed to get session user ID',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (ctx.session.user.id !== input.userId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You don't have access to this user data",
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        try {
          if (input.userId) {
            const fetchOngId = await ctx.prisma.user.findFirst({
              where: {
                id: ctx.session.user.id,
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
            })
            if (fetchOngId && fetchOngId.B2E[0] !== undefined) {
              if (fetchOngId.B2E[0].ongId) {
                // if update get the selected teams settings
                const permissionSet = await ctx.prisma.permissionSets.findMany({
                  where: {
                    ongId: fetchOngId.B2E[0].ongId,
                    id: input.permissionSetId,
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
                })

                // construct response
                if (permissionSet) {
                  return permissionSet
                } else {
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Server failed to fetch Permission Set data',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              } else {
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message: 'Server failed to get Account ID',
                  // optional: pass the original error to retain stack trace
                  // cause: error,
                })
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "You don't have an account connected",
                // optional: pass the original error to retain stack trace
                // cause: error,
              })
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Server failed to get user ID',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
            // optional: pass the original error to retain stack trace
            cause: error,
          })
        }
      }),
    /**
     * 4 - createPermissionSetsDrawerSettings :
     * Create Permission Sets from the Drawer
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
     *
     */
    createPermissionSetsDrawerSettings: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          name: z.string(),
          setAsSuperAdmin: z.boolean(),
          setAsSuperAdminWithSalesPro: z.boolean(),
          permissionDataSet: z.object({
            CRM: z.object({
              Contacts: z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Companies: z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Deals: z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Tickets: z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Tasks: z.object({
                Edit: z.number(),
                View: z.number(),
              }),
              Notes: z.object({
                View: z.number(),
              }),
              'Custom Objects': z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Workflows: z.object({
                Delete: z.boolean(),
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              Communicate: z.number(),
              'Bulk delete': z.boolean(),
              Import: z.boolean(),
              Export: z.boolean(),
              'Edit property settings': z.boolean(),
              Chatflows: z.boolean(),
              'Custom views': z.boolean(),
            }),
            Marketing: z.object({
              Lists: z.object({
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              Forms: z.boolean(),
              Files: z.boolean(),
              'Marketing Access': z.boolean(),
              Ads: z.object({
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              Campaigns: z.object({
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              Email: z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              Social: z.number(),
              'Content staging': z.boolean(),
              Blog: z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              'Landing pages': z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              'Website pages': z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              HubDB: z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              'URL Redirects': z.object({
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              'Design tools': z.boolean(),
            }),
            Sales: z.object({
              'Manage product library': z.boolean(),
              'Create custom line items': z.boolean(),
              'Sales Access': z.boolean(),
              Templates: z.boolean(),
              'Create scheduling pages for others': z.boolean(),
              'Sales Professional': z.boolean(),
              Forecast: z.object({
                Edit: z.number(),
                View: z.number(),
              }),
              Playbooks: z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              Sequences: z.boolean(),
              'Bulk enroll sequences': z.boolean(),
              'Manage payment links': z.boolean(),
              'Manage payments and subscriptions': z.boolean(),
            }),
            Service: z.object({
              'Service Access': z.boolean(),
              Templates: z.boolean(),
              'Create scheduling pages for others': z.boolean(),
            }),
            Reports: z.object({
              'Data quality tools access': z.boolean(),
              'Reports Access': z.boolean(),
              'Dashboard, reports, and analytics': z.object({
                Create: z.boolean(),
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              'Marketing reports': z.boolean(),
            }),
            Account: z.object({
              'Marketing contacts access': z.boolean(),
              'App Marketplace access': z.boolean(),
              'Asset Marketplace access': z.boolean(),
              'GDPR delete contacts': z.boolean(),
              'HubDB table settings': z.boolean(),
              'Global content settings': z.boolean(),
              'Website settings': z.boolean(),
              'Reports and dashboards': z.boolean(),
              'Domain settings': z.boolean(),
              'Account Access': z.boolean(),
              'Add and edit users': z.boolean(),
              'Add and edit teams': z.boolean(),
              'Partition by teams': z.boolean(),
              Presets: z.boolean(),
              'Edit account defaults': z.boolean(),
              'Modify billing and change name on contract': z.boolean(),
              'Add and edit developer apps and test accounts': z.boolean(),
              'User table access': z.boolean(),
              'Availability Management': z.boolean(),
            }),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const newPermission = input.permissionDataSet as PermissionSetsData

        if (Array.isArray(input.userId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (Array.isArray(input.name)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre name ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (Array.isArray(input.setAsSuperAdmin)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre setAsSuperAdmin ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (Array.isArray(input.setAsSuperAdminWithSalesPro)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre setAsSuperAdminWithSalesPro ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        if (
          typeof newPermission !== 'object' ||
          Array.isArray(newPermission) ||
          newPermission === null
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Bad request. permission parameter bad format.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (!ctx.session.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Server failed to get session user ID',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (ctx.session.user.id !== input.userId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You don't have access to this user data",
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        try {
          // check if we got user id
          if (input.userId) {
            //check if userId exist and fetch his data :
            // B2E.ongId
            const fetchOngId = await ctx.prisma.user.findFirst({
              where: {
                id: ctx.session.user.id,
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
            })
            // Check if we fetch something
            if (fetchOngId && fetchOngId.B2E[0] !== undefined) {
              // check if we fetch an NGO related to the userId
              if (fetchOngId.B2E[0].ongId) {
                // Add permission set in db
                // We can create the permission set
                if (input.name && input.name !== '' && input.setAsSuperAdmin) {
                  const responsePermissionSet = await ctx.prisma.oNG.update({
                    where: {
                      id: fetchOngId.B2E[0].ongId,
                    },
                    data: {
                      PermissionSets: {
                        create: {
                          name: input.name,
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
                          sales_sales_professional:
                            input.setAsSuperAdminWithSalesPro ? true : false,
                          sales_forecast_edit: input.setAsSuperAdminWithSalesPro
                            ? 1
                            : 4,
                          sales_forecast_view: input.setAsSuperAdminWithSalesPro
                            ? 1
                            : 4,
                          sales_playbooks_edit:
                            input.setAsSuperAdminWithSalesPro ? true : false,
                          sales_playbooks_publish:
                            input.setAsSuperAdminWithSalesPro ? true : false,
                          sales_playbooks_view:
                            input.setAsSuperAdminWithSalesPro ? true : false,
                          sales_sequences: input.setAsSuperAdminWithSalesPro
                            ? true
                            : false,
                          sales_bulk_enroll_sequences:
                            input.setAsSuperAdminWithSalesPro ? true : false,
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
                          account_modify_billing_and_change_name_on_contract:
                            true,
                          account_add_and_edit_developer_apps_and_test_accounts:
                            true,
                          account_user_table_access: true,
                          account_availability_management: true,
                        },
                      },
                    },
                  })
                  if (responsePermissionSet) {
                    return 'allGood'
                  } else {
                    throw new TRPCError({
                      code: 'INTERNAL_SERVER_ERROR',
                      message: 'Server failed to create the permission set',
                      // optional: pass the original error to retain stack trace
                      // cause: error,
                    })
                  }
                } else if (input.name && input.name !== '' && newPermission) {
                  const responsePermissionSet = await ctx.prisma.oNG.update({
                    where: {
                      id: fetchOngId.B2E[0].ongId,
                    },
                    data: {
                      PermissionSets: {
                        create: {
                          name: input.name,
                          predefined: true,
                          accountOwner: false,
                          editable: true,
                          super_admin: false,
                          crm_contacts_delete:
                            newPermission['CRM']['Contacts']['Delete'],
                          crm_contacts_edit:
                            newPermission['CRM']['Contacts']['Edit'],
                          crm_contacts_view:
                            newPermission['CRM']['Contacts']['View'],
                          crm_companies_delete:
                            newPermission['CRM']['Companies']['Delete'],
                          crm_companies_edit:
                            newPermission['CRM']['Companies']['Edit'],
                          crm_companies_view:
                            newPermission['CRM']['Companies']['View'],
                          crm_deals_delete:
                            newPermission['CRM']['Deals']['Delete'],
                          crm_deals_edit: newPermission['CRM']['Deals']['Edit'],
                          crm_deals_view: newPermission['CRM']['Deals']['View'],
                          crm_tickets_delte:
                            newPermission['CRM']['Tickets']['Delete'],
                          crm_tickets_edit:
                            newPermission['CRM']['Tickets']['Edit'],
                          crm_tickets_view:
                            newPermission['CRM']['Tickets']['View'],
                          crm_tasks_edit: newPermission['CRM']['Tasks']['Edit'],
                          crm_tasks_view: newPermission['CRM']['Tasks']['View'],
                          crm_notes_view: newPermission['CRM']['Notes']['View'],
                          crm_custom_objects_delete:
                            newPermission['CRM']['Custom Objects']['Delete'],
                          crm_custom_objects_edit:
                            newPermission['CRM']['Custom Objects']['Edit'],
                          crm_custom_objects_view:
                            newPermission['CRM']['Custom Objects']['View'],
                          crm_workflows_delete:
                            newPermission['CRM']['Workflows']['Delete'],
                          crm_workflows_edit:
                            newPermission['CRM']['Workflows']['Edit'],
                          crm_workflows_view:
                            newPermission['CRM']['Workflows']['View'],
                          crm_communicate: newPermission['CRM']['Communicate'],
                          crm_bulk_delete: newPermission['CRM']['Bulk delete'],
                          crm_import: newPermission['CRM']['Import'],
                          crm_export: newPermission['CRM']['Export'],
                          crm_edit_property_settings:
                            newPermission['CRM']['Edit property settings'],
                          crm_chatflows: newPermission['CRM']['Chatflows'],
                          crm_customs_views:
                            newPermission['CRM']['Custom views'],
                          marketing_lists_edit:
                            newPermission['Marketing']['Lists']['Edit'],
                          marketing_lists_view:
                            newPermission['Marketing']['Lists']['View'],
                          marketing_forms: newPermission['Marketing']['Forms'],
                          marketing_files: newPermission['Marketing']['Files'],
                          marketing_marketing_access:
                            newPermission['Marketing']['Marketing Access'],
                          marketing_ads_publish: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Ads']['Publish']
                            : false,
                          marketing_ads_view: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Ads']['View']
                            : false,
                          marketing_campaigns_edit: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Campaigns']['Edit']
                            : false,
                          marketing_campaigns_view: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Campaigns']['View']
                            : false,
                          marketing_email_edit: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Email']['Edit']
                            : false,
                          marketing_email_publish: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Email']['Publish']
                            : false,
                          marketing_email_view: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Email']['View']
                            : false,
                          marketing_social: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Social']
                            : 4,
                          marketing_content_staging: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Content staging']
                            : false,
                          marketing_blog_edit: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Blog']['Edit']
                            : false,
                          marketing_blog_publish: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Blog']['Publish']
                            : false,
                          marketing_blog_view: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Blog']['View']
                            : false,
                          marketing_landing_pages_edit: newPermission[
                            'Marketing'
                          ]['Marketing Access']
                            ? newPermission['Marketing']['Landing pages'][
                                'Edit'
                              ]
                            : false,
                          marketing_landing_pages_publish: newPermission[
                            'Marketing'
                          ]['Marketing Access']
                            ? newPermission['Marketing']['Landing pages'][
                                'Publish'
                              ]
                            : false,
                          marketing_landing_pages_view: newPermission[
                            'Marketing'
                          ]['Marketing Access']
                            ? newPermission['Marketing']['Landing pages'][
                                'View'
                              ]
                            : false,
                          marketing_website_pages_edit: newPermission[
                            'Marketing'
                          ]['Marketing Access']
                            ? newPermission['Marketing']['Website pages'][
                                'Edit'
                              ]
                            : false,
                          marketing_website_pages_publish: newPermission[
                            'Marketing'
                          ]['Marketing Access']
                            ? newPermission['Marketing']['Website pages'][
                                'Publish'
                              ]
                            : false,
                          marketing_website_pages_view: newPermission[
                            'Marketing'
                          ]['Marketing Access']
                            ? newPermission['Marketing']['Website pages'][
                                'View'
                              ]
                            : false,
                          marketing_hubdb_edit: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['HubDB']['Edit']
                            : false,
                          marketing_hubdb_publish: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['HubDB']['Publish']
                            : false,
                          marketing_hubdb_view: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['HubDB']['View']
                            : false,
                          marketing_url_redirects_edit: newPermission[
                            'Marketing'
                          ]['Marketing Access']
                            ? newPermission['Marketing']['URL Redirects'][
                                'Edit'
                              ]
                            : false,
                          marketing_url_redirects_view: newPermission[
                            'Marketing'
                          ]['Marketing Access']
                            ? newPermission['Marketing']['URL Redirects'][
                                'View'
                              ]
                            : false,
                          marketing_design_tools: newPermission['Marketing'][
                            'Marketing Access'
                          ]
                            ? newPermission['Marketing']['Design tools']
                            : false,
                          sales_manage_product_library:
                            newPermission['Sales']['Manage product library'],
                          sales_create_custom_line_items:
                            newPermission['Sales']['Create custom line items'],
                          sales_sales_access:
                            newPermission['Sales']['Sales Access'],
                          sales_templates: newPermission['Sales'][
                            'Sales Access'
                          ]
                            ? newPermission['Sales']['Templates']
                            : false,
                          sales_create_scheduling_pages_for_others:
                            newPermission['Sales']['Sales Access']
                              ? newPermission['Sales'][
                                  'Create scheduling pages for others'
                                ]
                              : false,
                          sales_sales_professional: newPermission['Sales'][
                            'Sales Access'
                          ]
                            ? newPermission['Sales']['Sales Professional']
                            : false,
                          sales_forecast_edit: newPermission['Sales'][
                            'Sales Access'
                          ]
                            ? newPermission['Sales']['Sales Professional']
                              ? newPermission['Sales']['Forecast']['Edit']
                              : 3
                            : 3,
                          sales_forecast_view: newPermission['Sales'][
                            'Sales Access'
                          ]
                            ? newPermission['Sales']['Sales Professional']
                              ? newPermission['Sales']['Forecast']['View']
                              : 4
                            : 4,
                          sales_playbooks_edit: newPermission['Sales'][
                            'Sales Access'
                          ]
                            ? newPermission['Sales']['Sales Professional']
                              ? newPermission['Sales']['Playbooks']['Edit']
                              : false
                            : false,
                          sales_playbooks_publish: newPermission['Sales'][
                            'Sales Access'
                          ]
                            ? newPermission['Sales']['Sales Professional']
                              ? newPermission['Sales']['Playbooks']['Publish']
                              : false
                            : false,
                          sales_playbooks_view: newPermission['Sales'][
                            'Sales Access'
                          ]
                            ? newPermission['Sales']['Sales Professional']
                              ? newPermission['Sales']['Playbooks']['View']
                              : false
                            : false,
                          sales_sequences: newPermission['Sales'][
                            'Sales Access'
                          ]
                            ? newPermission['Sales']['Sales Professional']
                              ? newPermission['Sales']['Sequences']
                              : false
                            : false,
                          sales_bulk_enroll_sequences: newPermission['Sales'][
                            'Sales Access'
                          ]
                            ? newPermission['Sales']['Sales Professional']
                              ? newPermission['Sales']['Bulk enroll sequences']
                              : false
                            : false,
                          sales_manage_payment_links:
                            newPermission['Sales']['Manage payment links'],
                          sales_manage_payments_and_subscriptions:
                            newPermission['Sales'][
                              'Manage payments and subscriptions'
                            ],
                          service_service_access:
                            newPermission['Service']['Service Access'],
                          service_templates: newPermission['Service'][
                            'Service Access'
                          ]
                            ? newPermission['Service']['Templates']
                            : false,
                          service_create_scheduling_pages_for_others:
                            newPermission['Service']['Service Access']
                              ? newPermission['Service'][
                                  'Create scheduling pages for others'
                                ]
                              : false,
                          reports_data_quality_tools_access:
                            newPermission['Reports'][
                              'Data quality tools access'
                            ],
                          reports_reports_access:
                            newPermission['Reports']['Reports Access'],
                          reports_dashboard_reports_and_analytics_create:
                            newPermission['Reports']['Reports Access']
                              ? newPermission['Reports'][
                                  'Dashboard, reports, and analytics'
                                ]['Create']
                              : false,
                          reports_dashboard_reports_and_analytics_edit:
                            newPermission['Reports']['Reports Access']
                              ? newPermission['Reports'][
                                  'Dashboard, reports, and analytics'
                                ]['Edit']
                              : false,
                          reports_dashboard_reports_and_analytics_view:
                            newPermission['Reports']['Reports Access']
                              ? newPermission['Reports'][
                                  'Dashboard, reports, and analytics'
                                ]['View']
                              : false,
                          reports_marketing_reports: newPermission['Reports'][
                            'Reports Access'
                          ]
                            ? newPermission['Reports']['Marketing reports']
                            : false,
                          account_marketing_contacts_access:
                            newPermission['Account'][
                              'Marketing contacts access'
                            ],
                          account_app_marketplace_access:
                            newPermission['Account']['App Marketplace access'],
                          account_asset_marketplace_access:
                            newPermission['Account'][
                              'Asset Marketplace access'
                            ],
                          account_gdpr_delete_contacts:
                            newPermission['Account']['GDPR delete contacts'],
                          account_hubdb_table_settings:
                            newPermission['Account']['HubDB table settings'],
                          account_global_content_settings:
                            newPermission['Account']['Global content settings'],
                          account_website_settings:
                            newPermission['Account']['Website settings'],
                          account_reports_and_dashboards:
                            newPermission['Account']['Reports and dashboards'],
                          account_domain_settings:
                            newPermission['Account']['Domain settings'],
                          account_account_access:
                            newPermission['Account']['Account Access'],
                          account_add_and_edit_users: newPermission['Account'][
                            'Account Access'
                          ]
                            ? newPermission['Account']['Add and edit users']
                            : false,
                          account_add_and_edit_teams: newPermission['Account'][
                            'Account Access'
                          ]
                            ? newPermission['Account']['Add and edit teams']
                            : false,
                          account_partition_by_teams: newPermission['Account'][
                            'Account Access'
                          ]
                            ? newPermission['Account']['Partition by teams']
                            : false,
                          account_presets: newPermission['Account'][
                            'Account Access'
                          ]
                            ? newPermission['Account']['Presets']
                            : false,
                          account_edit_account_defaults: newPermission[
                            'Account'
                          ]['Account Access']
                            ? newPermission['Account']['Edit account defaults']
                            : false,
                          account_modify_billing_and_change_name_on_contract:
                            newPermission['Account']['Account Access']
                              ? newPermission['Account'][
                                  'Modify billing and change name on contract'
                                ]
                              : false,
                          account_add_and_edit_developer_apps_and_test_accounts:
                            newPermission['Account']['Account Access']
                              ? newPermission['Account'][
                                  'Add and edit developer apps and test accounts'
                                ]
                              : false,
                          account_user_table_access: newPermission['Account'][
                            'Account Access'
                          ]
                            ? newPermission['Account']['User table access']
                            : false,
                          account_availability_management: newPermission[
                            'Account'
                          ]['Account Access']
                            ? newPermission['Account'][
                                'Availability Management'
                              ]
                            : false,
                        },
                      },
                    },
                  })
                  if (responsePermissionSet) {
                    return 'allGood'
                  } else {
                    throw new TRPCError({
                      code: 'INTERNAL_SERVER_ERROR',
                      message: 'Server failed to create the permission set',
                      // optional: pass the original error to retain stack trace
                      // cause: error,
                    })
                  }
                } else {
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Server failed to create the permission set',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              } else {
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message: 'Server failed to get Account ID',
                  // optional: pass the original error to retain stack trace
                  // cause: error,
                })
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "You don't have an account connected",
                // optional: pass the original error to retain stack trace
                // cause: error,
              })
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Server failed to get user ID',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
            // optional: pass the original error to retain stack trace
            cause: error,
          })
        }
      }),
    /**
     * 5 - updatePermissionSetsDrawerSettings :
     * Update Permission Sets from the Drawer
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
     *
     */
    updatePermissionSetsDrawerSettings: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          userId: z.string(),
          name: z.string(),
          setAsSuperAdmin: z.boolean(),
          setAsSuperAdminWithSalesPro: z.boolean(),
          permissionDataSet: z.object({
            CRM: z.object({
              Contacts: z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Companies: z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Deals: z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Tickets: z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Tasks: z.object({
                Edit: z.number(),
                View: z.number(),
              }),
              Notes: z.object({
                View: z.number(),
              }),
              'Custom Objects': z.object({
                Delete: z.number(),
                Edit: z.number(),
                View: z.number(),
              }),
              Workflows: z.object({
                Delete: z.boolean(),
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              Communicate: z.number(),
              'Bulk delete': z.boolean(),
              Import: z.boolean(),
              Export: z.boolean(),
              'Edit property settings': z.boolean(),
              Chatflows: z.boolean(),
              'Custom views': z.boolean(),
            }),
            Marketing: z.object({
              Lists: z.object({
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              Forms: z.boolean(),
              Files: z.boolean(),
              'Marketing Access': z.boolean(),
              Ads: z.object({
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              Campaigns: z.object({
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              Email: z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              Social: z.number(),
              'Content staging': z.boolean(),
              Blog: z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              'Landing pages': z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              'Website pages': z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              HubDB: z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              'URL Redirects': z.object({
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              'Design tools': z.boolean(),
            }),
            Sales: z.object({
              'Manage product library': z.boolean(),
              'Create custom line items': z.boolean(),
              'Sales Access': z.boolean(),
              Templates: z.boolean(),
              'Create scheduling pages for others': z.boolean(),
              'Sales Professional': z.boolean(),
              Forecast: z.object({
                Edit: z.number(),
                View: z.number(),
              }),
              Playbooks: z.object({
                Edit: z.boolean(),
                Publish: z.boolean(),
                View: z.boolean(),
              }),
              Sequences: z.boolean(),
              'Bulk enroll sequences': z.boolean(),
              'Manage payment links': z.boolean(),
              'Manage payments and subscriptions': z.boolean(),
            }),
            Service: z.object({
              'Service Access': z.boolean(),
              Templates: z.boolean(),
              'Create scheduling pages for others': z.boolean(),
            }),
            Reports: z.object({
              'Data quality tools access': z.boolean(),
              'Reports Access': z.boolean(),
              'Dashboard, reports, and analytics': z.object({
                Create: z.boolean(),
                Edit: z.boolean(),
                View: z.boolean(),
              }),
              'Marketing reports': z.boolean(),
            }),
            Account: z.object({
              'Marketing contacts access': z.boolean(),
              'App Marketplace access': z.boolean(),
              'Asset Marketplace access': z.boolean(),
              'GDPR delete contacts': z.boolean(),
              'HubDB table settings': z.boolean(),
              'Global content settings': z.boolean(),
              'Website settings': z.boolean(),
              'Reports and dashboards': z.boolean(),
              'Domain settings': z.boolean(),
              'Account Access': z.boolean(),
              'Add and edit users': z.boolean(),
              'Add and edit teams': z.boolean(),
              'Partition by teams': z.boolean(),
              Presets: z.boolean(),
              'Edit account defaults': z.boolean(),
              'Modify billing and change name on contract': z.boolean(),
              'Add and edit developer apps and test accounts': z.boolean(),
              'User table access': z.boolean(),
              'Availability Management': z.boolean(),
            }),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const newPermission = input.permissionDataSet as PermissionSetsData

        if (Array.isArray(input.id)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (Array.isArray(input.userId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (Array.isArray(input.name)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre name ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (Array.isArray(input.setAsSuperAdmin)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre setAsSuperAdmin ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (Array.isArray(input.setAsSuperAdminWithSalesPro)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre setAsSuperAdminWithSalesPro ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        if (
          typeof newPermission !== 'object' ||
          Array.isArray(newPermission) ||
          newPermission === null
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Bad request. permission parameter bad format.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (!ctx.session.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Server failed to get session user ID',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (ctx.session.user.id !== input.userId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You don't have access to this user data",
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        try {
          const fetchOngId = await ctx.prisma.user.findFirst({
            where: {
              id: input.userId,
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
          })

          if (fetchOngId && fetchOngId.B2E[0] !== undefined) {
            if (fetchOngId.B2E[0].ongId) {
              // Add permission set in db
              // We can create the permission set
              if (input.name && input.name !== '') {
                const responsePermissionSet =
                  await ctx.prisma.permissionSets.updateMany({
                    where: {
                      id: input.id,
                      ong: {
                        id: fetchOngId.B2E[0].ongId,
                      },
                      predefined: true,
                      editable: true,
                      accountOwner: false,
                    },
                    data: {
                      name: input.name,
                      predefined: true,
                      accountOwner: false,
                      editable: true,
                      super_admin: false,
                      crm_contacts_delete:
                        newPermission['CRM']['Contacts']['Delete'],
                      crm_contacts_edit:
                        newPermission['CRM']['Contacts']['Edit'],
                      crm_contacts_view:
                        newPermission['CRM']['Contacts']['View'],
                      crm_companies_delete:
                        newPermission['CRM']['Companies']['Delete'],
                      crm_companies_edit:
                        newPermission['CRM']['Companies']['Edit'],
                      crm_companies_view:
                        newPermission['CRM']['Companies']['View'],
                      crm_deals_delete: newPermission['CRM']['Deals']['Delete'],
                      crm_deals_edit: newPermission['CRM']['Deals']['Edit'],
                      crm_deals_view: newPermission['CRM']['Deals']['View'],
                      crm_tickets_delte:
                        newPermission['CRM']['Tickets']['Delete'],
                      crm_tickets_edit: newPermission['CRM']['Tickets']['Edit'],
                      crm_tickets_view: newPermission['CRM']['Tickets']['View'],
                      crm_tasks_edit: newPermission['CRM']['Tasks']['Edit'],
                      crm_tasks_view: newPermission['CRM']['Tasks']['View'],
                      crm_notes_view: newPermission['CRM']['Notes']['View'],
                      crm_custom_objects_delete:
                        newPermission['CRM']['Custom Objects']['Delete'],
                      crm_custom_objects_edit:
                        newPermission['CRM']['Custom Objects']['Edit'],
                      crm_custom_objects_view:
                        newPermission['CRM']['Custom Objects']['View'],
                      crm_workflows_delete:
                        newPermission['CRM']['Workflows']['Delete'],
                      crm_workflows_edit:
                        newPermission['CRM']['Workflows']['Edit'],
                      crm_workflows_view:
                        newPermission['CRM']['Workflows']['View'],
                      crm_communicate: newPermission['CRM']['Communicate'],
                      crm_bulk_delete: newPermission['CRM']['Bulk delete'],
                      crm_import: newPermission['CRM']['Import'],
                      crm_export: newPermission['CRM']['Export'],
                      crm_edit_property_settings:
                        newPermission['CRM']['Edit property settings'],
                      crm_chatflows: newPermission['CRM']['Chatflows'],
                      crm_customs_views: newPermission['CRM']['Custom views'],
                      marketing_lists_edit:
                        newPermission['Marketing']['Lists']['Edit'],
                      marketing_lists_view:
                        newPermission['Marketing']['Lists']['View'],
                      marketing_forms: newPermission['Marketing']['Forms'],
                      marketing_files: newPermission['Marketing']['Files'],
                      marketing_marketing_access:
                        newPermission['Marketing']['Marketing Access'],
                      marketing_ads_publish: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Ads']['Publish']
                        : false,
                      marketing_ads_view: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Ads']['View']
                        : false,
                      marketing_campaigns_edit: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Campaigns']['Edit']
                        : false,
                      marketing_campaigns_view: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Campaigns']['View']
                        : false,
                      marketing_email_edit: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Email']['Edit']
                        : false,
                      marketing_email_publish: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Email']['Publish']
                        : false,
                      marketing_email_view: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Email']['View']
                        : false,
                      marketing_social: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Social']
                        : 4,
                      marketing_content_staging: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Content staging']
                        : false,
                      marketing_blog_edit: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Blog']['Edit']
                        : false,
                      marketing_blog_publish: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Blog']['Publish']
                        : false,
                      marketing_blog_view: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Blog']['View']
                        : false,
                      marketing_landing_pages_edit: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Landing pages']['Edit']
                        : false,
                      marketing_landing_pages_publish: newPermission[
                        'Marketing'
                      ]['Marketing Access']
                        ? newPermission['Marketing']['Landing pages']['Publish']
                        : false,
                      marketing_landing_pages_view: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Landing pages']['View']
                        : false,
                      marketing_website_pages_edit: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Website pages']['Edit']
                        : false,
                      marketing_website_pages_publish: newPermission[
                        'Marketing'
                      ]['Marketing Access']
                        ? newPermission['Marketing']['Website pages']['Publish']
                        : false,
                      marketing_website_pages_view: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Website pages']['View']
                        : false,
                      marketing_hubdb_edit: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['HubDB']['Edit']
                        : false,
                      marketing_hubdb_publish: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['HubDB']['Publish']
                        : false,
                      marketing_hubdb_view: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['HubDB']['View']
                        : false,
                      marketing_url_redirects_edit: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['URL Redirects']['Edit']
                        : false,
                      marketing_url_redirects_view: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['URL Redirects']['View']
                        : false,
                      marketing_design_tools: newPermission['Marketing'][
                        'Marketing Access'
                      ]
                        ? newPermission['Marketing']['Design tools']
                        : false,
                      sales_manage_product_library:
                        newPermission['Sales']['Manage product library'],
                      sales_create_custom_line_items:
                        newPermission['Sales']['Create custom line items'],
                      sales_sales_access:
                        newPermission['Sales']['Sales Access'],
                      sales_templates: newPermission['Sales']['Sales Access']
                        ? newPermission['Sales']['Templates']
                        : false,
                      sales_create_scheduling_pages_for_others: newPermission[
                        'Sales'
                      ]['Sales Access']
                        ? newPermission['Sales'][
                            'Create scheduling pages for others'
                          ]
                        : false,
                      sales_sales_professional: newPermission['Sales'][
                        'Sales Access'
                      ]
                        ? newPermission['Sales']['Sales Professional']
                        : false,
                      sales_forecast_edit: newPermission['Sales'][
                        'Sales Access'
                      ]
                        ? newPermission['Sales']['Sales Professional']
                          ? newPermission['Sales']['Forecast']['Edit']
                          : 3
                        : 3,
                      sales_forecast_view: newPermission['Sales'][
                        'Sales Access'
                      ]
                        ? newPermission['Sales']['Sales Professional']
                          ? newPermission['Sales']['Forecast']['View']
                          : 4
                        : 4,
                      sales_playbooks_edit: newPermission['Sales'][
                        'Sales Access'
                      ]
                        ? newPermission['Sales']['Sales Professional']
                          ? newPermission['Sales']['Playbooks']['Edit']
                          : false
                        : false,
                      sales_playbooks_publish: newPermission['Sales'][
                        'Sales Access'
                      ]
                        ? newPermission['Sales']['Sales Professional']
                          ? newPermission['Sales']['Playbooks']['Publish']
                          : false
                        : false,
                      sales_playbooks_view: newPermission['Sales'][
                        'Sales Access'
                      ]
                        ? newPermission['Sales']['Sales Professional']
                          ? newPermission['Sales']['Playbooks']['View']
                          : false
                        : false,
                      sales_sequences: newPermission['Sales']['Sales Access']
                        ? newPermission['Sales']['Sales Professional']
                          ? newPermission['Sales']['Sequences']
                          : false
                        : false,
                      sales_bulk_enroll_sequences: newPermission['Sales'][
                        'Sales Access'
                      ]
                        ? newPermission['Sales']['Sales Professional']
                          ? newPermission['Sales']['Bulk enroll sequences']
                          : false
                        : false,
                      sales_manage_payment_links:
                        newPermission['Sales']['Manage payment links'],
                      sales_manage_payments_and_subscriptions:
                        newPermission['Sales'][
                          'Manage payments and subscriptions'
                        ],
                      service_service_access:
                        newPermission['Service']['Service Access'],
                      service_templates: newPermission['Service'][
                        'Service Access'
                      ]
                        ? newPermission['Service']['Templates']
                        : false,
                      service_create_scheduling_pages_for_others: newPermission[
                        'Service'
                      ]['Service Access']
                        ? newPermission['Service'][
                            'Create scheduling pages for others'
                          ]
                        : false,
                      reports_data_quality_tools_access:
                        newPermission['Reports']['Data quality tools access'],
                      reports_reports_access:
                        newPermission['Reports']['Reports Access'],
                      reports_dashboard_reports_and_analytics_create:
                        newPermission['Reports']['Reports Access']
                          ? newPermission['Reports'][
                              'Dashboard, reports, and analytics'
                            ]['Create']
                          : false,
                      reports_dashboard_reports_and_analytics_edit:
                        newPermission['Reports']['Reports Access']
                          ? newPermission['Reports'][
                              'Dashboard, reports, and analytics'
                            ]['Edit']
                          : false,
                      reports_dashboard_reports_and_analytics_view:
                        newPermission['Reports']['Reports Access']
                          ? newPermission['Reports'][
                              'Dashboard, reports, and analytics'
                            ]['View']
                          : false,
                      reports_marketing_reports: newPermission['Reports'][
                        'Reports Access'
                      ]
                        ? newPermission['Reports']['Marketing reports']
                        : false,
                      account_marketing_contacts_access:
                        newPermission['Account']['Marketing contacts access'],
                      account_app_marketplace_access:
                        newPermission['Account']['App Marketplace access'],
                      account_asset_marketplace_access:
                        newPermission['Account']['Asset Marketplace access'],
                      account_gdpr_delete_contacts:
                        newPermission['Account']['GDPR delete contacts'],
                      account_hubdb_table_settings:
                        newPermission['Account']['HubDB table settings'],
                      account_global_content_settings:
                        newPermission['Account']['Global content settings'],
                      account_website_settings:
                        newPermission['Account']['Website settings'],
                      account_reports_and_dashboards:
                        newPermission['Account']['Reports and dashboards'],
                      account_domain_settings:
                        newPermission['Account']['Domain settings'],
                      account_account_access:
                        newPermission['Account']['Account Access'],
                      account_add_and_edit_users: newPermission['Account'][
                        'Account Access'
                      ]
                        ? newPermission['Account']['Add and edit users']
                        : false,
                      account_add_and_edit_teams: newPermission['Account'][
                        'Account Access'
                      ]
                        ? newPermission['Account']['Add and edit teams']
                        : false,
                      account_partition_by_teams: newPermission['Account'][
                        'Account Access'
                      ]
                        ? newPermission['Account']['Partition by teams']
                        : false,
                      account_presets: newPermission['Account'][
                        'Account Access'
                      ]
                        ? newPermission['Account']['Presets']
                        : false,
                      account_edit_account_defaults: newPermission['Account'][
                        'Account Access'
                      ]
                        ? newPermission['Account']['Edit account defaults']
                        : false,
                      account_modify_billing_and_change_name_on_contract:
                        newPermission['Account']['Account Access']
                          ? newPermission['Account'][
                              'Modify billing and change name on contract'
                            ]
                          : false,
                      account_add_and_edit_developer_apps_and_test_accounts:
                        newPermission['Account']['Account Access']
                          ? newPermission['Account'][
                              'Add and edit developer apps and test accounts'
                            ]
                          : false,
                      account_user_table_access: newPermission['Account'][
                        'Account Access'
                      ]
                        ? newPermission['Account']['User table access']
                        : false,
                      account_availability_management: newPermission['Account'][
                        'Account Access'
                      ]
                        ? newPermission['Account']['Availability Management']
                        : false,
                    },
                  })
                if (responsePermissionSet) {
                  return 'allGood'
                } else {
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Server failed to create the permission set',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              } else {
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  message: 'Data format not good',
                  // optional: pass the original error to retain stack trace
                  // cause: error,
                })
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Server failed to get Account ID',
                // optional: pass the original error to retain stack trace
                // cause: error,
              })
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: "You don't have an account connected",
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
            // optional: pass the original error to retain stack trace
            cause: error,
          })
        }
      }),
  })
