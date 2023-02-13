import { useRouter } from "next/router";
import { useState, useEffect, ReactElement } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useForm } from "react-hook-form";

import Layout from "@components/app/layout/Layout";
import SettingsNestedLayout from "@components/app/layout/SettingsNestedLayout";
import type { NextPageWithLayout } from "../../../../_app";
import BlurImage from "@components/BlurImage";
import CloudinaryUploadWidget from "@components/Cloudinary";
import {
  Tabs,
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


import { fetcher } from "@lib/fetcher";
import { HttpMethod } from "@types";

import { IUser } from "@types/appLoggedInContext";
import { B2E } from "@prisma/client";

interface UserPreferences
  extends Pick<
    IUser,
    "firstname" | "lastname" | "image" | "language" | "dateFormat"
  > {
  B2E: Array<B2E>;
  phone: string | null;
  phonePrefix: string | null;
}

type UserPreferencesFormValues = {
  firstname: string;
  lastname: string;
  image: string;
  language: string;
  dateFormat: string;
  defaultHomepage: string;
  phone: string;
  phonePrefix: string;
};

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
const optionsDefaultHomepage = [
  { value: "activityFeed", label: "Activity Feed" },
  { value: "ads", label: "Ads" },
  { value: "dashboards", label: "Dashboards" },
];
const optionsPhonePrefix = [
  { value: "+30", label: "🇬🇷 +30" },
  { value: "+31", label: "🇳🇱 +31" },
  { value: "+32", label: "🇧🇪 +32" },
  { value: "+33", label: "🇫🇷 +33" },
  { value: "+34", label: "🇪🇸 +34" },
  { value: "+350", label: "🇬🇮 +350" },
  { value: "+351", label: "🇵🇹 +351" },
  { value: "+352", label: "🇱🇺 +352" },
  { value: "+353", label: "🇮🇪 +353" },
  { value: "+356", label: "🇲🇹 +356" },
  { value: "+357", label: "🇨🇾 +357" },
  { value: "+358", label: "🇫🇮 +358" },
  { value: "+359", label: "🇧🇬 +359" },
  { value: "+36", label: "🇭🇺 +36" },
  { value: "+370", label: "🇱🇹 +370" },
  { value: "+371", label: "🇱🇻 +371" },
  { value: "+372", label: "🇪🇪 +372" },
  { value: "+385", label: "🇭🇷 +385" },
  { value: "+386", label: "🇸🇮 +386" },
  { value: "+39", label: "🇮🇹 +39" },
  { value: "+40", label: "🇷🇴 +40" },
  { value: "+420", label: "🇨🇿 +420" },
  { value: "+421", label: "🇸🇰 +421" },
  { value: "+423", label: "🇱🇮 +423" },
  { value: "+43", label: "🇦🇹 +43" },
  { value: "+44", label: "🇦🇹 +44" },
  { value: "+45", label: "🇩🇰 +45" },
  { value: "+46", label: "🇸🇪 +46" },
  { value: "+47", label: "🇳🇴 +47" },
  { value: "+48", label: "🇵🇱 +48" },
  { value: "+49", label: "🇩🇪 +49" },
];
const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const userId = id;

  const { data: userSettings } = useSWR<UserPreferences | null>(
    userId && `/api/settings/user/user?userId=${userId}`,
    fetcher,
    {
      onError: () => router.push("/"),
      revalidateOnFocus: false, // on come back to page
      revalidateOnReconnect: true, // computer come out of standby (reconnect to web)
      revalidateIfStale: true, //if data stale retry
    }
  );

  const [saving, setSaving] = useState<boolean>(false);
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    setValue,
    formState: { isDirty, dirtyFields },
  } = useForm<UserPreferencesFormValues>({
    defaultValues: {
      dateFormat: "",
      defaultHomepage: "",
      firstname: "",
      image: "",
      lastname: "",
      language: "",
      phone: "",
      phonePrefix: "",
    },
  });

  // Langue
  const [language, setLanguage] = useState(null);
  const handleChangeLanguage = (value: any) => {
    setLanguage(value);
    setValue("language", value.value, { shouldDirty: true });
  };
  const setUserLanguage = (value: any) => {
    const foundLanguage: any = optionsLanguage.find((obj) => {
      return obj.value === value;
    });
    if (foundLanguage !== undefined) {
      setLanguage(foundLanguage);
    }
  };

  // Date Format
  const [date, setDate] = useState(null);
  const handleChangeDate = (value: any) => {
    setDate(value);
    setValue("dateFormat", value.value, { shouldDirty: true });
  };
  const setUserDateFormat = (value: any) => {
    const foundDateFormat: any = optionsDate.find((obj) => {
      return obj.value === value;
    });
    if (foundDateFormat !== undefined) {
      setDate(foundDateFormat);
    }
  };

  // Phone Prefix
  const [phonePrefix, setPhonePrefix] = useState(null);
  const handleChangePhonePrefix = (value: any) => {
    setPhonePrefix(value);
    setValue("phonePrefix", value.value, { shouldDirty: true });
  };
  const setUserPhonePrefix = (value: any) => {
    const foundPhonePrefix: any = optionsPhonePrefix.find((obj) => {
      return obj.value === value;
    });
    if (foundPhonePrefix !== undefined) {
      setPhonePrefix(foundPhonePrefix);
    }
  };

  // Default Homepage
  const [defaultHomepage, setDefaultHomepage] = useState(null);
  const handleChangeDefaultHomepage = (value: any) => {
    setDefaultHomepage(value);
    setValue("defaultHomepage", value.value, { shouldDirty: true });
  };
  const setUserDefaultHomepage = (value: any) => {
    const found: any = optionsDefaultHomepage.find((obj) => {
      return obj.value === value;
    });
    if (found !== undefined) {
      setDefaultHomepage(found);
    }
  };

  //Set Data in the form
  useEffect(() => {
    if (
      userSettings &&
      (userSettings.dateFormat !== null ||
        userSettings.B2E !== null ||
        userSettings.firstname !== null ||
        userSettings.image !== null ||
        userSettings.lastname !== null ||
        userSettings.language !== null ||
        userSettings.phone !== null ||
        userSettings.phonePrefix !== null)
    ) {
      setUserLanguage(userSettings.language);
      setUserDateFormat(userSettings.dateFormat);
      setUserDefaultHomepage(userSettings.B2E[0].defaultHomepage);
      setUserPhonePrefix(userSettings.phonePrefix);

      reset({
        dateFormat: userSettings.dateFormat!,
        defaultHomepage: userSettings.B2E[0].defaultHomepage!,
        firstname: userSettings.firstname!,
        image: userSettings.image!,
        lastname: userSettings.lastname!,
        language: userSettings.language!,
        phone: userSettings.phone!,
        phonePrefix: userSettings.phonePrefix!,
      });
      return;
    }
  }, [userSettings, reset]);

  const saveSettings = handleSubmit(async (data) => {
    setSaving(true);
    console.log("data", data);
    
    const response = await fetch("/api/settings/user/user", {
      method: HttpMethod.PUT,
      body: JSON.stringify({
        ...data,
      }),
    });

    if (response.ok) {
      setSaving(false);
      toast.success(`Changes Saved`);
      mutate(`/api/settings/user/user?userId=${userId}`);
    }
  });

  if (!userSettings) return <Loader />;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 10000,
        }}
      />
      <div className="w-full mx-auto px-8 pt-4">
        <h1 className="font-cal text-3xl font-medium mb-4 text-gray-700 dark:text-gray-100">
          User Settings
        </h1>
        <Tabs.Group
          aria-label="User Settings Tabs"
          style="default"
          className="TabsGroup"
        >
          <Tabs.Item active={true} title="Profile">
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              These preferences only apply to you.
            </p>
            <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
            <div className="flex-row lg:flex">
              <div className="w-full lg:w-1/2">
                <h2 className="block mt-10 mb-2 text-md font-medium text-gray-900 dark:text-gray-100">
                  Global
                </h2>
                <p className="text-gray-800 dark:text-gray-400 text-sm">
                  This applies across any T-WOL accounts you have.
                </p>
                <div className="my-8 flex flex-col space-y-6 max-w-md">
                  <div>
                    <h3 className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      Profile Image
                    </h3>
                    <div
                      className={`relative mt-5 w-20 border-2 border-gray-800 dark:border-gray-400 border-dashed rounded-md`}
                    >
                      <CloudinaryUploadWidget
                        callback={(e) =>
                          {console.log("e.secure_url", e.secure_url);
                           setValue("image", e.secure_url, { shouldDirty: true });
                        }}
                      >
                        {({ open }) => (
                          <button
                            onClick={open}
                            className="absolute w-full h-full rounded-md bg-gray-200 z-10 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition-all ease-linear duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100"
                              height="100"
                              viewBox="0 0 24 24"
                            >
                              <path d="M16 16h-3v5h-2v-5h-3l4-4 4 4zm3.479-5.908c-.212-3.951-3.473-7.092-7.479-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h3.5v-2h-3.5c-1.93 0-3.5-1.57-3.5-3.5 0-2.797 2.479-3.833 4.433-3.72-.167-4.218 2.208-6.78 5.567-6.78 3.453 0 5.891 2.797 5.567 6.78 1.745-.046 4.433.751 4.433 3.72 0 1.93-1.57 3.5-3.5 3.5h-3.5v2h3.5c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408z" />
                            </svg>
                            <p className="text-gray-800 dark:text-gray-400 text-xs">
                              Upload another image
                            </p>
                          </button>
                        )}
                      </CloudinaryUploadWidget>

                      
                      <BlurImage
                        src={getValues("image") && getValues("image") !== "" ? getValues("image") : "/static/default-profile.jpg" }
                        alt="Cover Photo"
                        width={100}
                        height={100}
                        layout="responsive"
                        className="rounded-md"
                        objectFit="cover"
                      />
                      
                    </div>
                  </div>

                  {/* First Name */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="firstname" value="Prénom" />
                    </div>
                    <TextInput
                      id="firstname"
                      type="text"
                      placeholder="Ton incroyable prénom"
                      required={true}
                      {...register("firstname")}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="lastname" value="Nom de famille" />
                    </div>
                    <TextInput
                      id="lastname"
                      type="text"
                      placeholder="Ton légendaire nom de famille"
                      required={true}
                      {...register("lastname")}
                    />
                  </div>

                  {/* language */}
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Langue
                      </h3>
                      <Tooltip
                        className="text-xs font-light max-w-xs shadow"
                        content="At this time, T-WOL only offers phone support in English, German, Spanish, French, Portuguese and Japanese. Translations are available for much of our online support documentation in Spanish, German, Dutch, French, Italian, Portuguese and Japanese."
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
                        Date, time, and number format
                      </h3>
                      <Tooltip
                        className="text-xs font-light max-w-xs shadow"
                        content="Set where you go when you log in to T-WOL and can access easily through the sprocket in the main menu."
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
                    <p className="text-gray-400 dark:text-gray-400 text-xs">
                      Format: 14 novembre 2022, 14/11/2022, 00:23 CET, and 1
                      234,56
                    </p>
                  </div>

                  {/* Phone & suffix */}
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="phone" value="Numéro de téléphone" />
                      <p className="text-gray-800 dark:text-gray-400 text-sm">
                        We may use this phone number to contact you about
                        security events, sending workflow SMS, and for owner
                        property values. Please refer to our privacy policy for
                        more information (read more).
                      </p>
                    </div>
                    <div className="flex phoneInput">
                      <div className="w-2/6">
                        <Select
                          value={phonePrefix}
                          onChange={handleChangePhonePrefix}
                          options={optionsPhonePrefix}
                          isSearchable={true}
                          placeholder="Prefix"
                        />
                      </div>
                      <div className="w-4/6">
                        <TextInput
                          id="phone"
                          type="text"
                          placeholder="un 04 ?"
                          required={true}
                          {...register("phone")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-800 sm:hidden" />
                <h2 className="block mt-10 mb-2 text-md font-medium text-gray-900 dark:text-gray-100">
                  Default
                </h2>
                <p className="text-gray-800 dark:text-gray-400 text-sm">
                  This only applies to this T-WOL account.
                </p>
                <div className="my-8 flex flex-col space-y-6 max-w-md">
                  {/* Format date */}
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Default Home Page
                      </h3>
                      <Tooltip
                        className="text-xs font-light max-w-xs shadow"
                        content="Set where you go when you log in to T-WOL and can access easily through the sprocket in the main menu."
                      >
                        <Badge size="xs" color="gray" icon={UilInfo} />
                      </Tooltip>
                    </div>
                    <Select
                      value={defaultHomepage}
                      onChange={handleChangeDefaultHomepage}
                      options={optionsDefaultHomepage}
                      placeholder="Pick a default home page"
                      isSearchable={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            {Object.keys(dirtyFields).length > 0 ? (
              <div className="w-full bg-white shadow-top sticky px-10 sm:px-20 h-20 border-t-2 flex justify-end items-center bottom-0 dark:border-gray-700 dark:bg-gray-800">
                <Button
                  disabled={saving}
                  onClick={() => {
                    saveSettings();
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
          </Tabs.Item>
          <Tabs.Item title="Email">Email</Tabs.Item>
          <Tabs.Item title="Calling">Calling</Tabs.Item>
          <Tabs.Item title="Calendar">Calendar</Tabs.Item>
          <Tabs.Item title="Tasks">Tasks</Tabs.Item>
        </Tabs.Group>
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <SettingsNestedLayout>{page}</SettingsNestedLayout>
    </Layout>
  );
};

export default Page;

// Workaround to fetch router query
export async function getServerSideProps() {
  return {
    props: {},
  };
}
