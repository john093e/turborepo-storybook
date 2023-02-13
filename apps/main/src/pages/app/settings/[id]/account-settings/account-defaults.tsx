import { useRouter } from "next/router";
import Link from "next/link";
import { useState, ReactElement } from "react";
import { Toaster } from "react-hot-toast";

import Layout from "@components/app/layout/Layout";
import SettingsNestedLayout from "@components/app/layout/SettingsNestedLayout";
import type { NextPageWithLayout } from "../../../../_app";
import { Tabs } from "flowbite-react";

import Defaults from "@components/app/specific/settings/account/account-defaults/Defaults";
import Security from "@components/app/specific/settings/account/account-defaults/Security";
import Branding from "@components/app/specific/settings/account/account-defaults/Branding";
import UsersDefaults from "@components/app/specific/settings/account/account-defaults/UsersDefaults";
import Currency from "@components/app/specific/settings/account/account-defaults/Currency";

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
      <div className="w-full flex flex-col mx-auto px-8 pt-4 pb-10 relative">
        <h1 className="font-cal text-3xl font-medium mb-4 text-gray-700 dark:text-gray-100">
          Account Settings
        </h1>

        <Tabs.Group
          aria-label="User Settings Tabs"
          style="default"
          className="TabsGroup"
        >
          <Tabs.Item active={true} title="General">
            <Defaults userId={userId} />
          </Tabs.Item>
          <Tabs.Item title="Security">
            <Security userId={userId} />
          </Tabs.Item>
          <Tabs.Item title="Branding">
            <Branding userId={userId} />
          </Tabs.Item>
          <Tabs.Item title="User Defaults">
            <UsersDefaults userId={userId} />
          </Tabs.Item>
          <Tabs.Item title="Currency">
            <Currency userId={userId} />
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
