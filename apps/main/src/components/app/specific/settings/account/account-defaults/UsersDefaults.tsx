import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useForm } from "react-hook-form";
import { SketchPicker } from "react-color";
import {
  TextInput,
  Label,
  Badge,
  Modal,
  Tooltip,
  Spinner,
  Button,
} from "flowbite-react";
import { UilInfo } from "@iconscout/react-unicons";
import Select from "@components/common/forms/select/Select";
import Loader from "@components/common/Loader";

import { usePrevious } from "@lib/hooks/use-previous";

import { fetcher } from "@lib/fetcher";
import { HttpMethod } from "@types";

import { ONG } from "@prisma/client";

interface AccountPreferences extends Pick<ONG, "account_name" | "dateFormat"> {
  language: string;
}

type AccountPreferencesFormValues = {
  account_name: string;
  dateFormat: string;
  language: string;
};

interface AccountNGOPreferences
  extends Pick<
    ONG,
    | "name_set"
    | "domain_name"
    | "address_set"
    | "address_line_2_set"
    | "address_city_set"
    | "address_state_set"
    | "address_postcode_set"
    | "address_country_set"
  > {}

const optionsLanguage = [
  { value: "de", label: "🇩🇪 Allemand" },
  { value: "en", label: "🇬🇧 Anglais" },
  { value: "es", label: "🇪🇸 Espagnol" },
  { value: "fr", label: "🇫🇷 Français" },
  { value: "it", label: "🇮🇹 Italien" },
  { value: "nl", label: "🇳🇱 Néerlandais" },
];
const optionsDate = [
  { value: "UTC+1", label: "Europe centrale" },
  { value: "UTC+2", label: "Europe de l’Est" },
  { value: "UTC", label: "Greenwich" },
  { value: "UTC+3", label: "Moscou" },
];
interface PropForm {
  userId: string;
}
type UserSecurityPassFormValues = {
  newPassword: string;
};
export default function UsersDefaults({ userId }: PropForm) {
  const router = useRouter();

  // get data for form 1
  const { data: accountSettings } = useSWR<AccountPreferences | null>(
    userId &&
      `/api/settings/account/defaults/account-defaults?userId=${userId}`,
    fetcher,
    {
      onError: () => router.push("/"),
      revalidateOnFocus: false, // on come back to page
      revalidateOnReconnect: true, // computer come out of standby (reconnect to web)
      revalidateIfStale: true, //if data stale retry
    }
  );
  // get data for form 2
  const { data: accountNGOSettings } = useSWR<AccountNGOPreferences | null>(
    userId &&
      `/api/settings/account/defaults/account-ngo-defaults?userId=${userId}`,
    fetcher,
    {
      onError: () => router.push("/"),
      revalidateOnFocus: false, // on come back to page
      revalidateOnReconnect: true, // computer come out of standby (reconnect to web)
      revalidateIfStale: true, //if data stale retry
    }
  );
  const previousAccounSettings = usePrevious({ accountSettings });
  const [saving, setSaving] = useState<boolean>(false);
  const [dataInForm1Updated, setDataInForm1Updated] = useState<boolean>(false);
  const {
    register: registerAccountPreferences,
    reset: resetAccountPreferences,
    handleSubmit: handleSubmitAccountPreferences,
    setValue: setValueAccountPreferences,
    formState: formStateAccountPreferences,
  } = useForm<AccountPreferencesFormValues>({
    defaultValues: {
      account_name: "",
      dateFormat: "",
      language: "",
    },
  });

  // Date Format
  const [date, setDate] = useState(null);
  const handleChangeDate = (value: any) => {
    setDate(value);
    setValueAccountPreferences("dateFormat", value.value, {
      shouldDirty: true,
    });
  };
  const setUserDateFormat = (value: any) => {
    const foundDateFormat: any = optionsDate.find((obj) => {
      return obj.value === value;
    });
    if (foundDateFormat !== undefined) {
      setDate(foundDateFormat);
    }
  };

  // Language
  const [language, setLanguage] = useState(null);
  const handleChangeLanguage = (value: any) => {
    setLanguage(value);
    setValueAccountPreferences("language", value.value, {
      shouldDirty: true,
    });
  };
  const setAccountLanguage = (value: any) => {
    const foundLanguage: any = optionsLanguage.find((obj) => {
      return obj.value === value;
    });
    if (foundLanguage !== undefined) {
      setLanguage(foundLanguage);
    }
  };

  //Set Data in the forms
  useEffect(() => {
    if (
      accountSettings &&
      !dataInForm1Updated &&
      previousAccounSettings?.accountSettings !== accountSettings
    ) {
      setAccountLanguage(accountSettings.language);
      setUserDateFormat(accountSettings.dateFormat);
      resetAccountPreferences({
        account_name:
          accountSettings.account_name === null
            ? ""
            : accountSettings.account_name,
        dateFormat:
          accountSettings.dateFormat === null ? "" : accountSettings.dateFormat,
        language:
          accountSettings.language === null ? "" : accountSettings.language,
      });
      setDataInForm1Updated(!dataInForm1Updated);
      return;
    }
  }, [
    accountSettings,
    previousAccounSettings,
    dataInForm1Updated,
    resetAccountPreferences,
  ]);

  const saveSettingsAccountPreferences = handleSubmitAccountPreferences(
    async (data) => {
      setSaving(true);
      const response = await fetch(
        "/api/settings/account/defaults/account-defaults",
        {
          method: HttpMethod.PUT,
          body: JSON.stringify({
            ...data,
          }),
        }
      );

      if (response.ok) {
        setSaving(false);
        toast.success(`Changes Saved`);
        mutate(
          `/api/settings/account/defaults/account-defaults?userId=${userId}`
        );
        setDataInForm1Updated(!dataInForm1Updated);
      }
    }
  );

  //Open Modal Change Password
  const [openModalPassword, setOpenModalPassword] = useState(false);
  //Saving new Password
  const [newPasswordIsValid, setNewPasswordIsValid] = useState<boolean>(false);
  const [savingNewPassword, setSavingNewPassword] = useState<boolean>(false);

  const {
    register: registerNewPassword,
    reset: resetNewPassword,
    handleSubmit: handleSubmitNewPassword,
    watch: watchNewPassword,
  } = useForm<UserSecurityPassFormValues>({
    defaultValues: {
      newPassword: "",
    },
  });

  const submitNewPassword = handleSubmitNewPassword(async (data) => {
    setSavingNewPassword(true);
    const response = await fetch("/api/settings/user/security", {
      method: HttpMethod.PUT,
      body: JSON.stringify({
        ...data,
      }),
    });

    if (response.ok) {
      setSavingNewPassword(false);
      toast.success(`Changes Saved`);
    }
  });

  useEffect(() => {
    const subscription = watchNewPassword((value, { name, type }) => {
      if (value.newPassword !== undefined) {
        if (
          /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(
            value.newPassword
          )
        ) {
          setNewPasswordIsValid(true);
        } else {
          setNewPasswordIsValid(false);
        }
      } else {
        setNewPasswordIsValid(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watchNewPassword]);

  const [hex, setHex] = useState("#fff");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  if (!accountSettings) return <Loader />;

  return (
    <>
      <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
        Set defaults for users in your account. To add or edit user permissions
        go to{" "}
        <Link
          className="font-bold text-blue-600"
          href={`/settings/${userId}/account-settings/users-and-teams`}
        >
          Users & Teams
        </Link>
        .
      </p>
      <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex-row lg:flex">
        <div className="w-full lg:w-1/2">
          <div className="my-8 flex flex-col space-y-6 max-w-md">
            <div>
              <h3 className="text-gray-800 dark:text-gray-400 text-xl font-medium mt-4">
                New user defaults
              </h3>
              <p className="text-gray-800 dark:text-gray-400 text-sm mb-4">
                Set defaults for users added to your account. They can update
                this in user preferences.
              </p>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <div className="flex gap-4">
                <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Language
                </h3>
                <Tooltip
                  className="text-xs font-light max-w-xs shadow"
                  content="Choose the default language for new users."
                >
                  <Badge size="xs" color="gray" icon={UilInfo} />
                </Tooltip>
              </div>

              <Select
                value={language}
                onChange={handleChangeLanguage}
                options={optionsLanguage}
              />
            </div>

            {/* Format date */}
            <div className="space-y-2">
              <div className="flex gap-4">
                <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Date and number format
                </h3>
                <Tooltip
                  className="text-xs font-light max-w-xs shadow"
                  content="Choose the default date and number stylings for new users."
                >
                  <Badge size="xs" color="gray" icon={UilInfo} />
                </Tooltip>
              </div>
              <Select
                value={date}
                onChange={handleChangeDate}
                options={optionsDate}
                isSearchable={true}
              />
            </div>
          </div>

          <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-600" />
          <h2 className="text-gray-800 dark:text-gray-400 text-xl font-medium mt-4">
            Notifications
          </h2>
          <p className="text-gray-800 dark:text-gray-400 text-sm">
            Set notification defaults for all users in your account. They can
            update this in user preferences.
          </p>
          <div className="my-8 flex flex-col space-y-6 max-w-md">
            {/* Manage account defaults */}
            <div className="w-full">
              <Button
                size="sm"
                className="inlineButton"
                onClick={() => setOpenModalPassword(!openModalPassword)}
              >
                Manage account defaults
              </Button>
              <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                Set up the default notifications for all users in your account
                who are not included in a profile.
              </p>
              <Modal
                show={openModalPassword}
                size="lg"
                popup={true}
                onClose={() => setOpenModalPassword(!openModalPassword)}
              >
                <Modal.Header className="text-xl font-medium text-gray-900 dark:text-white !px-6 !py-3 bg-gray-100 items-center dark:bg-gray-800">
                  Edit your password
                </Modal.Header>
                <Modal.Body className="px-6 pb-4 pt-4 sm:pt-4 sm:pb-6 lg:px-8 xl:pb-8">
                  <p className="text-gray-800 dark:text-gray-400 text-sm mt-4 mb-5">
                    You&apos;ll need to check your email to validate this new
                    password.
                  </p>
                  <div className="mt-4">
                    <div className="mb-2 block">
                      <Label
                        htmlFor="newPassword"
                        value="Your actual password"
                      />
                    </div>
                    <TextInput
                      id="newPassword"
                      required={true}
                      {...registerNewPassword("newPassword")}
                    />
                  </div>
                  {newPasswordIsValid ? (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="password" value="Your password" />
                      </div>
                      <TextInput
                        id="password"
                        type="password"
                        required={true}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <Modal.Footer className="w-full flex !p-0 mt-8">
                    <Button
                      disabled={!newPasswordIsValid}
                      onClick={submitNewPassword}
                      className={`${
                        savingNewPassword
                          ? "cursor-not-allowed bg-gray-300 border-gray-300"
                          : "bg-black hover:bg-white dark:disabled:bg-transparent dark:disabled:text-black dark:border-none dark:disabled:border-solid dark:hover:!bg-blue-700 dark:disabled:hover:!bg-transparent dark:hover:text-white hover:!bg-transparent dar:!hover:bg-blue-400 hover:text-black border-black"
                      } text-white border-1 focus:outline-none transition-all ease-in-out duration-150`}
                    >
                      {savingNewPassword ? (
                        <>
                          <div>
                            <Spinner size="sm" light={true} />
                          </div>
                        </>
                      ) : (
                        "Enregistrer"
                      )}
                    </Button>
                    <Button
                      color="gray"
                      onClick={() => {
                        setOpenModalPassword(!openModalPassword);
                        resetNewPassword({
                          newPassword: "",
                        });
                      }}
                    >
                      Annuler
                    </Button>
                  </Modal.Footer>
                </Modal.Body>
              </Modal>
            </div>
          </div>
          <div>
            <h3 className="text-gray-800 dark:text-gray-400 text-md font-medium">
              Create notification profiles by permission set
            </h3>
            <p className="text-gray-800 dark:text-gray-400 text-sm">
              Create notification profiles for each permission set. Notification
              profiles make sure users will only be notified about what&apos;s
              relevant to them.
            </p>
            <Button
              color="dark"
              onClick={() => {
                setOpenModalPassword(!openModalPassword);
                resetNewPassword({
                  newPassword: "",
                });
              }}
              className="mt-2"
            >
              Create notification profile
            </Button>
          </div>
          <div>
            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-600" />
            <h2 className="text-gray-800 dark:text-gray-400 text-xl font-medium mt-4">
              Email
            </h2>
            <p className="text-gray-800 dark:text-gray-400 text-sm">
              This default will apply to outgoing emails from the CRM email
              editor for all users of this account.
            </p>
            <div className="flex flex-row gap-2">
              <div className="w-2/5">
                <Select
                  value={date}
                  onChange={handleChangeDate}
                  options={optionsDate}
                  isSearchable={true}
                />
              </div>
              <div className="w-2/5">
                <Select
                  value={date}
                  onChange={handleChangeDate}
                  options={optionsDate}
                  isSearchable={true}
                />
              </div>
              <div className="w-1/5 flex justify-center items-center">
                <div className="relative">
                  <span
                    className="w-10 flex h-10 border-gray-400 border rounded-full border-solid relative cursor-pointer"
                    style={{ backgroundColor: hex }}
                    onClick={() => setColorPickerOpen(!colorPickerOpen)}
                  ></span>
                  {colorPickerOpen ? (
                    <div className="absolute z-2 bottom-full right-0">
                      <div
                        className="fixed top-0 right-0 bottom-0 left-0"
                        onClick={() => setColorPickerOpen(!colorPickerOpen)}
                      />
                      <SketchPicker
                        color={hex}
                        onChange={(color) => {
                          setHex(color.hex);
                        }}
                        className="bottom-0 right-0"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {Object.keys(formStateAccountPreferences.dirtyFields).length > 0 ? (
        <div className="w-full bg-white shadow-top sticky px-10 sm:px-20 h-20 border-t-2 flex justify-end items-center bottom-0 dark:border-gray-700 dark:bg-gray-800">
          <Button
            disabled={saving}
            onClick={() => {
              if (
                Object.keys(formStateAccountPreferences.dirtyFields).length > 0
              ) {
                saveSettingsAccountPreferences();
              }
            }}
            className={`${
              saving
                ? "cursor-not-allowed bg-gray-300 border-gray-300"
                : "bg-black hover:bg-white hover:text-black border-black"
            } mx-2 w-36 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
          >
            {saving ? (
              <>
                <div>
                  <Spinner size="sm" light={true} />
                </div>
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
