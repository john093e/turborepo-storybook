import { createContext, ReactNode, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import { api, type RouterOutputs } from '@lib/utils/api'

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
export type PermissionContextType = {
  permissionSetsDataCRM: PermissionSetsData['CRM']
  permissionSetsDataMarketing: PermissionSetsData['Marketing']
  permissionSetsDataSales: PermissionSetsData['Sales']
  permissionSetsDataService: PermissionSetsData['Service']
  permissionSetsDataReports: PermissionSetsData['Reports']
  permissionSetsDataAccount: PermissionSetsData['Account']
  handlePermissionSet: (
    access: string,
    category: string,
    value: number | boolean,
    type?: string
  ) => void
  setAsSuperAdmin: boolean
  setSetAsSuperAdmin: (data: boolean) => void
  setAsSuperAdminWithSalesPro: boolean
  setSetAsSuperAdminWithSalesPro: (data: boolean) => void
  permissionName: string
  setPermissionName: (data: string) => void
  permissionIsValid: boolean
  saving: boolean
  handleSaving: () => void
  id: string | null
  userId: string
  permissionDrawerError: string | null
}

const settingsContextDefaultValues: PermissionContextType = {
  permissionSetsDataCRM: {
    Contacts: {
      Delete: 1,
      Edit: 1,
      View: 1,
    },
    Companies: {
      Delete: 1,
      Edit: 1,
      View: 1,
    },
    Deals: {
      Delete: 1,
      Edit: 1,
      View: 1,
    },
    Tickets: {
      Delete: 1,
      Edit: 1,
      View: 1,
    },
    Tasks: {
      Edit: 1,
      View: 1,
    },
    Notes: {
      View: 3,
    },
    'Custom Objects': {
      Delete: 1,
      Edit: 1,
      View: 1,
    },
    Workflows: {
      Delete: false,
      Edit: false,
      View: false,
    },
    Communicate: 1,
    'Bulk delete': false,
    Import: true,
    Export: false,
    'Edit property settings': false,
    Chatflows: false,
    'Custom views': true,
  },
  permissionSetsDataMarketing: {
    Lists: {
      Edit: true,
      View: true,
    },
    Forms: true,
    Files: true,
    'Marketing Access': true,
    Ads: {
      Publish: false,
      View: true,
    },
    Campaigns: {
      Edit: false,
      View: true,
    },
    Email: {
      Edit: false,
      Publish: false,
      View: true,
    },
    Social: 1,
    'Content staging': false,
    Blog: {
      Edit: false,
      Publish: false,
      View: true,
    },
    'Landing pages': {
      Edit: false,
      Publish: false,
      View: true,
    },
    'Website pages': {
      Edit: false,
      Publish: false,
      View: true,
    },
    HubDB: {
      Edit: false,
      Publish: false,
      View: true,
    },
    'URL Redirects': {
      Edit: false,
      View: true,
    },
    'Design tools': false,
  },
  permissionSetsDataSales: {
    'Manage product library': false,
    'Create custom line items': true,
    'Sales Access': true,
    Templates: true,
    'Create scheduling pages for others': false,
    'Sales Professional': false,
    Forecast: {
      Edit: 1,
      View: 1,
    },
    Playbooks: {
      Edit: false,
      Publish: false,
      View: true,
    },
    Sequences: true,
    'Bulk enroll sequences': true,
    'Manage payment links': false,
    'Manage payments and subscriptions': false,
  },
  permissionSetsDataService: {
    'Service Access': true,
    Templates: true,
    'Create scheduling pages for others': false,
  },
  permissionSetsDataReports: {
    'Data quality tools access': false,
    'Reports Access': true,
    'Dashboard, reports, and analytics': {
      Create: true,
      Edit: true,
      View: true,
    },
    'Marketing reports': false,
  },
  permissionSetsDataAccount: {
    'Marketing contacts access': true,
    'App Marketplace access': false,
    'Asset Marketplace access': true,
    'GDPR delete contacts': false,
    'HubDB table settings': false,
    'Global content settings': false,
    'Website settings': false,
    'Reports and dashboards': false,
    'Domain settings': false,
    'Account Access': true,
    'Add and edit users': true,
    'Add and edit teams': true,
    'Partition by teams': true,
    Presets: true,
    'Edit account defaults': true,
    'Modify billing and change name on contract': true,
    'Add and edit developer apps and test accounts': true,
    'User table access': true,
    'Availability Management': true,
  },
  handlePermissionSet: () => {},
  setAsSuperAdmin: false,
  setSetAsSuperAdmin: () => {},
  setAsSuperAdminWithSalesPro: false,
  setSetAsSuperAdminWithSalesPro: () => {},
  permissionName: '',
  setPermissionName: () => {},
  permissionIsValid: false,
  saving: false,
  handleSaving: () => {},
  id: null,
  userId: '',
  permissionDrawerError: null,
}

export const PermissionContext = createContext<PermissionContextType>(
  settingsContextDefaultValues
)

type Props = {
  data: {
    id: string
    name: string
    accountOwner: boolean
    editable: boolean
    predefined: boolean
    super_admin: boolean
    //CRM
    crm_contacts_delete: number
    crm_contacts_edit: number
    crm_contacts_view: number
    crm_companies_delete: number
    crm_companies_edit: number
    crm_companies_view: number
    crm_deals_delete: number
    crm_deals_edit: number
    crm_deals_view: number
    crm_tickets_delte: number
    crm_tickets_edit: number
    crm_tickets_view: number
    crm_tasks_edit: number
    crm_tasks_view: number
    crm_notes_view: number
    crm_custom_objects_delete: number
    crm_custom_objects_edit: number
    crm_custom_objects_view: number
    crm_workflows_delete: boolean
    crm_workflows_edit: boolean
    crm_workflows_view: boolean
    crm_communicate: number
    crm_bulk_delete: boolean
    crm_import: boolean
    crm_export: boolean
    crm_edit_property_settings: boolean
    crm_chatflows: boolean
    crm_customs_views: boolean
    //Marketing
    marketing_lists_edit: boolean
    marketing_lists_view: boolean
    marketing_forms: boolean
    marketing_files: boolean
    marketing_marketing_access: boolean
    marketing_ads_publish: boolean
    marketing_ads_view: boolean
    marketing_campaigns_edit: boolean
    marketing_campaigns_view: boolean
    marketing_email_edit: boolean
    marketing_email_publish: boolean
    marketing_email_view: boolean
    marketing_social: number
    marketing_content_staging: boolean
    marketing_blog_edit: boolean
    marketing_blog_publish: boolean
    marketing_blog_view: boolean
    marketing_landing_pages_edit: boolean
    marketing_landing_pages_publish: boolean
    marketing_landing_pages_view: boolean
    marketing_website_pages_edit: boolean
    marketing_website_pages_publish: boolean
    marketing_website_pages_view: boolean
    marketing_hubdb_edit: boolean
    marketing_hubdb_publish: boolean
    marketing_hubdb_view: boolean
    marketing_url_redirects_edit: boolean
    marketing_url_redirects_view: boolean
    marketing_design_tools: boolean
    //Sales
    sales_manage_product_library: boolean
    sales_create_custom_line_items: boolean
    sales_sales_access: boolean
    sales_templates: boolean
    sales_create_scheduling_pages_for_others: boolean
    sales_sales_professional: boolean
    sales_forecast_edit: number
    sales_forecast_view: number
    sales_playbooks_edit: boolean
    sales_playbooks_publish: boolean
    sales_playbooks_view: boolean
    sales_sequences: boolean
    sales_bulk_enroll_sequences: boolean
    sales_manage_payment_links: boolean
    sales_manage_payments_and_subscriptions: boolean
    //Services
    service_service_access: boolean
    service_templates: boolean
    service_create_scheduling_pages_for_others: boolean
    //Reports
    reports_data_quality_tools_access: boolean
    reports_reports_access: boolean
    reports_dashboard_reports_and_analytics_create: boolean
    reports_dashboard_reports_and_analytics_edit: boolean
    reports_dashboard_reports_and_analytics_view: boolean
    reports_marketing_reports: boolean
    //Account
    account_marketing_contacts_access: boolean
    account_app_marketplace_access: boolean
    account_asset_marketplace_access: boolean
    account_gdpr_delete_contacts: boolean
    account_hubdb_table_settings: boolean
    account_global_content_settings: boolean
    account_website_settings: boolean
    account_reports_and_dashboards: boolean
    account_domain_settings: boolean
    account_account_access: boolean
    account_add_and_edit_users: boolean
    account_add_and_edit_teams: boolean
    account_partition_by_teams: boolean
    account_presets: boolean
    account_edit_account_defaults: boolean
    account_modify_billing_and_change_name_on_contract: boolean
    account_add_and_edit_developer_apps_and_test_accounts: boolean
    account_user_table_access: boolean
    account_availability_management: boolean
  } | null
  id: string | null
  userId: string
  finishProcess: () => void
  children: ReactNode
}

export function PermissionProvider({
  data,
  id,
  userId,
  finishProcess,
  children,
}: Props) {
  const [saving, setSaving] = useState<boolean>(false)

  const [permissionSetsDataCRM, setPermissionSetsDataCRM] = useState<
    PermissionSetsData['CRM']
  >(
    data
      ? {
          Contacts: {
            Delete: data.crm_contacts_delete,
            Edit: data.crm_contacts_edit,
            View: data.crm_contacts_view,
          },
          Companies: {
            Delete: data.crm_companies_delete,
            Edit: data.crm_companies_edit,
            View: data.crm_companies_view,
          },
          Deals: {
            Delete: data.crm_deals_delete,
            Edit: data.crm_deals_edit,
            View: data.crm_deals_view,
          },
          Tickets: {
            Delete: data.crm_tickets_delte,
            Edit: data.crm_tickets_edit,
            View: data.crm_tickets_view,
          },
          Tasks: {
            Edit: data.crm_tasks_edit,
            View: data.crm_tasks_view,
          },
          Notes: {
            View: data.crm_notes_view,
          },
          'Custom Objects': {
            Delete: data.crm_custom_objects_delete,
            Edit: data.crm_custom_objects_edit,
            View: data.crm_custom_objects_view,
          },
          Workflows: {
            Delete: data.crm_workflows_delete,
            Edit: data.crm_workflows_edit,
            View: data.crm_workflows_view,
          },
          Communicate: data.crm_communicate,
          'Bulk delete': data.crm_bulk_delete,
          Import: data.crm_import,
          Export: data.crm_export,
          'Edit property settings': data.crm_edit_property_settings,
          Chatflows: data.crm_chatflows,
          'Custom views': data.crm_customs_views,
        }
      : settingsContextDefaultValues.permissionSetsDataCRM
  )

  const [permissionSetsDataMarketing, setPermissionSetsDataMarketing] =
    useState<PermissionSetsData['Marketing']>(
      data
        ? {
            Lists: {
              Edit: data.marketing_lists_edit,
              View: data.marketing_lists_view,
            },
            Forms: data.marketing_forms,
            Files: data.marketing_files,
            'Marketing Access': data.marketing_marketing_access,
            Ads: {
              Publish: data.marketing_ads_publish,
              View: data.marketing_ads_view,
            },
            Campaigns: {
              Edit: data.marketing_campaigns_edit,
              View: data.marketing_campaigns_view,
            },
            Email: {
              Edit: data.marketing_email_edit,
              Publish: data.marketing_email_publish,
              View: data.marketing_email_view,
            },
            Social: data.marketing_social,
            'Content staging': data.marketing_content_staging,
            Blog: {
              Edit: data.marketing_blog_edit,
              Publish: data.marketing_blog_publish,
              View: data.marketing_blog_view,
            },
            'Landing pages': {
              Edit: data.marketing_landing_pages_edit,
              Publish: data.marketing_landing_pages_publish,
              View: data.marketing_landing_pages_view,
            },
            'Website pages': {
              Edit: data.marketing_website_pages_edit,
              Publish: data.marketing_website_pages_publish,
              View: data.marketing_website_pages_view,
            },
            HubDB: {
              Edit: data.marketing_hubdb_edit,
              Publish: data.marketing_hubdb_publish,
              View: data.marketing_hubdb_view,
            },
            'URL Redirects': {
              Edit: data.marketing_url_redirects_edit,
              View: data.marketing_url_redirects_view,
            },
            'Design tools': data.marketing_design_tools,
          }
        : settingsContextDefaultValues.permissionSetsDataMarketing
    )

  const [permissionSetsDataSales, setPermissionSetsDataSales] = useState<
    PermissionSetsData['Sales']
  >(
    data
      ? {
          'Manage product library': data.sales_manage_product_library,
          'Create custom line items': data.sales_create_custom_line_items,
          'Sales Access': data.sales_sales_access,
          Templates: data.sales_templates,
          'Create scheduling pages for others':
            data.sales_create_scheduling_pages_for_others,
          'Sales Professional': data.sales_sales_professional,
          Forecast: {
            Edit: data.sales_forecast_edit,
            View: data.sales_forecast_view,
          },
          Playbooks: {
            Edit: data.sales_playbooks_edit,
            Publish: data.sales_playbooks_publish,
            View: data.sales_playbooks_view,
          },
          Sequences: data.sales_sequences,
          'Bulk enroll sequences': data.sales_bulk_enroll_sequences,
          'Manage payment links': data.sales_manage_payment_links,
          'Manage payments and subscriptions':
            data.sales_manage_payments_and_subscriptions,
        }
      : settingsContextDefaultValues.permissionSetsDataSales
  )

  const [permissionSetsDataService, setPermissionSetsDataService] = useState<
    PermissionSetsData['Service']
  >(
    data
      ? {
          'Service Access': data.service_service_access,
          Templates: data.service_templates,
          'Create scheduling pages for others':
            data.service_create_scheduling_pages_for_others,
        }
      : settingsContextDefaultValues.permissionSetsDataService
  )

  const [permissionSetsDataReports, setPermissionSetsDataReports] = useState<
    PermissionSetsData['Reports']
  >(
    data
      ? {
          'Data quality tools access': data.reports_data_quality_tools_access,
          'Reports Access': data.reports_reports_access,
          'Dashboard, reports, and analytics': {
            Create: data.reports_dashboard_reports_and_analytics_create,
            Edit: data.reports_dashboard_reports_and_analytics_edit,
            View: data.reports_dashboard_reports_and_analytics_view,
          },
          'Marketing reports': data.reports_marketing_reports,
        }
      : settingsContextDefaultValues.permissionSetsDataReports
  )

  const [permissionSetsDataAccount, setPermissionSetsDataAccount] = useState<
    PermissionSetsData['Account']
  >(
    data
      ? {
          'Marketing contacts access': data.account_marketing_contacts_access,
          'App Marketplace access': data.account_app_marketplace_access,
          'Asset Marketplace access': data.account_asset_marketplace_access,
          'GDPR delete contacts': data.account_gdpr_delete_contacts,
          'HubDB table settings': data.account_hubdb_table_settings,
          'Global content settings': data.account_global_content_settings,
          'Website settings': data.account_website_settings,
          'Reports and dashboards': data.account_reports_and_dashboards,
          'Domain settings': data.account_domain_settings,
          'Account Access': data.account_account_access,
          'Add and edit users': data.account_add_and_edit_users,
          'Add and edit teams': data.account_add_and_edit_teams,
          'Partition by teams': data.account_partition_by_teams,
          Presets: data.account_presets,
          'Edit account defaults': data.account_edit_account_defaults,
          'Modify billing and change name on contract':
            data.account_modify_billing_and_change_name_on_contract,
          'Add and edit developer apps and test accounts':
            data.account_add_and_edit_developer_apps_and_test_accounts,
          'User table access': data.account_user_table_access,
          'Availability Management': data.account_availability_management,
        }
      : settingsContextDefaultValues.permissionSetsDataAccount
  )

  const handlePermissionSet = (
    access: string,
    category: string,
    value: number | boolean,
    type?: string
  ) => {
    let newData
    const permSet:
      | undefined
      | PermissionSetsData['CRM']
      | PermissionSetsData['Marketing']
      | PermissionSetsData['Sales']
      | PermissionSetsData['Service']
      | PermissionSetsData['Reports']
      | PermissionSetsData['Account'] =
      access === 'CRM'
        ? { ...permissionSetsDataCRM }
        : access === 'Marketing'
        ? { ...permissionSetsDataMarketing }
        : access === 'Sales'
        ? { ...permissionSetsDataSales }
        : access === 'Service'
        ? { ...permissionSetsDataService }
        : access === 'Reports'
        ? { ...permissionSetsDataReports }
        : access === 'Account'
        ? { ...permissionSetsDataAccount }
        : undefined
    // check if we got data
    if (permSet) {
      // check if it's a nested permission
      if (
        type &&
        (type === 'Create' ||
          type === 'Delete' ||
          type === 'Edit' ||
          type === 'Publish' ||
          type === 'View')
      ) {
        // get the nested permission
        let permSetChild = permSet[category as keyof typeof permSet] as {}
        // check we got nested permission
        if (Object.keys(permSetChild).length > 1) {
          // there is nested permission
          if (type === 'Create') {
            newData = { ...permSetChild, Create: value }
            let toSave = {
              ...permSet,
              [category as keyof typeof permSet]: newData,
            } as keyof typeof permSet

            access === 'CRM'
              ? setPermissionSetsDataCRM(toSave)
              : access === 'Marketing'
              ? setPermissionSetsDataMarketing(toSave)
              : access === 'Sales'
              ? setPermissionSetsDataSales(toSave)
              : access === 'Service'
              ? setPermissionSetsDataService(toSave)
              : access === 'Reports'
              ? setPermissionSetsDataReports(toSave)
              : access === 'Account'
              ? setPermissionSetsDataAccount(toSave)
              : null
          } else if (type === 'Delete') {
            newData = { ...permSetChild, Delete: value }
            let toSave = {
              ...permSet,
              [category as keyof typeof permSet]: newData,
            } as keyof typeof permSet
            access === 'CRM'
              ? setPermissionSetsDataCRM(toSave)
              : access === 'Marketing'
              ? setPermissionSetsDataMarketing(toSave)
              : access === 'Sales'
              ? setPermissionSetsDataSales(toSave)
              : access === 'Service'
              ? setPermissionSetsDataService(toSave)
              : access === 'Reports'
              ? setPermissionSetsDataReports(toSave)
              : access === 'Account'
              ? setPermissionSetsDataAccount(toSave)
              : null
          } else if (type === 'Edit') {
            newData = { ...permSetChild, Edit: value }
            let toSave = {
              ...permSet,
              [category as keyof typeof permSet]: newData,
            } as keyof typeof permSet

            access === 'CRM'
              ? setPermissionSetsDataCRM(toSave)
              : access === 'Marketing'
              ? setPermissionSetsDataMarketing(toSave)
              : access === 'Sales'
              ? setPermissionSetsDataSales(toSave)
              : access === 'Service'
              ? setPermissionSetsDataService(toSave)
              : access === 'Reports'
              ? setPermissionSetsDataReports(toSave)
              : access === 'Account'
              ? setPermissionSetsDataAccount(toSave)
              : null
          } else if (type === 'Publish') {
            newData = { ...permSetChild, Publish: value }
            let toSave = {
              ...permSet,
              [category as keyof typeof permSet]: newData,
            } as keyof typeof permSet
            access === 'CRM'
              ? setPermissionSetsDataCRM(toSave)
              : access === 'Marketing'
              ? setPermissionSetsDataMarketing(toSave)
              : access === 'Sales'
              ? setPermissionSetsDataSales(toSave)
              : access === 'Service'
              ? setPermissionSetsDataService(toSave)
              : access === 'Reports'
              ? setPermissionSetsDataReports(toSave)
              : access === 'Account'
              ? setPermissionSetsDataAccount(toSave)
              : null
          } else if (type === 'View') {
            newData = { ...permSetChild, View: value }
            let toSave = {
              ...permSet,
              [category as keyof typeof permSet]: newData,
            } as keyof typeof permSet
            access === 'CRM'
              ? setPermissionSetsDataCRM(toSave)
              : access === 'Marketing'
              ? setPermissionSetsDataMarketing(toSave)
              : access === 'Sales'
              ? setPermissionSetsDataSales(toSave)
              : access === 'Service'
              ? setPermissionSetsDataService(toSave)
              : access === 'Reports'
              ? setPermissionSetsDataReports(toSave)
              : access === 'Account'
              ? setPermissionSetsDataAccount(toSave)
              : null
          } else {
            // do nothing
          }
        } else {
          // do nothing
        }
      } else {
        // get the nested permission
        newData = {
          ...permSet,
          [category as keyof typeof permSet]: value,
        } as keyof typeof permSet
        access === 'CRM'
          ? setPermissionSetsDataCRM(newData)
          : access === 'Marketing'
          ? setPermissionSetsDataMarketing(newData)
          : access === 'Sales'
          ? setPermissionSetsDataSales(newData)
          : access === 'Service'
          ? setPermissionSetsDataService(newData)
          : access === 'Reports'
          ? setPermissionSetsDataReports(newData)
          : access === 'Account'
          ? setPermissionSetsDataAccount(newData)
          : null
      }
    } else {
      //do nothing
    }
  }

  //Set Permission Set Drawer Error
  const [permissionDrawerError, setPermissionDrawerError] = useState<
    string | null
  >('')

  //Set As Super Admin
  const [setAsSuperAdmin, setSetAsSuperAdmin] = useState<boolean>(
    data ? data.super_admin : false
  )

  //Set As Super Admin with Sales Pro
  const [setAsSuperAdminWithSalesPro, setSetAsSuperAdminWithSalesPro] =
    useState<boolean>(data ? data.sales_sales_professional : false)

  //Set Permission Name
  const [permissionName, setPermissionName] = useState<string>(
    data ? data.name : ''
  )

  //Save Permission

  const {
    mutate: createPermissionSetsDrawerSettings,
    isLoading: isLoadingCreatePermissionSetsDrawerSettings,
  } =
    api.adminSettingsAccountUsersAndTeamsPermissionSets.createPermissionSetsDrawerSettings.useMutation(
      {
        onSuccess(data) {
          setSaving(false)
          setPermissionDrawerError(null)
          finishProcess()
        },
        onError(error) {
          setSaving(false)
          setPermissionDrawerError('An error occured')
          toast.error(error.message, {
            position: 'top-right',
          })
        },
      }
    )

  const {
    mutate: updatePermissionSetsDrawerSettings,
    isLoading: isLoadingUpdatePermissionSetsDrawerSettings,
  } =
    api.adminSettingsAccountUsersAndTeamsPermissionSets.updatePermissionSetsDrawerSettings.useMutation(
      {
        onSuccess(data) {
          setSaving(false)
          setPermissionDrawerError(null)
          finishProcess()
        },
        onError(error) {
          setSaving(false)
          setPermissionDrawerError('An error occured')
          toast.error(error.message, {
            position: 'top-right',
          })
        },
      }
    )

  const handleSaving = async () => {
    setSaving(true)
    if (
      permissionName.length > 0 &&
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(([',. -][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ])?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]*)*$/.test(
        permissionName
      )
    ) {
      if (
        permissionSetsDataCRM &&
        permissionSetsDataMarketing &&
        permissionSetsDataSales &&
        permissionSetsDataService &&
        permissionSetsDataReports &&
        permissionSetsDataAccount
      ) {
        setPermissionIsValid(true)
        if (id) {
          updatePermissionSetsDrawerSettings({
            id: id,
            userId: userId,
            name: permissionName,
            permissionDataSet: {
              CRM: permissionSetsDataCRM,
              Marketing: permissionSetsDataMarketing,
              Sales: permissionSetsDataSales,
              Service: permissionSetsDataService,
              Reports: permissionSetsDataReports,
              Account: permissionSetsDataAccount,
            } as PermissionSetsData,
            setAsSuperAdmin: setAsSuperAdmin,
            setAsSuperAdminWithSalesPro: setAsSuperAdminWithSalesPro,
          })
        } else {
          createPermissionSetsDrawerSettings({
            userId: userId,
            name: permissionName,
            permissionDataSet: {
              CRM: permissionSetsDataCRM,
              Marketing: permissionSetsDataMarketing,
              Sales: permissionSetsDataSales,
              Service: permissionSetsDataService,
              Reports: permissionSetsDataReports,
              Account: permissionSetsDataAccount,
            } as PermissionSetsData,
            setAsSuperAdmin: setAsSuperAdmin,
            setAsSuperAdminWithSalesPro: setAsSuperAdminWithSalesPro,
          })
        }
      } else {
        setSaving(false)
        setPermissionIsValid(false)
      }
    } else {
      setSaving(false)
      setPermissionIsValid(false)
    }
  }

  //Set Is Valid
  const [permissionIsValid, setPermissionIsValid] = useState<boolean>(false)

  useEffect(() => {
    if (
      permissionName.length > 0 &&
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(([',. -][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ])?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]*)*$/.test(
        permissionName
      )
    ) {
      if (
        permissionSetsDataCRM &&
        permissionSetsDataMarketing &&
        permissionSetsDataSales &&
        permissionSetsDataService &&
        permissionSetsDataReports &&
        permissionSetsDataAccount
      ) {
        setPermissionIsValid(true)
      } else {
        setPermissionIsValid(false)
      }
    } else {
      setPermissionIsValid(false)
    }
  }, [permissionName])

  return (
    <PermissionContext.Provider
      value={{
        permissionSetsDataCRM,
        permissionSetsDataMarketing,
        permissionSetsDataSales,
        permissionSetsDataService,
        permissionSetsDataReports,
        permissionSetsDataAccount,
        handlePermissionSet,
        setAsSuperAdmin,
        setSetAsSuperAdmin,
        setAsSuperAdminWithSalesPro,
        setSetAsSuperAdminWithSalesPro,
        permissionName,
        setPermissionName,
        permissionIsValid,
        saving,
        handleSaving,
        id,
        userId,
        permissionDrawerError,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}
