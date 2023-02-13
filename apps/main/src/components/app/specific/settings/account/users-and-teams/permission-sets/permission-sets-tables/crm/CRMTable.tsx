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

export default function CRMTable() {
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



  const { permissionSetsDataCRM, handlePermissionSet, saving } = useContext(PermissionContext) as PermissionContextType;
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
    <div className="p-2 py-4 flex flex-col">
      <h3 className="text-normal flex font-bold text-gray-800 dark:text-white">
        CRM access
      </h3>
      <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
        All users have a basic level of CRM access and are able to create
        records. You can manage the access for each user with these permissions.
      </p>
      <Accordion flush alwaysOpen className="mt-10">
        <Accordion.Panel>
          <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
            Object access
          </Accordion.Title>
          <Accordion.Content>
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              Manage records users can view, edit, or communicate with.
            </p>
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              <b>View:</b> Choose which records the user can see.
            </p>
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              <b>Edit:</b> Choose which records the user can change.
            </p>
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              <b>Delete:</b> Choose which records the user can delete.
            </p>
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              <em className="font-bold">
                Use the checkbox to let users see unassigned records.
              </em>
            </p>
            <Table hoverable={true} className="customTables">
              <Table.Head>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell>View</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                    Contacts
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Contacts.View)}{" "}
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
                          handlePermissionSet("CRM", "Contacts", 1, "View")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Contacts", 2, "View")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Contacts", 3, "View")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Contacts.Edit)}{" "}
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
                          handlePermissionSet("CRM", "Contacts", 1, "Edit")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Contacts", 2, "Edit")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Contacts", 3, "Edit")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Contacts", 4, "Edit")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Contacts.Delete)}{" "}
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
                          handlePermissionSet("CRM", "Contacts", 1, "Delete")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Contacts", 2, "Delete")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Contacts", 3, "Delete")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Contacts", 4, "Delete")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                    Companies
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Companies.View)}{" "}
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
                          handlePermissionSet("CRM", "Companies", 1, "View")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Companies", 2, "View")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Companies", 3, "View")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Companies.Edit)}{" "}
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
                          handlePermissionSet("CRM", "Companies", 1, "Edit")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Companies", 2, "Edit")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Companies", 3, "Edit")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Companies", 4, "Edit")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Companies.Delete)}{" "}
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
                          handlePermissionSet("CRM", "Companies", 1, "Delete")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Companies", 2, "Delete")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Companies", 3, "Delete")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Companies", 4, "Delete")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                    Deals
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Deals.View)}{" "}
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
                          handlePermissionSet("CRM", "Deals", 1, "View")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Deals", 2, "View")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Deals", 3, "View")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Deals.Edit)}{" "}
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
                          handlePermissionSet("CRM", "Deals", 1, "Edit")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Deals", 2, "Edit")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Deals", 3, "Edit")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Deals", 4, "Edit")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Deals.Delete)}{" "}
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
                          handlePermissionSet("CRM", "Deals", 1, "Delete")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Deals", 2, "Delete")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Deals", 3, "Delete")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Deals", 4, "Delete")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                    Tickets
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Tickets.View)}{" "}
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
                          handlePermissionSet("CRM", "Tickets", 1, "View")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tickets", 2, "View")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tickets", 3, "View")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Tickets.Edit)}{" "}
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
                          handlePermissionSet("CRM", "Tickets", 1, "Edit")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tickets", 2, "Edit")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tickets", 3, "Edit")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tickets", 4, "Edit")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Tickets.Delete)}{" "}

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
                          handlePermissionSet("CRM", "Tickets", 1, "Delete")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tickets", 2, "Delete")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tickets", 3, "Delete")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tickets", 4, "Delete")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                    Tasks
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Tasks.View)}{" "}
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
                          handlePermissionSet("CRM", "Tasks", 1, "View")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tasks", 2, "View")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tasks", 3, "View")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Tasks.Edit)}{" "}
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
                          handlePermissionSet("CRM", "Tasks", 1, "Edit")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tasks", 2, "Edit")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tasks", 3, "Edit")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Tasks", 4, "Edit")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                    Notes
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM.Notes.View)}{" "}
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
                          handlePermissionSet("CRM", "Notes", 1, "View")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Notes", 2, "View")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Notes", 3, "View")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">

                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">

                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                    Custom Objects
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM["Custom Objects"].View)}{" "}
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
                          handlePermissionSet("CRM", "Custom Objects", 1, "View")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Custom Objects", 2, "View")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Custom Objects", 3, "View")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM["Custom Objects"].Edit)}{" "}
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
                          handlePermissionSet("CRM", "Custom Objects", 1, "Edit")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Custom Objects", 2, "Edit")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Custom Objects", 3, "Edit")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Custom Objects", 4, "Edit")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[100px]">
                    <Dropdown
                      label={
                        <span className="text-blue-600 text-sm font-medium flex">
                          {showValue(permissionSetsDataCRM["Custom Objects"].Delete)}{" "}
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
                          handlePermissionSet("CRM", "Custom Objects", 1, "Delete")
                        }
                      >
                        Everything
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Custom Objects", 2, "Delete")
                        }
                      >
                        Team only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Custom Objects", 3, "Delete")
                        }
                      >
                        Owned only
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handlePermissionSet("CRM", "Custom Objects", 4, "Delete")
                        }
                      >
                        None
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
            CRM tools
          </Accordion.Title>
          <Accordion.Content>
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              Manage access to how users can interact with records.
            </p>
            <Table hoverable={true} className="customTables">
              <Table.Head>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell>View</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-md">Workflows</span>
                    <span className="font-normal text-xs">
                      Let users create new workflows and make changes to
                      existing workflows.
                    </span>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                    <div className="flex flex-col items-center justify-center">
                      <Checkbox
                        onChange={() =>
                          handlePermissionSet("CRM", "Workflows", !permissionSetsDataCRM["Workflows"].View, "View")
                        }
                        checked={permissionSetsDataCRM["Workflows"].View}
                        disabled={saving}
                      />
                    </div>{" "}
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                    <div className="flex flex-col items-center justify-center">
                      <Checkbox
                        onChange={() =>
                          handlePermissionSet("CRM", "Workflows", !permissionSetsDataCRM["Workflows"].Edit, "Edit")
                        }
                        checked={permissionSetsDataCRM["Workflows"].Edit}
                        disabled={saving}
                      />
                    </div>{" "}
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                    <div className="flex flex-col items-center justify-center">
                      <Checkbox
                        onChange={() =>
                          handlePermissionSet("CRM", "Workflows", !permissionSetsDataCRM["Workflows"].Delete, "Delete")
                        }
                        checked={permissionSetsDataCRM["Workflows"].Delete}
                        disabled={saving}
                      />
                    </div>{" "}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-md">Communicate</span>
                    <span className="font-normal text-xs">
                      Let users email, call, or schedule a meeting with any
                      record, including contacts, companies, deals, tickets,
                      tasks, and any custom objects.
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
                            {showValue(permissionSetsDataCRM["Communicate"])}{" "}
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
                            handlePermissionSet("CRM", "Communicate", 1)
                          }
                        >
                          Everything
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handlePermissionSet("CRM", "Communicate", 2)
                          }
                        >
                          Team only
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handlePermissionSet("CRM", "Communicate", 3)
                          }
                        >
                          Owned only
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handlePermissionSet("CRM", "Communicate", 4)
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
                    <span className="font-medium text-md">Bulk delete</span>
                    <span className="font-normal text-xs">
                      Let users bulk delete records, logs, or messages.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={3}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataCRM["Bulk delete"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("CRM", "Bulk delete", !permissionSetsDataCRM["Bulk delete"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-md">Import</span>
                    <span className="font-normal text-xs">
                      Let users import records, contacts, companies, and more.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={3}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataCRM["Import"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("CRM", "Import", !permissionSetsDataCRM["Import"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-md">Export</span>
                    <span className="font-normal text-xs">
                      Let users export data from your account.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={3}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataCRM["Export"]
                        }
                        label=""
                        onChange={() =>
                          handlePermissionSet("CRM", "Export", !permissionSetsDataCRM["Export"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-md">
                      Edit property settings
                    </span>
                    <span className="font-normal text-xs">
                      Let users create and edit properties, along with scoring
                      properties, pipelines, stages, and record customization.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={3}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataCRM["Edit property settings"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("CRM", "Edit property settings", !permissionSetsDataCRM["Edit property settings"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-md">Chatflows</span>
                    <span className="font-normal text-xs">
                      Let users create, edit, and publish chatflows in your
                      account.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={3}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataCRM["Chatflows"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("CRM", "Chatflows", !permissionSetsDataCRM["Chatflows"])
                        }
                        disabled={saving}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-md">Custom views</span>
                    <span className="font-normal text-xs">
                      Let users create, edit, and delete custom views in the
                      inbox.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={3}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataCRM["Custom views"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("CRM", "Custom views", !permissionSetsDataCRM["Custom views"])
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
  );
}
