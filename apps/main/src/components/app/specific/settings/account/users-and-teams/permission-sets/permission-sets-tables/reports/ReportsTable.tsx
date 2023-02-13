import { useContext } from "react";

import {
  Checkbox,
  Table,
  ToggleSwitch,
} from "flowbite-react";

import {
  PermissionContext,
  PermissionContextType,
} from "@contexts/app/specific/settings/account/users-and-teams/permission-sets/PermissionContext";

export default function ReportsTable() {
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

  const { permissionSetsDataReports, handlePermissionSet, saving } = useContext(PermissionContext) as PermissionContextType;

  return (
    <div className="p-2 py-4 flex flex-col">
      <div className="flex flex-col w-full gap-10">
        <Table hoverable={true} className="customTables">
          <Table.Body className="divide-y">
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
              <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                <span className="font-medium text-sm">
                  Data quality tools access
                </span>
                <span className="font-normal text-xs">
                  Let users manage issues in the data quality, duplicates, and
                  formatting issues tools.
                </span>
              </Table.Cell>
              <Table.Cell
                colSpan={2}
                className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
              >
                <div className="flex flex-col items-center justify-center">
                  <ToggleSwitch
                    checked={permissionSetsDataReports["Data quality tools access"]}
                    label=""
                    onChange={() =>
                      handlePermissionSet("Reports", "Data quality tools access", !permissionSetsDataReports["Data quality tools access"])
                    }
                    disabled={saving}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <div className="flex flex-row w-full">
          <div className="flex flex-col grow">
            <h3 className="text-normal flex font-bold text-gray-800 dark:text-white">
              Reports Access
            </h3>
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
              Manage access to reporting tools. This includes dashboards,
              reports, and analytics tools. If turned off, users won’t see
              &ldquo;Reports&ldquo; in the main menu.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center min-w-[240px]">
            <ToggleSwitch
              checked={permissionSetsDataReports["Reports Access"]}
              label=""
              onChange={() =>
                handlePermissionSet("Reports", "Reports Access", !permissionSetsDataReports["Reports Access"])
              }
              disabled={saving}
            />
          </div>
        </div>
        {!permissionSetsDataReports["Reports Access"] ? null : (
          <>
            <Table hoverable={true} className="customTables">
              <Table.Head>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell>View</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
                <Table.HeadCell>Create/Own</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Dashboard, reports, and analytics
                    </span>
                    <span className="font-normal text-xs">
                      Let users create, edit, view, and delete reports and
                      dashboards.
                    </span>
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                    <div className="flex flex-col items-center justify-center">
                      <Checkbox
                        checked={permissionSetsDataReports["Dashboard, reports, and analytics"].View}
                        onChange={() =>
                          handlePermissionSet("Reports", "Dashboard, reports, and analytics", !permissionSetsDataReports["Dashboard, reports, and analytics"].View, "View")
                        }
                        disabled={saving}
                      />
                    </div>{" "}
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                    <div className="flex flex-col items-center justify-center">
                      <Checkbox
                        checked={permissionSetsDataReports["Dashboard, reports, and analytics"].Edit}
                        onChange={() =>
                          handlePermissionSet("Reports", "Dashboard, reports, and analytics", !permissionSetsDataReports["Dashboard, reports, and analytics"].Edit, "Edit")
                        }
                        disabled={saving}
                      />
                    </div>{" "}
                  </Table.Cell>
                  <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[80px]">
                    <div className="flex flex-col items-center justify-center">
                      <Checkbox
                        checked={permissionSetsDataReports["Dashboard, reports, and analytics"].Create}
                        onChange={() =>
                          handlePermissionSet("Reports", "Dashboard, reports, and analytics", !permissionSetsDataReports["Dashboard, reports, and analytics"].Create, "Create")
                        }
                        disabled={saving}
                      />
                    </div>{" "}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                  <Table.Cell className="align-middle flex flex-col break-words py-4 px-6 text-gray-900 dark:text-white min-w-[400px]">
                    <span className="font-medium text-sm">
                      Marketing reports
                    </span>
                    <span className="font-normal text-xs">
                      Let users track the performance of your emails, social
                      messages, and blog posts.
                    </span>
                  </Table.Cell>
                  <Table.Cell
                    colSpan={3}
                    className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[240px]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ToggleSwitch
                        checked={permissionSetsDataReports["Marketing reports"]}
                        label=""
                        onChange={() =>
                          handlePermissionSet("Reports", "Marketing reports", !permissionSetsDataReports["Marketing reports"])
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
