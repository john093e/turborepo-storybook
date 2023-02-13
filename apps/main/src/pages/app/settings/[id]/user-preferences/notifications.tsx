import { useRouter } from "next/router";
import Image from "next/image";
import { ReactElement } from "react";
import { Toaster } from "react-hot-toast";

import Layout from "@components/app/layout/Layout";
import SettingsNestedLayout from "@components/app/layout/SettingsNestedLayout";
import type { NextPageWithLayout } from "../../../../_app";
import { Accordion, Card, Tabs, ToggleSwitch } from "flowbite-react";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const userId = id;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 10000,
        }}
      />
      <div className="w-full mx-auto px-8 pt-4">
        <h1 className="font-cal text-3xl font-medium mb-4 text-gray-700 dark:text-gray-100">
          Notification
        </h1>
        <Tabs.Group
          aria-label="User Notification Settings Tabs"
          style="default"
          className="TabsGroup"
        >
          <Tabs.Item active={true} title="Email">
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              These preferences will only be applied to you for the current
              account you&apos;re sign in.
            </p>
            <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
            <div className="flex-row lg:flex">
              {/* Left side */}
              <div className="w-full">
                <h2 className="block mt-10 mb-2 text-md font-medium text-gray-900 dark:text-gray-100">
                  How you get notified
                </h2>
                <p className="text-gray-800 dark:text-gray-400 text-sm">
                  Please note: You can&apos;t unsubscribe from important emails
                  about your account, like status and billing updates.
                </p>
                <Card className="w-full mt-6 dark:shadow-xl">
                  <div className="flex-col items-center flex md:flex-row">
                    <div className="w-full md:w-4/5 flex">
                      <div className="w-16 relative block">
                        <Image
                          src="/static/3D/email-and-file.png"
                          alt="Image en 3D d'un email et un fichier"
                          fill
                          sizes="lg"
                          className="object-contain"
                        />
                      </div>
                      <div className="w-full pl-6 relative">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
                          Email
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                          Email notifications will be sent to your inbox.
                        </p>
                      </div>
                    </div>
                    <div className="w-full mt-4 md:mt-0 md:w-1/5 flex center justify-center items-center">
                      <ToggleSwitch
                        checked={true}
                        label=""
                        onChange={() => console.log("toogle")}
                      />
                    </div>
                  </div>
                </Card>
                <h2 className="block mt-10 mb-2 text-md font-medium text-gray-900 dark:text-gray-100">
                  What you get notified about
                </h2>
                <p className="text-gray-800 dark:text-gray-400 text-sm">
                  Choose what topics matter to you and how you get notified
                  about them.
                </p>
                <div className="my-8 flex flex-col space-y-6">
                  <Accordion>
                    <Accordion.Panel>
                      <Accordion.Title>What is Flowbite?</Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          Flowbite is an open-source library of interactive
                          components built on top of Tailwind CSS including
                          buttons, dropdowns, modals, navbars, and more.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Check out this guide to learn how to{" "}
                          <a
                            href="https://flowbite.com/docs/getting-started/introduction/"
                            className="text-blue-600 hover:underline dark:text-blue-500"
                          >
                            get started
                          </a>{" "}
                          and start developing websites even faster with
                          components on top of Tailwind CSS.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                      <Accordion.Title>
                        Is there a Figma file available?
                      </Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          Flowbite is first conceptualized and designed using
                          the Figma software so everything you see in the
                          library has a design equivalent in our Figma file.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          Check out the{" "}
                          <a
                            href="https://flowbite.com/figma/"
                            className="text-blue-600 hover:underline dark:text-blue-500"
                          >
                            Figma design system
                          </a>{" "}
                          based on the utility classes from Tailwind CSS and
                          components from Flowbite.
                        </p>
                      </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                      <Accordion.Title>
                        What are the differences between Flowbite and Tailwind
                        UI?
                      </Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          The main difference is that the core components from
                          Flowbite are open source under the MIT license,
                          whereas Tailwind UI is a paid product. Another
                          difference is that Flowbite relies on smaller and
                          standalone components, whereas Tailwind UI offers
                          sections of pages.
                        </p>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          However, we actually recommend using both Flowbite,
                          Flowbite Pro, and even Tailwind UI as there is no
                          technical reason stopping you from using the best of
                          two worlds.
                        </p>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          Learn more about these technologies:
                        </p>
                        <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                          <li>
                            <a
                              href="https://flowbite.com/pro/"
                              className="text-blue-600 hover:underline dark:text-blue-500"
                            >
                              Flowbite Pro
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://tailwindui.com/"
                              rel="nofollow"
                              className="text-blue-600 hover:underline dark:text-blue-500"
                            >
                              Tailwind UI
                            </a>
                          </li>
                        </ul>
                      </Accordion.Content>
                    </Accordion.Panel>
                  </Accordion>
                </div>
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Desktop">Desktop</Tabs.Item>
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
