import { useContext, useState } from "react";
import LoadingDots from "@components/common/loading-dots/LoadingDots";

import {
    Badge,
    Button,
    Card,
    Checkbox,
    Label,
    TextInput,
    ToggleSwitch,
    Tooltip,
} from "flowbite-react";
import { UilInfo, UilPen } from "@iconscout/react-unicons";

import PermissionSetsSettingsTable from "@components/app/specific/settings/account/users-and-teams/permission-sets/permission-sets-tables/PermissionSetsSettingsTable";

import {
    PermissionContext,
    PermissionContextType
} from "@contexts/app/specific/settings/account/users-and-teams/permission-sets/PermissionContext";


interface PropPermissionDrawer {
    closeProcess: () => void;
}

export default function PermissionSetsDrawerContent({
    closeProcess,
}: PropPermissionDrawer) {

    const { id, saving, handleSaving, permissionName, setPermissionName, setAsSuperAdmin, setSetAsSuperAdmin, setAsSuperAdminWithSalesPro, setSetAsSuperAdminWithSalesPro, permissionIsValid } = useContext(PermissionContext) as PermissionContextType;

    const [permissionNameError, setPermissionNameError] = useState<string | null>(null);

    const [toSetPermissionName, setToSetPermissionName] = useState<string>(permissionName);

    const [showDrawer, setShowDrawer] = useState<boolean>(true);

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setTimeout(() => {
            closeProcess();
        }, 100);
    };

    const handlePermissionName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setToSetPermissionName(name);
        if (name.length > 0) {
            if (/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(([',. -][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ])?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]*)*$/.test(name)) {
                setPermissionName(name);
                setPermissionNameError(null);
            } else {
                setPermissionNameError("Le format du nom du set de permission est invalide.")
            }
        } else {
            setPermissionNameError("Vous devez remplir ce champ.")
        }
    }
    return (
        <>
            <div
                id="drawer-create-permission-sets-default"
                className={`fixed top-0 right-0 z-40 w-full h-screen flex flex-col max-w-3xl overflow-y-auto transition-transform bg-white dark:bg-gray-800 ${showDrawer ? "transform-none" : "translate-x-full"
                    }`}
                tabIndex={-1}
                aria-labelledby="drawer-label"
                aria-hidden="true"
            >
                {/* Header */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 flex p-4 relative">
                    <h5
                        id="drawer-label"
                        className="inline-flex items-center text-sm font-semibold text-gray-500 uppercase dark:text-gray-100"
                    >
                        {id ? "Update permission sets" : "Create permission sets"}
                    </h5>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={handleCloseDrawer}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Close menu</span>
                    </button>
                </div>

                {/* Body */}
                <div className="w-full h-full max-h-full overflow-hidden relative">
                    {saving ? (
                        <div className="h-full w-full flex flex-col items-center justify-center">
                            <LoadingDots color="#000" />{" "}
                        </div>
                    ) : (
                        <>
                            {/* body header - Permission Name */}
                            <div className="flex flex-col w-full h-full relative overflow-y-scroll pb-10 ">
                                <div className="flex flex-col w-full my-10 px-4">
                                    <div className="w-full md:w-auto xs:flex">
                                        <label
                                            htmlFor="permissionName"
                                            className="sr-only"
                                        >
                                            Permission set name
                                        </label>
                                        <TextInput
                                            id="permissionName"
                                            type="text"
                                            placeholder="Permission set name"
                                            required={true}
                                            disabled={saving}
                                            name="permissionName"
                                            pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(([',. -][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ])?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]*)*$"
                                            icon={UilPen}
                                            value={toSetPermissionName}
                                            onChange={(event) => handlePermissionName(event)}
                                            sizing="md"
                                        />
                                    </div>
                                    {permissionNameError && (
                                        <div className="mt-0 text-sm font-normal text-red-700 dark:text-red-200">
                                            <p>{permissionNameError}</p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mt-4">
                                        <Checkbox
                                            id="set-as-super-admin"
                                            checked={setAsSuperAdmin}
                                            disabled={saving}
                                            onChange={() => setSetAsSuperAdmin(!setAsSuperAdmin)}
                                        />
                                        <Label htmlFor="set-as-super-admin">
                                            Set as Super Admin
                                        </Label>
                                        <Tooltip
                                            className="text-xs font-light max-w-xs shadow"
                                            content="This user will be treated as a Super Admin across the platform."
                                        >
                                            <Badge size="xs" color="gray" icon={UilInfo} />
                                        </Tooltip>
                                    </div>
                                </div>
                                {setAsSuperAdmin ? (
                                    <div className="w-full px-4">
                                        <Card className="w-full dark:shadow-md">
                                            <div className="flex flex-col w-full gap-2">
                                                <span className="text-normal flex font-bold tracking-tight text-gray-800 dark:text-white">
                                                    Super Admins can manage all users, tools, and
                                                    settings.
                                                </span>
                                                <span className="font-normal text-sm text-gray-700 dark:text-gray-400">
                                                    Users in this Permission Set can access everything
                                                    except some subscription features. They need a paid
                                                    seat for full access to Sales Hub and Service Hub.
                                                    Learn more.
                                                </span>
                                            </div>
                                        </Card>
                                        <div className="w-full flex flex-col mt-10">
                                            <h3 className="text-normal flex font-bold tracking-tight text-gray-800 dark:text-white">
                                                Enable paid features
                                            </h3>
                                            <div className="w-full mt-2 p-4 border-solid border-gray-200 border-2 rounded-md flex flex-row">
                                                <div className="flex flex-col w-4/5">
                                                    <h4 className="text-normal flex font-bold tracking-tight text-gray-800 dark:text-white mb-4">
                                                        Sales Professional
                                                    </h4>
                                                    <p className="font-medium text-sm text-gray-700 dark:text-gray-400 mb-2">
                                                        A paid sales seat gives a user access to:
                                                    </p>
                                                    <ul className="space-y-1 max-w-md list-disc list-inside text-sm text-gray-700 dark:text-gray-400">
                                                        <li>
                                                            Deal automation and lead rotation eligibility
                                                        </li>
                                                        <li>Sequence queues for personalized emails</li>
                                                        <li>Access to forecasting tools</li>
                                                    </ul>
                                                </div>
                                                <div className="flex w-1/5 flex-col items-center justify-center">
                                                    <div>
                                                        <ToggleSwitch
                                                            checked={setAsSuperAdminWithSalesPro}
                                                            label=""
                                                            disabled={saving}
                                                            onChange={() => setSetAsSuperAdminWithSalesPro(!setAsSuperAdminWithSalesPro)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <PermissionSetsSettingsTable />
                                )}
                            </div>
                            <div className="bottom-0 left-0 flex justify-end w-full bg-gray-200 dark:bg-gray-800 space-x-4 p-4 absolute">
                                <Button
                                    type="submit"
                                    color="dark"
                                    onClick={handleSaving}
                                    disabled={saving || !permissionIsValid || permissionNameError !== null}
                                    className="w-content justify-center h-full font-medium text-sm text-center"
                                >
                                    {!saving ? (
                                        id ? (
                                            "Update"
                                        ) : (
                                            "Create"
                                        )
                                    ) : (
                                        <div className="h-full">
                                            <LoadingDots color="#fff" />
                                        </div>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    color="black"
                                    disabled={saving}
                                    data-drawer-dismiss="drawer-create-permission-sets-default"
                                    aria-controls="drawer-create-permission-sets-default"
                                    onClick={handleCloseDrawer}
                                    className="inline-flex w-content justify-center items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-5 h-5 -ml-1 sm:mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        ></path>
                                    </svg>
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* overlay */}
            <div
                className="w-full h-full fixed z-30 bg-black opacity-40 top-0 left-0 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 border border-gray-200"
                onClick={saving ? () => null : handleCloseDrawer}
            ></div>
        </>
    );
}
