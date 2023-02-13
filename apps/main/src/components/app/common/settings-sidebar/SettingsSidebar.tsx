import { Sidebar, Badge, Button } from "flowbite-react";
import { UilAngleLeft, UilAngleRight } from "@iconscout/react-unicons";
import styles from "./SettingsSidebar.module.css";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AppLoggedInContext } from "@contexts/AppLoggedInContext";
import { AppLoggedInContextType } from "@types/appLoggedInContext";
import {
  SettingsContext,
  SettingsContextType,
} from "@contexts/SettingsContext";

import Link from "next/link";

export default function SettingsSidebar() {
  const { user } = useContext(AppLoggedInContext) as AppLoggedInContextType;
  const { menuOpen, setMenuOpen } = useContext(
    SettingsContext
  ) as SettingsContextType;

  const router = useRouter();

  return (
    <Sidebar
      aria-label="Setting side bar menu"
      className={`${
        menuOpen
          ? "-left-64 -mr-64 md:left-0 md:mr-0 shadow-none dark:shadow-none md:shadow-none dark:md:shadow-none"
          : "left-0 md:-left-64 md:-mr-64 shadow-lg dark:shadow-dark md:shadow-none dark:md:shadow-none"
      } transition-300 w-64 min-w-[14em] border-gray-200 dark:border-gray-700 border-r-[1px] !fixed md:!relative ease-in-out duration-300 overflow-auto h-[calc(100vh-3.8rem)] z-10 ${
        styles.customSideBar
      }`}
    >
      <div className="w-full mb-4 relative flex justify-between ">
        <Button
          className="rounded-none rounded-r-md text-gray-700 relative -left-4"
          color="gray"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          className={`rounded-none text-gray-700 relative ${
            menuOpen
              ? "!fixed right-none left-0 md:left-[unset] rounded-r-md md:!relative md:-right-4 md:rounded-r-none md:rounded-l-md"
              : "-right-4 rounded-l-md md:!fixed right-none md:left-0 md:rounded-l-none md:rounded-r-md"
          }`}
          color="gray"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <UilAngleLeft /> : <UilAngleRight />}
        </Button>
      </div>
      <Sidebar.Items>
        <div className="flex w-full">
          <h4 className="text-xl tracking-tight dark:text-gray-100 font-medium text-gray-700 truncate">
            Settings
          </h4>
        </div>
        <Sidebar.ItemGroup className="border-none space-y-0">
          <div className="flex items-center justify-start rounded-lg p-2 text-left text-base font-medium text-gray-900 dark:text-gray-100">
            <h5 className="px-2 flex-1 whitespace-nowrap">Your Preferences</h5>
          </div>

          <li>
            <Link
              href={`/settings/${user.userId}/user-preferences/profile`}
              aria-labelledby="flowbite-sidebar-item-:r15:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r15:"
              >
                General
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={`/settings/${user.userId}/user-preferences/notifications`}
              aria-labelledby="flowbite-sidebar-item-:r16:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r16:"
              >
                Notifications
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={`/settings/${user.userId}/user-preferences/security`}
              aria-labelledby="flowbite-sidebar-item-:r17:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r17:"
              >
                Security
              </span>
            </Link>
          </li>
        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup className="space-y-0">
          <div className="flex items-center justify-start rounded-lg p-2 text-left text-base font-medium text-gray-900 dark:text-gray-100">
            <h5 className="px-2 flex-1 whitespace-nowrap">Account Setup</h5>
          </div>
          <li>
            <Link
              href={`/settings/${user.userId}/account-settings/account-defaults`}
              aria-labelledby="flowbite-sidebar-item-:r18:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r18:"
              >
                Account Defaults
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={`/settings/${user.userId}/account-settings/users-and-teams`}
              aria-labelledby="flowbite-sidebar-item-:r19:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r19:"
              >
                Users & Teams
              </span>
            </Link>
          </li>
          <Sidebar.Collapse label="Integration" className="font-thin text-sm">
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/integration/connected-apps`}
                aria-labelledby="flowbite-sidebar-item-:r20:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r20:"
                >
                  Connected Apps
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/integration/private-apps`}
                aria-labelledby="flowbite-sidebar-item-:r21:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r21:"
                >
                  Private Apps
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/integration/ecommerce`}
                aria-labelledby="flowbite-sidebar-item-:r22:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r22:"
                >
                  Ecommerce
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/integration/api-key`}
                aria-labelledby="flowbite-sidebar-item-:r23:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r23:"
                >
                  API Key
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/integration/email-service-provider`}
                aria-labelledby="flowbite-sidebar-item-:r24:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r24:"
                >
                  Email Service Provider
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/integration/marketplace-downloads`}
                aria-labelledby="flowbite-sidebar-item-:r25:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r25:"
                >
                  Marketplace Downloads
                </span>
              </Link>
            </li>
          </Sidebar.Collapse>
          <Sidebar.Collapse
            label="Tracking & Analitycs"
            className="dropdownSidbar"
          >
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/tracking-analitycs/tracking-code`}
                aria-labelledby="flowbite-sidebar-item-:r26:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r26:"
                >
                  Tracking Code
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/tracking-analitycs/attribution`}
                aria-labelledby="flowbite-sidebar-item-:r27:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r27:"
                >
                  Attribution
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/tracking-analitycs/legacy-goals`}
                aria-labelledby="flowbite-sidebar-item-:r28:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r28:"
                >
                  Legacy Goals
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/tracking-analitycs/goals`}
                aria-labelledby="flowbite-sidebar-item-:r29:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r29:"
                >
                  Goals
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/account-settings/tracking-analitycs/tracking-urls`}
                aria-labelledby="flowbite-sidebar-item-:r30:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r30:"
                >
                  Tracking URLs
                </span>
              </Link>
            </li>
          </Sidebar.Collapse>
          <li>
            <Link
              href={`/settings/${user.userId}/account-settings/privacy-and-consent`}
              aria-labelledby="flowbite-sidebar-item-:r31:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r31:"
              >
                Privacy & Consent
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={`/settings/${user.userId}/account-settings/sandboxes`}
              aria-labelledby="flowbite-sidebar-item-:r32:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r32:"
              >
                Sandboxes
              </span>
            </Link>
          </li>
        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup className="space-y-0">
          <div className="flex items-center justify-start rounded-lg p-2 text-left text-base font-medium text-gray-900 dark:text-gray-100">
            <h5 className="px-2 flex-1 whitespace-nowrap">Data Management</h5>
          </div>
          <li>
            <Link
              href={`/settings/${user.userId}/data-management/properties`}
              aria-labelledby="flowbite-sidebar-item-:r33:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r33:"
              >
                Properties
              </span>
            </Link>
          </li>
          <Sidebar.Collapse label="Objects" className="font-thin text-sm">
            <li>
              <Link
                href={`/settings/${user.userId}/data-management/objects/contacts`}
                aria-labelledby="flowbite-sidebar-item-:r34:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r34:"
                >
                  Contacts
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/data-management/objects/companies`}
                aria-labelledby="flowbite-sidebar-item-:r35:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r35:"
                >
                  Companies
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/data-management/objects/deals`}
                aria-labelledby="flowbite-sidebar-item-:r36:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r36:"
                >
                  Deals
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/data-management/objects/tickets`}
                aria-labelledby="flowbite-sidebar-item-:r37:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r37:"
                >
                  Tickets
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/data-management/objects/products`}
                aria-labelledby="flowbite-sidebar-item-:r38:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r38:"
                >
                  Products
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/data-management/objects/quotes`}
                aria-labelledby="flowbite-sidebar-item-:r39:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r39:"
                >
                  Quotes
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/data-management/objects/forecast`}
                aria-labelledby="flowbite-sidebar-item-:r40:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r40:"
                >
                  Forecast
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/data-management/objects/activities`}
                aria-labelledby="flowbite-sidebar-item-:r41:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r41:"
                >
                  Activities
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/data-management/objects/custom-objects`}
                aria-labelledby="flowbite-sidebar-item-:r42:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r42:"
                >
                  Custom Objects
                </span>
              </Link>
            </li>
          </Sidebar.Collapse>
          <li>
            <Link
              href={`/settings/${user.userId}/data-management/import-and-export`}
              aria-labelledby="flowbite-sidebar-item-:r43:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r43:"
              >
                Import & Export
              </span>
            </Link>
          </li>
        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup className="space-y-0">
          <div className="flex items-center justify-start rounded-lg p-2 text-left text-base font-medium text-gray-900 dark:text-gray-100">
            <h5 className="px-2 flex-1 whitespace-nowrap">Tools</h5>
          </div>
          <li>
            <Link
              href={`/settings/${user.userId}/tools/calling`}
              aria-labelledby="flowbite-sidebar-item-:r44:"
              className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r44:"
              >
                Calling
              </span>
            </Link>
          </li>

          <Sidebar.Collapse
            label="Inbox"
            className="font-thin text-sm space-y-0"
          >
            <li>
              <Link
                href={`/settings/${user.userId}/tools/inbox/inboxes`}
                aria-labelledby="flowbite-sidebar-item-:r45:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r45:"
                >
                  Inboxes
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/tools/inbox/availability-management`}
                aria-labelledby="flowbite-sidebar-item-:r46:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r46:"
                >
                  Availability Management
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/tools/inbox/allow-and-deny-list`}
                aria-labelledby="flowbite-sidebar-item-:r47:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r47:"
                >
                  Allow & Deny List
                </span>
              </Link>
            </li>
          </Sidebar.Collapse>
          <Sidebar.Collapse label="Marketing" className="font-thin text-sm">
            <li>
              <Link
                href={`/settings/${user.userId}/tools/marketing/ads`}
                aria-labelledby="flowbite-sidebar-item-:r48:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r48:"
                >
                  Ads
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/tools/marketing/email`}
                aria-labelledby="flowbite-sidebar-item-:r49:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r49:"
                >
                  Email
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/tools/marketing/forms`}
                aria-labelledby="flowbite-sidebar-item-:r50:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r50:"
                >
                  Forms
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/tools/marketing/social`}
                aria-labelledby="flowbite-sidebar-item-:r51:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r51:"
                >
                  Social
                </span>
              </Link>
            </li>
          </Sidebar.Collapse>
          <Sidebar.Collapse label="Websites" className="font-thin text-sm">
            <li>
              <Link
                href={`/settings/${user.userId}/tools/websites/domains-and-urls`}
                aria-labelledby="flowbite-sidebar-item-:r52:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r52:"
                >
                  Domains & URLs
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/tools/websites/navigation`}
                aria-labelledby="flowbite-sidebar-item-:r53:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r53:"
                >
                  Navigation
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/tools/websites/themes`}
                aria-labelledby="flowbite-sidebar-item-:r54:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r54:"
                >
                  Themes
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/tools/websites/blog`}
                aria-labelledby="flowbite-sidebar-item-:r55:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r55:"
                >
                  Blog
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/settings/${user.userId}/tools/websites/pages`}
                aria-labelledby="flowbite-sidebar-item-:r56:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r56:"
                >
                  Pages
                </span>
              </Link>
            </li>
          </Sidebar.Collapse>
          <li>
              <Link
                href={`/settings/${user.userId}/tools/websites/payments`}
                aria-labelledby="flowbite-sidebar-item-:r57:"
                className="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className="px-3 flex-1 whitespace-nowrap font-thin text-sm"
                  data-testid="flowbite-sidebar-item-content"
                  id="flowbite-sidebar-item-:r57:"
                >
                  Payments
                </span>
              </Link>
            </li>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

      {/* <Sidebar.CTA className="w-full absolute left-0 bottom-0 shadow transition-opacity duration-100 border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-gray-100 rounded-none ">
        <div className="mb-3 flex items-center">
          <Badge color="warning">Beta</Badge>
          <button
            aria-label="Close"
            className="-m-1.5 ml-auto inline-flex h-6 w-6 rounded-lg bg-blue-50 p-1 text-blue-900 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
            type="button"
          >
            <svg
              aria-hidden={true}
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <p className="mb-3 text-sm text-blue-900 dark:text-blue-400">
          Preview the new Flowbite dashboard navigation! You can turn the new
          navigation off for a limited time in your profile.
        </p>
        <a
          className="text-sm text-blue-900 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          href="#"
        >
          Turn new navigation off
        </a>
      </Sidebar.CTA> */}
    </Sidebar>
  );
}
