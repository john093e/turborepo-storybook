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


export default function SalesTable() {
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

  const { permissionSetsDataSales, handlePermissionSet, saving } = useContext(PermissionContext) as PermissionContextType;

  const showValue = (
    value: number,
  ) => {
    let toReturn = value === 1
      ? "Everything"
      : value === 2
        ? "Team only"
        : value === 3
          ? "Owned only"
          : value === 4
            ? "None"
            : "Everything";
    return toReturn;
  };

  return (
    <div className="p-2 py-4 flex flex-col gap-10">
      <Table hoverable={true} className="customTables">
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
            <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
              <span className="font-medium text-sm">
                Manage product library
              </span>
              <span className="font-normal text-xs">
                Let users access your product library and create and edit
                products in the library.
              </span>
            </Table.Cell>
            <Table.Cell
              colSpan={2}
              className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
            >
              <div className="flex flex-col items-center justify-center">
                <ToggleSwitch
                  checked={permissionSetsDataSales["Manage product library"]}
                  label=""
                  onChange={() =>
                    handlePermissionSet("Sales", "Manage product library", !permissionSetsDataSales["Manage product library"])
                  }
                  disabled={saving}
                />
              </div>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
            <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
              <span className="font-medium text-sm">
                Create custom line items
              </span>
              <span className="font-normal text-xs">
                Let users create custom line items within deals or quotes.
              </span>
            </Table.Cell>
            <Table.Cell
              colSpan={2}
              className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
            >
              <div className="flex flex-col items-center justify-center">
                <ToggleSwitch
                  checked={permissionSetsDataSales["Create custom line items"]}
                  label=""
                  onChange={() =>
                    handlePermissionSet("Sales", "Create custom line items", !permissionSetsDataSales["Create custom line items"])
                  }
                  disabled={saving}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <div className="flex flex-col w-full gap-10">
        <div className="flex flex-row w-full">
          <div className="flex flex-col grow">
            <h3 className="text-normal flex font-bold text-gray-800 dark:text-white">
              Sales Access
            </h3>
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
              Turn on to give access to sales tools and manage their
              permissions.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[240px]">
            <ToggleSwitch
              checked={permissionSetsDataSales["Sales Access"]}
              label=""
              onChange={() =>
                handlePermissionSet("Sales", "Sales Access", !permissionSetsDataSales["Sales Access"])
              }
              disabled={saving}
            />
          </div>
        </div>
        {!permissionSetsDataSales["Sales Access"] ? null : (
          <>
            <Table hoverable={true} className="customTables">
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">Templates</span>
                    <span className="font-normal text-xs">
                      Let users create and edit templates.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataSales["Templates"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Sales", "Templates", !permissionSetsDataSales["Templates"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Create scheduling pages for others
                    </span>
                    <span className="font-normal text-xs">
                      Let users create and edit scheduling pages for other users
                      in the meetings library.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={2}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataSales["Create scheduling pages for others"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Sales", "Create scheduling pages for others", !permissionSetsDataSales["Create scheduling pages for others"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <div className="w-full p-4 border-solid border-gray-200 border-2 rounded-md flex flex-row">
              <div className="flex flex-col w-4/5">
                <h4 className="text-normal flex font-bold tracking-tight text-gray-800 dark:text-white mb-4">
                  Sales Professional
                </h4>
                <p className="font-medium text-sm text-gray-700 dark:text-gray-400 mb-2">
                  A paid sales seat gives a user access to:
                </p>
                <ul className="space-y-1 max-w-md list-disc list-inside text-sm text-gray-700 dark:text-gray-400">
                  <li>Deal automation and lead rotation eligibility</li>
                  <li>Sequence queues for personalized emails</li>
                  <li>Access to forecasting tools</li>
                </ul>
              </div>
              <div className="flex w-1/5 flex-col items-center justify-center">
                <div>
                  <ToggleSwitch
                    checked={permissionSetsDataSales["Sales Professional"]}
                    label=""
                    onChange={() =>
                      handlePermissionSet("Sales", "Sales Professional", !permissionSetsDataSales["Sales Professional"])
                    }
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
            {!permissionSetsDataSales["Sales Professional"] ? null : (
              <>
                <Table hoverable={true} className="customTables">
                  <Table.Head>
                    <Table.HeadCell></Table.HeadCell>
                    <Table.HeadCell>View</Table.HeadCell>
                    <Table.HeadCell>Edit</Table.HeadCell>
                    <Table.HeadCell>Publish</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[280px]">
                        <span className="font-medium text-sm">Forecast</span>
                        <span className="font-normal text-xs">
                          Let users manage forecast properties or see revenue goals.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[120px]">
                        <div className="flex flex-col items-center justify-center">
                          <Dropdown
                            label={
                              <span className="text-blue-600 text-sm font-medium flex">
                                {showValue(permissionSetsDataSales["Forecast"].View)}{" "}
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
                                handlePermissionSet("Sales", "Forecast", 1, "View")
                              }
                            >
                              Everything
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handlePermissionSet("Sales", "Forecast", 2, "View")
                              }
                            >
                              Team only
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handlePermissionSet("Sales", "Forecast", 3, "View")
                              }
                            >
                              Owned only
                            </Dropdown.Item>
                          </Dropdown>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[120px]">
                        <div className="flex flex-col items-center justify-center">
                          <Dropdown
                            label={
                              <span className="text-blue-600 text-sm font-medium flex">
                                {showValue(permissionSetsDataSales["Forecast"].Edit)}{" "}
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
                                handlePermissionSet("Sales", "Forecast", 1, "Edit")
                              }
                            >
                              Everything
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handlePermissionSet("Sales", "Forecast", 2, "Edit")
                              }
                            >
                              Team only
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handlePermissionSet("Sales", "Forecast", 3, "Edit")
                              }
                            >
                              Owned only
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handlePermissionSet("Sales", "Forecast", 4, "Edit")
                              }
                            >
                              None
                            </Dropdown.Item>
                          </Dropdown>
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[120px]">

                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[280px]">
                        <span className="font-medium text-sm">
                          Playbooks
                        </span>
                        <span className="font-normal text-xs">
                          Let users create content cards for other team members to use as notes or with customers.
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[120px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataSales["Playbooks"].View}
                            onChange={() =>
                              handlePermissionSet("Sales", "Playbooks", !permissionSetsDataSales["Playbooks"].View, "View")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[120px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataSales["Playbooks"].Edit}
                            onChange={() =>
                              handlePermissionSet("Sales", "Playbooks", !permissionSetsDataSales["Playbooks"].Edit, "Edit")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[120px]">
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={permissionSetsDataSales["Playbooks"].Publish}
                            onChange={() =>
                              handlePermissionSet("Sales", "Playbooks", !permissionSetsDataSales["Playbooks"].Publish, "Publish")
                            }
                            disabled={saving}
                          />
                        </div>{" "}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[280px]">
                        <span className="font-medium text-sm">
                          Sequences
                        </span>
                        <span className="font-normal text-xs">
                          Let users create and edit a series of emails for contacts. When turned off, users will still be able to view and send sequences.
                        </span>
                      </Table.Cell>
                      <Table.Cell
                        colSpan={3}
                        className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[360px]"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <ToggleSwitch
                            checked={permissionSetsDataSales["Sequences"]}
                            label=""
                            onChange={() =>
                              handlePermissionSet("Sales", "Sequences", !permissionSetsDataSales["Sequences"])
                            }
                            disabled={saving}
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                      <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[280px]">
                        <span className="font-medium text-sm">Bulk enroll sequences</span>
                        <span className="font-normal text-xs">
                          Let users enroll up to 50 contacts in a sequence at once. When turned off, users can only enroll one contact at a time.
                        </span>
                      </Table.Cell>
                      <Table.Cell
                        colSpan={3}
                        className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[360px]"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <ToggleSwitch
                            checked={permissionSetsDataSales["Bulk enroll sequences"]}
                            label=""
                            onChange={() =>
                              handlePermissionSet("Sales", "Bulk enroll sequences", !permissionSetsDataSales["Bulk enroll sequences"])
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
          </>
        )}
        <Accordion flush alwaysOpen>
          <Accordion.Panel>
            <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
              Payments
            </Accordion.Title>
            <Accordion.Content>
              <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
                Manage access to payments tools.
              </p>
              <Table hoverable={true} className="customTables">
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                    <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                      <span className="font-medium text-sm">
                        Manage payment links
                      </span>
                      <span className="font-normal text-xs">
                        Let users create payment links to share over email and
                        chat, add payment options to quotes, and delete payment
                        links..
                      </span>
                    </Table.Cell>
                    <Table.Cell
                      colSpan={2}
                      className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <ToggleSwitch
                          checked={permissionSetsDataSales["Manage payment links"]}
                          label=""
                          onChange={() =>
                            handlePermissionSet("Sales", "Manage payment links", !permissionSetsDataSales["Manage payment links"])
                          }
                          disabled={saving}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                    <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                      <span className="font-medium text-sm">
                        Manage payments and subscriptions
                      </span>
                      <span className="font-normal text-xs">
                        Let users view and download payments and payouts and
                        resend receipts. Users can also cancel subscriptions and
                        issue refunds.
                      </span>
                    </Table.Cell>
                    <Table.Cell
                      colSpan={2}
                      className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <ToggleSwitch
                          checked={permissionSetsDataSales["Manage payments and subscriptions"]}
                          label=""
                          onChange={() =>
                            handlePermissionSet("Sales", "Manage payments and subscriptions", !permissionSetsDataSales["Manage payments and subscriptions"])
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
      </div>
    </div>
  );
}
