import { useContext } from "react";

import {
  Table,
  ToggleSwitch,
} from "flowbite-react";

import {
  PermissionContext,
  PermissionContextType,
} from "@contexts/app/specific/settings/account/users-and-teams/permission-sets/PermissionContext";


export default function ServicesTable() {
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

  const { permissionSetsDataService, handlePermissionSet, saving } = useContext(PermissionContext) as PermissionContextType;

  return (
    <div className="p-2 py-4 flex flex-col gap-10">
      <div className="flex flex-col w-full">
        <div className="flex flex-row w-full mb-10">
          <div className="flex flex-col grow">
            <h3 className="text-normal flex font-bold text-gray-800 dark:text-white">
              Service Access
            </h3>
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
              Turn on to give access to service tools and customize permissions.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[240px]">
            <ToggleSwitch
              checked={permissionSetsDataService["Service Access"]}
              label=""
              onChange={() =>
                handlePermissionSet("Service", "Service Access", !permissionSetsDataService["Service Access"])
              }
              disabled={saving}
            />
          </div>
        </div>
        {!permissionSetsDataService["Service Access"] ? null : (
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
                        checked={permissionSetsDataService["Templates"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Service", "Templates", !permissionSetsDataService["Templates"])
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
                        checked={permissionSetsDataService["Create scheduling pages for others"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Service", "Create scheduling pages for others", !permissionSetsDataService["Create scheduling pages for others"])
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
