import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useForm } from "react-hook-form";

import {
  TextInput,
  Label,
  Badge,
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

interface AccountPreferences
  extends Pick<ONG, "account_name" | "dateFormat" | "fiscalYear"> {}

type AccountPreferencesFormValues = {
  account_name: string;
  dateFormat: string;
  fiscalYear: string;
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

type AccountNGOPreferencesFormValues = {
  name_set: string;
  domain_name: string;
  address_set: string;
  address_line_2_set: string;
  address_city_set: string;
  address_state_set: string;
  address_postcode_set: number | null;
  address_country_set: string;
};

const optionsFiscalYear = [
  { value: "JANUARY", label: "Janvier - Décembre" },
  { value: "FEBRUARY", label: "Février - Janvier" },
  { value: "MARCH", label: "Mars - Février" },
  { value: "APRIL", label: "Avril - Mars" },
  { value: "MAY", label: "Mai - Avril" },
  { value: "JUNE", label: "Juin - Mai" },
  { value: "JULY", label: "Juillet - Juin" },
  { value: "AUGUST", label: "Aout - Juillet" },
  { value: "SEPTEMBER", label: "Septembre - Aout" },
  { value: "OCTOBER", label: "Octobre - Septembre" },
  { value: "NOVEMBER", label: "Novembre - Octobre" },
  { value: "DECEMBER", label: "Décembre - Novembre" },
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
export default function Defaults( {userId}:PropForm ) {

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
  const previousAccounNGOSettings = usePrevious({ accountNGOSettings });
  const [saving, setSaving] = useState<boolean>(false);
  const [dataInForm1Updated, setDataInForm1Updated] = useState<boolean>(false);
  const [dataInForm2Updated, setDataInForm2Updated] = useState<boolean>(false);
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
      fiscalYear: "",
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

  // FiscalYear
  const [fiscalYear, setFiscalYear] = useState(null);
  const handleChangeFiscalYear = (value: any) => {
    setFiscalYear(value);
    setValueAccountPreferences("fiscalYear", value.value, {
      shouldDirty: true,
    });
  };
  const setAccountFiscalYear = (value: any) => {
    const foundFiscalYear: any = optionsFiscalYear.find((obj) => {
      return obj.value === value;
    });
    if (foundFiscalYear !== undefined) {
      setFiscalYear(foundFiscalYear);
    }
  };

  //Set Data in the forms
  useEffect(() => {
    if (
      accountSettings &&
      !dataInForm1Updated &&
      previousAccounSettings?.accountSettings !== accountSettings
    ) {
      setAccountFiscalYear(accountSettings.fiscalYear);
      setUserDateFormat(accountSettings.dateFormat);
      resetAccountPreferences({
        account_name:
          accountSettings.account_name === null
            ? ""
            : accountSettings.account_name,
        dateFormat:
          accountSettings.dateFormat === null ? "" : accountSettings.dateFormat,
        fiscalYear:
          accountSettings.fiscalYear === null ? "" : accountSettings.fiscalYear,
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

  //FOrm 2
  const {
    register: registerAccountNGOPreferences,
    reset: resetAccountNGOPreferences,
    handleSubmit: handleSubmitAccountNGOPreferences,
    formState: formStateAccountNGOPreferences,
  } = useForm<AccountNGOPreferencesFormValues>({
    defaultValues: {
      address_set: "",
      address_line_2_set: "",
      address_city_set: "",
      address_state_set: "",
      address_postcode_set: null,
      address_country_set: "",
      name_set: "",
      domain_name: "",
    },
  });

  //Set Data in the forms
  useEffect(() => {
    if (
      accountNGOSettings &&
      !dataInForm2Updated &&
      previousAccounNGOSettings?.accountNGOSettings !== accountNGOSettings
    ) {
      resetAccountNGOPreferences({
        address_set:
          accountNGOSettings.address_set === null
            ? ""
            : accountNGOSettings.address_set,
        address_line_2_set:
          accountNGOSettings.address_line_2_set === null
            ? ""
            : accountNGOSettings.address_line_2_set,
        address_city_set:
          accountNGOSettings.address_city_set === null
            ? ""
            : accountNGOSettings.address_city_set,
        address_state_set:
          accountNGOSettings.address_state_set === null
            ? ""
            : accountNGOSettings.address_state_set,
        address_postcode_set:
          accountNGOSettings.address_postcode_set === null
            ? null
            : accountNGOSettings.address_postcode_set,
        address_country_set:
          accountNGOSettings.address_country_set === null
            ? ""
            : accountNGOSettings.address_country_set,
        name_set:
          accountNGOSettings.name_set === null
            ? ""
            : accountNGOSettings.name_set,
        domain_name:
          accountNGOSettings.domain_name === null
            ? ""
            : accountNGOSettings.domain_name,
      });
      setDataInForm2Updated(!dataInForm2Updated);
      return;
    }
  }, [
    accountNGOSettings,
    previousAccounNGOSettings,
    dataInForm2Updated,
    resetAccountNGOPreferences,
  ]);

  const saveSettingsAccountNGOPreferences = handleSubmitAccountNGOPreferences(
    async (data) => {
      setSaving(true);
      const response = await fetch(
        "/api/settings/account/defaults/account-ngo-defaults",
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
          `/api/settings/account/defaults/account-ngo-defaults?userId=${userId}`
        );
        setDataInForm2Updated(!dataInForm2Updated);
      }
    }
  );

  if (!accountSettings) return <Loader />;

  return (<>
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              These defaults will be applied to the entire account.
            </p>
            <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
            <div className="flex-row lg:flex">
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col space-y-6 max-w-md">
                  {/* Account Name */}
                  <div>
                    <div className="mb-2 block">
                      <div className="flex gap-4">
                        <Label htmlFor="account_name" value="Account name" />
                        <Tooltip
                          className="text-xs font-light max-w-xs shadow"
                          content="Set a name for your account. For example, you could enter your company name or domain."
                        >
                          <Badge size="xs" color="gray" icon={UilInfo} />
                        </Tooltip>
                      </div>
                    </div>
                    <TextInput
                      id="account_name"
                      type="text"
                      placeholder="Le nom du compte"
                      required={true}
                      {...registerAccountPreferences("account_name")}
                    />
                  </div>

                  {/* Format date */}
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Time zone
                      </h3>
                      <Tooltip
                        className="text-xs font-light max-w-xs shadow"
                        content="Setting your timezone in T-WOL helps you localize several of your tools, such as scheduled email sends, scheduled social media messages, and web analytics and reporting to your company's location and time zone."
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

                  {/* Fiscal Year */}
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Fiscal year
                      </h3>
                      <Tooltip
                        className="text-xs font-light max-w-xs shadow"
                        content="Setting your fiscal year helps you model your business in T-WOL tools, such as workflows and lists."
                      >
                        <Badge size="xs" color="gray" icon={UilInfo} />
                      </Tooltip>
                    </div>

                    <Select
                      value={fiscalYear}
                      onChange={handleChangeFiscalYear}
                      options={optionsFiscalYear}
                    />
                  </div>
                </div>

                <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-600" />
                <h2 className="block mt-10 mb-2 text-xl font-medium text-gray-900 dark:text-gray-100">
                  NGO Information
                </h2>
                <p className="text-gray-800 dark:text-gray-400 text-sm">
                  This information will be used as a default where needed. If
                  you’re looking to update your company information for billing,
                  visit{" "}
                  <Link href="#" className="text-blue-600 font-bold">
                    Account & Billing
                  </Link>
                  .
                </p>
                <div className="flex flex-col space-y-6 max-w-md">
                  {/* ONG Name */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="name_set" value="Charity name" />
                    </div>
                    <TextInput
                      id="name_set"
                      type="text"
                      placeholder="Ton légendaire nom de famille"
                      required={true}
                      {...registerAccountNGOPreferences("name_set")}
                    />
                  </div>

                  {/* ONG Domain */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="domain_name" value="Charity domain" />
                    </div>
                    <TextInput
                      id="domain_name"
                      type="text"
                      placeholder="Ton nom de domaine"
                      required={true}
                      {...registerAccountNGOPreferences("domain_name")}
                    />
                  </div>

                  {/* ONG Adress */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="address_set" value="Charity address" />
                    </div>
                    <TextInput
                      id="address_set"
                      type="text"
                      placeholder="L'adresse de tes bureaux"
                      required={true}
                      {...registerAccountNGOPreferences("address_set")}
                    />
                  </div>

                  {/* ONG Adress Line 2*/}
                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="address_line_2_set"
                        value="Charity address line 2"
                      />
                    </div>
                    <TextInput
                      id="address_line_2_set"
                      type="text"
                      placeholder="Adresse ligne 2"
                      required={true}
                      {...registerAccountNGOPreferences("address_line_2_set")}
                    />
                  </div>

                  {/* ONG City*/}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="address_city_set" value="City" />
                    </div>
                    <TextInput
                      id="address_city_set"
                      type="text"
                      placeholder="La ville où se situe tes bureaux"
                      required={true}
                      {...registerAccountNGOPreferences("address_city_set")}
                    />
                  </div>

                  {/* ONG State*/}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="address_state_set" value="State" />
                    </div>
                    <TextInput
                      id="address_state_set"
                      type="text"
                      placeholder="La région où se situe tes bureaux"
                      required={true}
                      {...registerAccountNGOPreferences("address_state_set")}
                    />
                  </div>

                  {/* ONG Zip*/}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="address_postcode_set" value="Zip" />
                    </div>
                    <TextInput
                      id="address_postcode_set"
                      type="text"
                      placeholder="Le code postal de tes bureaux"
                      required={true}
                      {...registerAccountNGOPreferences("address_postcode_set")}
                    />
                  </div>

                  {/* ONG Country*/}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="address_country_set" value="Country" />
                    </div>
                    <TextInput
                      id="address_country_set"
                      type="text"
                      placeholder="Le pays de tes bureaux"
                      required={true}
                      {...registerAccountNGOPreferences("address_country_set")}
                    />
                  </div>
                </div>
              </div>
            </div>
            {Object.keys(formStateAccountPreferences.dirtyFields).length > 0 ||
            Object.keys(formStateAccountNGOPreferences.dirtyFields).length >
              0 ? (
              <div className="w-full bg-white shadow-top sticky px-10 sm:px-20 h-20 border-t-2 flex justify-end items-center bottom-0 dark:border-gray-700 dark:bg-gray-800">
                <Button
                  disabled={saving}
                  onClick={() => {
                    if (
                      Object.keys(formStateAccountPreferences.dirtyFields)
                        .length > 0
                    ) {
                      saveSettingsAccountPreferences();
                    }
                    if (
                      Object.keys(formStateAccountNGOPreferences.dirtyFields)
                        .length > 0
                    ) {
                      saveSettingsAccountNGOPreferences();
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
};