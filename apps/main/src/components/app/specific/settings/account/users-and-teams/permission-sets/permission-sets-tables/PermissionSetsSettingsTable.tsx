import { Tabs } from "flowbite-react";

import CRMTable from "@components/app/specific/settings/account/users-and-teams/permission-sets/permission-sets-tables/crm/CRMTable";
import MarketingTable from "@components/app/specific/settings/account/users-and-teams/permission-sets/permission-sets-tables/marketing/MarketingTable";
import SalesTable from "@components/app/specific/settings/account/users-and-teams/permission-sets/permission-sets-tables/sales/SalesTable";
import ServicesTable from "@components/app/specific/settings/account/users-and-teams/permission-sets/permission-sets-tables/services/ServicesTable";
import ReportsTable from "@components/app/specific/settings/account/users-and-teams/permission-sets/permission-sets-tables/reports/ReportsTable";
import AccountTable from "@components/app/specific/settings/account/users-and-teams/permission-sets/permission-sets-tables/account/AccountTable";

export default function PermissionSetsSettingsTable() {
  return (
    <div className="w-full flex flex-col px-4 pt-4 pb-10 relative">
      <Tabs.Group
        aria-label="Permission Sets Settings Tabs"
        style="default"
        className="TabsGroup"
      >
        <Tabs.Item active={true} title="CRM">
          <CRMTable />
        </Tabs.Item>
        <Tabs.Item title="Marketing">
          <MarketingTable />
        </Tabs.Item>
        <Tabs.Item title="Sales">
          <SalesTable />
        </Tabs.Item>
        <Tabs.Item title="Service">
          <ServicesTable />
        </Tabs.Item>
        <Tabs.Item title="Reports">
          <ReportsTable />
        </Tabs.Item>
        <Tabs.Item title="Account">
          <AccountTable />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
