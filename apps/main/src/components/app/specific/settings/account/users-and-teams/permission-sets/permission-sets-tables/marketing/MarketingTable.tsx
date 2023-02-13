import { useContext } from "react";

import {
  Accordion,
  Checkbox,
  Dropdown,
  Table,
  ToggleSwitch,
} from "flowbite-react";

import {
  PermissionContext,
  PermissionContextType,
} from "@contexts/app/specific/settings/account/users-and-teams/permission-sets/PermissionContext";

export default function MarketingTable() {
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

  const { permissionSetsDataMarketing, handlePermissionSet, saving } = useContext(PermissionContext) as PermissionContextType;
  const showValue = (
    value: number,
  ) => {
    let toReturn = value === 1
      ? "All accessible acccounts"
      : value === 2
        ? "Their connected accounts"
        : value === 3
          ? "Draft only"
          : value === 4
            ? "None"
            : "All accessible acccounts";
    return toReturn;
  };


  return (
    <div className="p-2 py-4 flex flex-col gap-10">
      <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
        While these tools are primarily used for marketing, they’re included
        with any subscription.
      </p>

      <Table hoverable={true} className="customTables">
        <Table.Head>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>View</Table.HeadCell>
          <Table.HeadCell>Edit</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
            <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
              <span className="font-medium text-sm">Lists</span>
              <span className="font-normal text-xs">
                Let users view or create lists of contacts or companies in the
                Lists app.
              </span>
            </Table.Cell>
            <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
              <div className="flex flex-col items-center justify-center">
                <Checkbox
                  checked={permissionSetsDataMarketing["Lists"].View}
                  onChange={() =>
                    handlePermissionSet("Marketing", "Lists", !permissionSetsDataMarketing["Lists"].View, "View")
                  }
                  disabled={saving}
                />
              </div>{" "}
            </Table.Cell>
            <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
              <div className="flex flex-col items-center justify-center">
                <Checkbox
                  checked={permissionSetsDataMarketing["Lists"].Edit}
                  onChange={() =>
                    handlePermissionSet("Marketing", "Lists", !permissionSetsDataMarketing["Lists"].Edit, "Edit")
                  }
                  disabled={saving}
                />
              </div>{" "}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
            <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
              <span className="font-medium text-sm">Forms</span>
              <span className="font-normal text-xs">
                Let users create and edit forms to collect data.
              </span>
            </Table.Cell>
            <Table.Cell
              colSpan={2}
              className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
            >
              <div className="flex flex-col items-center justify-center">
                <ToggleSwitch
                  checked={permissionSetsDataMarketing["Forms"]}
                  label=""
                  onChange={() =>
                    handlePermissionSet("Marketing", "Forms", !permissionSetsDataMarketing["Forms"])
                  }
                  disabled={saving}
                />
              </div>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
            <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
              <span className="font-medium text-sm">Files</span>
              <span className="font-normal text-xs">
                Let users upload, edit, and delete files and folders.
              </span>
            </Table.Cell>
            <Table.Cell
              colSpan={2}
              className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
            >
              <div className="flex flex-col items-center justify-center">
                <ToggleSwitch
                  checked={permissionSetsDataMarketing["Files"]}
                  label=""
                  onChange={() =>
                    handlePermissionSet("Marketing", "Files", !permissionSetsDataMarketing["Files"])
                  }
                  disabled={saving}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <div className="flex flex-col w-full">
        <div className="flex flex-row w-full">
          <div className="flex flex-col">
            <h3 className="text-normal flex font-bold text-gray-800 dark:text-white">
              Marketing Access
            </h3>
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
              Turn on to give users access to marketing and website tools. To
              use the CTA tool, users need to have &ldquo;Edit&ldquo; or
              &ldquo;Publish&ldquo; access to at least one other marketing tool.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[240px]">
            <ToggleSwitch
              checked={permissionSetsDataMarketing["Marketing Access"]}
              label=""
              onChange={() =>
                handlePermissionSet("Marketing", "Marketing Access", !permissionSetsDataMarketing["Marketing Access"])
              }
              disabled={saving}
            />
          </div>
        </div>
        {!permissionSetsDataMarketing["Marketing Access"] ? null : (
          <Accordion flush alwaysOpen className="mt-6">
            <Accordion.Panel>
              <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
                Marketing tools
              </Accordion.Title>
              <Accordion.Content>
                <p className="font-normal text-sm text-gray-700 dark:text-gray-400 mb-10">
                  Manage access to the tools your team uses to build marketing
                  campaigns.
                </p>
                <Table hoverable={true} className="customTables">
                  <Table.Head>
                    <Table.HeadCell></Table.HeadCell>
                    <Table.HeadCell>View</Table.HeadCell>
                    <Table.HeadCell>Edit</Table.HeadCell>
                    <Table.HeadCell>Publish</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">Ads</span>
                        <span className="font-normal text-xs">
                          Let users view, draft, and publish campaigns to
                          connected ad accounts.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Ads"].View}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Ads", !permissionSetsDataMarketing["Ads"].View, "View")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]"></Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Ads"].Publish}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Ads", !permissionSetsDataMarketing["Ads"].Publish, "Publish")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">Campaigns</span>
                        <span className="font-normal text-xs">
                          Let users manage marketing campaign assets.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Campaigns"].View}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Campaigns", !permissionSetsDataMarketing["Campaigns"].View, "View")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Campaigns"].Edit}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Campaigns", !permissionSetsDataMarketing["Campaigns"].Edit, "Edit")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]"></Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">Email</span>
                        <span className="font-normal text-xs">
                          Let users add, edit, or send marketing emails. To let
                          users save marketing emails as templates, turn on{" "}
                          <b>Website tools &gt; Design tools</b>.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Email"].View}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Email", !permissionSetsDataMarketing["Email"].View, "View")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Email"].Edit}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Email", !permissionSetsDataMarketing["Email"].Edit, "Edit")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Email"].Publish}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Email", !permissionSetsDataMarketing["Email"].Publish, "Publish")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">Social</span>
                        <span className="font-normal text-xs">
                          Let users view, draft posts, and publish to connected
                          social accounts.
                        </span>
                      </Table.Cell>
                      <Table.Cell
                        colSpan={3}
                        className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Dropdown
                            label={
                              <span className="text-blue-600 text-sm font-medium flex">
                                {showValue(permissionSetsDataMarketing["Social"])}{" "}
                                {arrowDown}
                              </span>
                            }
                            inline={true}
                            arrowIcon={false}
                            placement="bottom-end"
                            className="w-40"
                            disabled={saving}
                          >
                            <Dropdown.Item
                              onClick={() =>
                                handlePermissionSet("Marketing", "Social", 1)
                              }
                            >
                              All accessible acccounts
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handlePermissionSet("Marketing", "Social", 2)
                              }
                            >
                              Their connected accounts
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handlePermissionSet("Marketing", "Social", 3)
                              }
                            >
                              Draft only
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handlePermissionSet("Marketing", "Social", 4)
                              }
                            >
                              None
                            </Dropdown.Item>
                          </Dropdown>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">
                          Content staging
                        </span>
                        <span className="font-normal text-xs">
                          Let users create and edit site pages or landing pages.
                        </span>
                      </Table.Cell>
                      <Table.Cell
                        colSpan={3}
                        className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <ToggleSwitch
                            checked={permissionSetsDataMarketing["Content staging"]}
                            label=""
                            onChange={() =>
                              handlePermissionSet("Marketing", "Content staging", !permissionSetsDataMarketing["Content staging"])
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
            <Accordion.Panel>
              <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
                Website tools
              </Accordion.Title>
              <Accordion.Content>
                <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
                  Manage access to your website&apos;s design and content tools.
                </p>
                <Table hoverable={true} className="customTables">
                  <Table.Head>
                    <Table.HeadCell></Table.HeadCell>
                    <Table.HeadCell>View</Table.HeadCell>
                    <Table.HeadCell>Edit</Table.HeadCell>
                    <Table.HeadCell>Publish</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">Blog</span>
                        <span className="font-normal text-xs">
                          Let users create new blogs and manage blog settings.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Blog"].View}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Blog", !permissionSetsDataMarketing["Blog"].View, "View")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Blog"].Edit}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Blog", !permissionSetsDataMarketing["Blog"].Edit, "Edit")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Blog"].Publish}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Blog", !permissionSetsDataMarketing["Blog"].Publish, "Publish")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">
                          Landing pages
                        </span>
                        <span className="font-normal text-xs">
                          Let users create or publish new landing pages and edit
                          existing pages.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Landing pages"].View}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Landing pages", !permissionSetsDataMarketing["Landing pages"].View, "View")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Landing pages"].Edit}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Landing pages", !permissionSetsDataMarketing["Landing pages"].Edit, "Edit")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Landing pages"].Publish}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Landing pages", !permissionSetsDataMarketing["Landing pages"].Publish, "Publish")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">
                          Website pages
                        </span>
                        <span className="font-normal text-xs">
                          Let users create or publish new web pages and edit
                          existing pages.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Website pages"].View}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Website pages", !permissionSetsDataMarketing["Website pages"].View, "View")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Website pages"].Edit}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Website pages", !permissionSetsDataMarketing["Website pages"].Edit, "Edit")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["Website pages"].Publish}
                            onChange={() =>
                              handlePermissionSet("Marketing", "Website pages", !permissionSetsDataMarketing["Website pages"].Publish, "Publish")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">HubDB</span>
                        <span className="font-normal text-xs">
                          Let users access HubDB.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["HubDB"].View}
                            onChange={() =>
                              handlePermissionSet("Marketing", "HubDB", !permissionSetsDataMarketing["HubDB"].View, "View")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["HubDB"].Edit}
                            onChange={() =>
                              handlePermissionSet("Marketing", "HubDB", !permissionSetsDataMarketing["HubDB"].Edit, "Edit")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["HubDB"].Publish}
                            onChange={() =>
                              handlePermissionSet("Marketing", "HubDB", !permissionSetsDataMarketing["HubDB"].Publish, "Publish")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">
                          URL Redirects
                        </span>
                        <span className="font-normal text-xs">
                          Let users add and edit URL redirects to your website.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["URL Redirects"].View}
                            onChange={() =>
                              handlePermissionSet("Marketing", "URL Redirects", !permissionSetsDataMarketing["URL Redirects"].View, "View")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataMarketing["URL Redirects"].Edit}
                            onChange={() =>
                              handlePermissionSet("Marketing", "URL Redirects", !permissionSetsDataMarketing["URL Redirects"].Edit, "Edit")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]"></Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                        <span className="font-medium text-sm">
                          Design tools
                        </span>
                        <span className="font-normal text-xs">
                          Let users edit code, templates, and modules.
                        </span>
                      </Table.Cell>
                      <Table.Cell
                        colSpan={3}
                        className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <ToggleSwitch
                            checked={permissionSetsDataMarketing["Design tools"]}
                            label=""
                            onChange={() =>
                              handlePermissionSet("Marketing", "Design tools", !permissionSetsDataMarketing["Design tools"])
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
        )}
      </div>
    </div>
  );
}
