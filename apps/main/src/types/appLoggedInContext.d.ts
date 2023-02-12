export interface IPermissionSets {
    name: string | null;
    accountOwner: boolean;
    super_admin: boolean;
    //CRM
    crm_contacts_delete: number;
    crm_contacts_edit: number;
    crm_contacts_view: number;
    crm_companies_delete: number;
    crm_companies_edit: number;
    crm_companies_view: number;
    crm_deals_delete: number;
    crm_deals_edit: number;
    crm_deals_view: number;
    crm_tickets_delte: number;
    crm_tickets_edit: number;
    crm_tickets_view: number;
    crm_tasks_edit: number;
    crm_tasks_view: number;
    crm_notes_view: number;
    crm_custom_objects_delete: number;
    crm_custom_objects_edit: number;
    crm_custom_objects_view: number;
    crm_workflows_delete: boolean;
    crm_workflows_edit: boolean;
    crm_workflows_view: boolean;
    crm_communicate: number;
    crm_bulk_delete: boolean;
    crm_import: boolean;
    crm_export: boolean;
    crm_edit_property_settings: boolean;
    crm_chatflows: boolean;
    crm_customs_views: boolean;
    //Marketing
    marketing_lists_edit: boolean;
    marketing_lists_view: boolean;
    marketing_forms: boolean;
    marketing_files: boolean;
    marketing_marketing_access: boolean;
    marketing_ads_publish: boolean;
    marketing_ads_view: boolean;
    marketing_campaigns_edit: boolean;
    marketing_campaigns_view: boolean;
    marketing_email_edit: boolean;
    marketing_email_publish: boolean;
    marketing_email_view: boolean;
    marketing_social: number;
    marketing_content_staging: boolean;
    marketing_blog_edit: boolean;
    marketing_blog_publish: boolean;
    marketing_blog_view: boolean;
    marketing_landing_pages_edit: boolean;
    marketing_landing_pages_publish: boolean;
    marketing_landing_pages_view: boolean;
    marketing_website_pages_edit: boolean;
    marketing_website_pages_publish: boolean;
    marketing_website_pages_view: boolean;
    marketing_hubdb_edit: boolean;
    marketing_hubdb_publish: boolean;
    marketing_hubdb_view: boolean;
    marketing_url_redirects_edit: boolean;
    marketing_url_redirects_view: boolean;
    marketing_design_tools: boolean;
    //Sales
    sales_manage_product_library: boolean;
    sales_create_custom_line_items: boolean;
    sales_sales_access: boolean;
    sales_templates: boolean;
    sales_create_scheduling_pages_for_others: boolean;
    sales_sales_professional: boolean;
    sales_forecast_edit: number;
    sales_forecast_view: number;
    sales_playbooks_edit: boolean;
    sales_playbooks_publish: boolean;
    sales_playbooks_view: boolean;
    sales_sequences: boolean;
    sales_bulk_enroll_sequences: boolean;
    sales_manage_payment_links: boolean;
    sales_manage_payments_and_subscriptions: boolean;
    //Services
    service_service_access: boolean;
    service_templates: boolean;
    service_create_scheduling_pages_for_others: boolean;
    //Reports
    reports_data_quality_tools_access: boolean;
    reports_reports_access: boolean;
    reports_dashboard_reports_and_analytics_create: boolean;
    reports_dashboard_reports_and_analytics_edit: boolean;
    reports_dashboard_reports_and_analytics_view: boolean;
    reports_marketing_reports: boolean;
    //Account
    account_marketing_contacts_access: boolean;
    account_app_marketplace_access: boolean;
    account_asset_marketplace_access: boolean;
    account_gdpr_delete_contacts: boolean;
    account_hubdb_table_settings: boolean;
    account_global_content_settings: boolean;
    account_website_settings: boolean;
    account_reports_and_dashboards: boolean;
    account_domain_settings: boolean;
    account_account_access: boolean;
    account_add_and_edit_users: boolean;
    account_add_and_edit_teams: boolean;
    account_partition_by_teams: boolean;
    account_presets: boolean;
    account_edit_account_defaults: boolean;
    account_modify_billing_and_change_name_on_contract: boolean;
    account_add_and_edit_developer_apps_and_test_accounts: boolean;
    account_user_table_access: boolean;
    account_availability_management: boolean;
};

export interface IB2E {
    defaultHomepage: string;
    inUse: boolean;
    ongId: string;
    ong: {
        registered_name: string;
        account_name: string | null;
    },
    role: number;
};

export interface IUser {
    dateFormat: string | null;
    defaultHomepage: string | null;
    email: string | null;
    firstname: string | null;
    fullName: string | null;
    image: string | null;
    inUseOngId: string | null;
    inUseOngName: string | null;
    language: string | null;
    lastname: string | null;
    ongConnected: IB2E[] | null;
    role: number | null;
    permissionSet: IPermissionSets | null;
    userId: string | null;
};

export type AppLoggedInContextType = {
    user: IUser;
    loading: boolean;
    error: string | null;
    setError: (data: string | null) => void;
    setLoading: (loading: boolean) => void;
    setUserFunction: (userId: string) => void;
    changeAccount: (ongId: string) => void;
    setRootModal: (component: ReactElement<any, any>) => void;
    useRootModal: boolean;
    modalContent: ReactElement<any, any> | null;
    resetRootModal: () => void;
    setRootDrawer: (component: ReactElement<any, any>) => void;
    useRootDrawer: boolean;
    drawerContent: ReactElement<any, any> | null;
    resetRootDrawer: () => void;
}