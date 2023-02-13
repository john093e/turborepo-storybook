import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Toaster } from "react-hot-toast";

import Layout from "@components/app/layout/Layout";
import SettingsNestedLayout from "@components/app/layout/SettingsNestedLayout";
import type { NextPageWithLayout } from "../../../../_app";
import { Tabs } from "flowbite-react";

import Users from "@components/app/specific/settings/account/users-and-teams/Users";
import TeamsSet from "@components/app/specific/settings/account/users-and-teams/TeamsSet";
import PermissionSetsSet from "@components/app/specific/settings/account/users-and-teams/permission-sets/PermissionSetsSet";
import UsersDefaults from "@components/app/specific/settings/account/account-defaults/UsersDefaults";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const userId = id as string;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 10000,
        }}
      />
      <div className="w-full min-h-full flex flex-col mx-auto px-8 pt-4 pb-10 relative">
        <Tabs.Group
          aria-label="User Settings Tabs"
          style="default"
          className="TabsGroup min-h-full"
        >
          <Tabs.Item active={true} title="Users">
            <Users userId={userId} />
          </Tabs.Item>
          <Tabs.Item title="Teams">
            <TeamsSet userId={userId} />
          </Tabs.Item>
          <Tabs.Item title="Permission Sets">
            <PermissionSetsSet userId={userId} />
          </Tabs.Item>
          <Tabs.Item title="Presets">
            <UsersDefaults userId={userId} />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <SettingsNestedLayout>{page}</SettingsNestedLayout>
    </Layout>
  );
};

export default Page;

// Workaround to fetch router query
export async function getServerSideProps() {
  return {
    props: {},
  };
}
