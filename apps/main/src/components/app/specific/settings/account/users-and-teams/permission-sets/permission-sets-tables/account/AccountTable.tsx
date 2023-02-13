import { useContext } from "react";

import {
  Accordion,
  Table,
  ToggleSwitch,
} from "flowbite-react";

import {
  PermissionContext,
  PermissionContextType,
} from "@contexts/app/specific/settings/account/users-and-teams/permission-sets/PermissionContext";


export default function AccountTable() {
  // Just an arrow
  const arrowDown = (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="0"
      viewBox="0 0 24 24"
      className="ml-1 mt-1 h-3 w-3"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  );

  const { permissionSetsDataAccount, handlePermissionSet, saving } = useContext(PermissionContext) as PermissionContextType;

  return (
    <div className="p-2 py-4 flex flex-col">
      <h3 className="text-normal flex font-bold text-gray-800 dark:text-white">
        Settings access
      </h3>
      <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
        Manage access to T-WOL settings.
      </p>
      <Accordion flush alwaysOpen className="mt-6">
        <Accordion.Panel>
          <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
            Settings
          </Accordion.Title>
          <Accordion.Content>
            <Table hoverable={true} className="customTables">
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Marketing contacts access
                    </span>
                    <span className="font-normal text-xs">
                      This setting allows a user to access the Manage marketing
                      contacts page and set contacts to non-marketing. You’ll
                      need to use this tool when you purchase the Marketing
                      Contacts tier. Learn more about marketing contacts.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Marketing contacts access"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Marketing contacts access", !permissionSetsDataAccount["Marketing contacts access"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      App Marketplace access
                    </span>
                    <span className="font-normal text-xs">
                      Let users install Marketplace apps and manage app
                      settings.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["App Marketplace access"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "App Marketplace access", !permissionSetsDataAccount["App Marketplace access"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Asset Marketplace access
                    </span>
                    <span className="font-normal text-xs">
                      Let users install themes, templates, and modules from the
                      Asset Marketplace.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Asset Marketplace access"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Asset Marketplace access", !permissionSetsDataAccount["Asset Marketplace access"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      GDPR delete contacts
                    </span>
                    <span className="font-normal text-xs">
                      Let the user GDPR delete contact records. This permission
                      needs access to <b>CRM &gt; Contacts &gt; Delete</b>.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["GDPR delete contacts"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "GDPR delete contacts", !permissionSetsDataAccount["GDPR delete contacts"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      HubDB table settings
                    </span>
                    <span className="font-normal text-xs">
                      Allow the user to edit table settings and create, clone,
                      unpublish, or delete HubDB tables.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["HubDB table settings"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "HubDB table settings", !permissionSetsDataAccount["HubDB table settings"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Global content settings
                    </span>
                    <span className="font-normal text-xs">
                      Let users edit global content and themes on website and
                      blog pages.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Global content settings"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Global content settings", !permissionSetsDataAccount["Global content settings"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Website settings
                    </span>
                    <span className="font-normal text-xs">
                      Let users edit website settings, as well as blog and page
                      settings..
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Website settings"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Website settings", !permissionSetsDataAccount["Website settings"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Reports and dashboards
                    </span>
                    <span className="font-normal text-xs">
                      Let users create any report or dashboard and give access
                      to all analytics tools.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Reports and dashboards"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Reports and dashboards", !permissionSetsDataAccount["Reports and dashboards"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">Domain settings</span>
                    <span className="font-normal text-xs">
                      Let users connect domains and edit domain settings.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Domain settings"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Domain settings", !permissionSetsDataAccount["Domain settings"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      User table access
                    </span>
                    <span className="font-normal text-xs">
                      Let users see the user table in settings.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["User table access"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "User table access", !permissionSetsDataAccount["User table access"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Availability Management
                    </span>
                    <span className="font-normal text-xs">
                      Let users edit team member availability.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Availability Management"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Availability Management", !permissionSetsDataAccount["Availability Management"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>

      <div className="flex flex-col w-full mt-10">
        <div className="flex flex-row w-full mb-10">
          <div className="flex flex-col grow">
            <h3 className="text-normal flex font-bold text-gray-800 dark:text-white">
              Account Access
            </h3>
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
              Turn on to give access to sales tools and manage their
              permissions.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[240px]">
            <ToggleSwitch
              checked={permissionSetsDataAccount["Account Access"]}
              label=""
              onChange={() =>
                handlePermissionSet("Account", "Account Access", !permissionSetsDataAccount["Account Access"])
              }
              disabled={saving}
            />
          </div>
        </div>
        {!permissionSetsDataAccount["Account Access"] ? null : (
          <>
            <Table hoverable={true} className="customTables">
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Add and edit users
                    </span>
                    <span className="font-normal text-xs">
                      Let users add or edit other users. Users can only give
                      access to the same permissions they have.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Add and edit users"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Add and edit users", !permissionSetsDataAccount["Add and edit users"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Add and edit teams
                    </span>
                    <span className="font-normal text-xs">
                      Let users sort other users into specific teams.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Add and edit teams"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Add and edit teams", !permissionSetsDataAccount["Add and edit teams"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Partition by teams
                    </span>
                    <span className="font-normal text-xs">
                      Let users give asset access to specific users and teams.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Partition by teams"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Partition by teams", !permissionSetsDataAccount["Partition by teams"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">Presets</span>
                    <span className="font-normal text-xs">
                      Let users add and edit default settings and preferences
                      for a group of users.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Presets"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Presets", !permissionSetsDataAccount["Presets"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Edit account defaults
                    </span>
                    <span className="font-normal text-xs">
                      Let users set your account&apos;s name, language, time
                      zone, and default date and number format.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Edit account defaults"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Edit account defaults", !permissionSetsDataAccount["Edit account defaults"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Modify billing and change name on contract
                    </span>
                    <span className="font-normal text-xs">
                      Let users make changes to your HubSpot account&apos;s billing information.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Modify billing and change name on contract"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Modify billing and change name on contract", !permissionSetsDataAccount["Modify billing and change name on contract"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Add and edit developer apps and test accounts
                    </span>
                    <span className="font-normal text-xs">
                      Let users add and edit developer apps and create test
                      accounts.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataAccount["Add and edit developer apps and test accounts"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Account", "Add and edit developer apps and test accounts", !permissionSetsDataAccount["Add and edit developer apps and test accounts"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </>
        )}
      </div>
    </div>
  );
}
