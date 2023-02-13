import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useState, useEffect, ReactElement } from "react";

import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

import Layout from "@components/app/layout/Layout";
import SettingsNestedLayout from "@components/app/layout/SettingsNestedLayout";
import type { NextPageWithLayout } from "../../../../_app";

import { Button, Modal, Label, Spinner, TextInput } from "flowbite-react";
import Loader from "@components/common/Loader";

import { AppLoggedInContext } from "@contexts/AppLoggedInContext";
import { AppLoggedInContextType } from "@types/appLoggedInContext";

import { HttpMethod } from "@types";

type UserSecurityEmailFormValues = {
  newEmail: string;
};
type UserSecurityPassFormValues = {
  newPassword: string;
};

const Page: NextPageWithLayout = () => {
  //Get Context
  const { user } = useContext(AppLoggedInContext) as AppLoggedInContextType;
  //Get User Id in Path
  const router = useRouter();
  const { id } = router.query;
  const userId = id;
  //Open Modal Change Email
  const [openModalEmail, setOpenModalEmail] = useState(false);
  //Saving new Email
  const [newEmailIsValid, setNewEmailIsValid] = useState<boolean>(false);
  const [savingNewEmail, setSavingNewEmail] = useState<boolean>(false);
  //Open Modal Change Password
  const [openModalPassword, setOpenModalPassword] = useState(false);
  //Saving new Password
  const [newPasswordIsValid, setNewPasswordIsValid] = useState<boolean>(false);
  const [savingNewPassword, setSavingNewPassword] = useState<boolean>(false);

  const {
    register: registerNewEmail,
    reset: resetNewEmail,
    handleSubmit: handleSubmitNewEmail,
    watch: watchNewEmail,
  } = useForm<UserSecurityEmailFormValues>({
    defaultValues: {
      newEmail: "",
    },
  });

  const submitNewEmail = handleSubmitNewEmail(async (data) => {
    setSavingNewEmail(true);
    const response = await fetch("/api/settings/user/security", {
      method: HttpMethod.PUT,
      body: JSON.stringify({
        ...data,
      }),
    });

    if (response.ok) {
      setSavingNewEmail(false);
      toast.success(`Changes Saved`);
    }
  });

  useEffect(() => {
    const subscription = watchNewEmail((value, { name, type }) => {
      if (value.newEmail !== undefined) {
        if (
          /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(value.newEmail)
        ) {
          setNewEmailIsValid(true);
        } else {
          setNewEmailIsValid(false);
        }
      } else {
        setNewEmailIsValid(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watchNewEmail]);

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

  if (user.email === null) return <Loader />;

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
          Security
        </h1>
        <p className="text-gray-800 dark:text-gray-400 text-sm mt-4">
          These preferences will only be applied to you. For account security
          settings please go to{" "}
          <Link
            className="font-bold text-blue-600"
            href={`/settings/${user.userId}/account-settings/account-defaults`}
          >
            account settings
          </Link>
          .
        </p>
        <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="flex-row lg:flex">
          <div className="my-8 flex flex-col space-y-10 w-full max-w-md">
            {/* New Email */}
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email address" />
              </div>
              <TextInput
                id="email"
                type="email"
                disabled
                className="w-full"
                required={true}
                value={user.email}
              />
              <Button
                size="sm"
                className="mt-2 bg-black hover:bg-white dark:disabled:bg-transparent dark:disabled:text-black dark:border-none dark:hover:!bg-blue-700 dark:hover:text-white hover:!bg-transparent dar:!hover:bg-blue-400 hover:text-black border-black"
                onClick={() => setOpenModalEmail(!openModalEmail)}
              >
                Modifier
              </Button>
              <Modal
                show={openModalEmail}
                size="lg"
                popup={true}
                onClose={() => setOpenModalEmail(!openModalEmail)}
              >
                <Modal.Header className="text-xl font-medium text-gray-900 dark:text-white !px-6 !py-3 bg-gray-100 items-center dark:bg-gray-800">
                  Edit your email address
                </Modal.Header>
                <Modal.Body className="px-6 pb-4 pt-4 sm:pt-4 sm:pb-6 lg:px-8 xl:pb-8">
                  <p className="text-gray-800 dark:text-gray-400 text-sm mt-4 mb-5">
                    You&apos;ll need to check your email and validate this new
                    address.
                  </p>
                  <div className="mt-4">
                    <div className="mb-2 block">
                      <Label htmlFor="newEmail" value="Email address" />
                    </div>
                    <TextInput
                      id="newEmail"
                      required={true}
                      {...registerNewEmail("newEmail")}
                    />
                  </div>
                  {newEmailIsValid ? (
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
                      disabled={!newEmailIsValid}
                      onClick={submitNewEmail}
                      className={`${
                        savingNewEmail
                          ? "cursor-not-allowed bg-gray-300 border-gray-300"
                          : "bg-black hover:bg-white dark:disabled:bg-transparent dark:disabled:text-black dark:border-none dark:disabled:border-solid dark:hover:!bg-blue-700 dark:disabled:hover:!bg-transparent dark:hover:text-white hover:!bg-transparent dar:!hover:bg-blue-400 hover:text-black border-black"
                      } text-white border-1 focus:outline-none transition-all ease-in-out duration-150`}
                    >
                      {savingNewEmail ? (
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
                        setOpenModalEmail(!openModalEmail);
                        resetNewEmail({
                          newEmail: "",
                        });
                      }}
                    >
                      Annuler
                    </Button>
                  </Modal.Footer>
                </Modal.Body>
              </Modal>
            </div>

            {/* Password */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Password
              </h3>
              <Button
                size="sm"
                className="inlineButton"
                onClick={() => setOpenModalPassword(!openModalPassword)}
              >
                Reset password
              </Button>
              <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                Last reset on : TODO
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

            {/* Trusted Phone Number */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Trusted Phone Number
              </h3>
              <p className="text-gray-800 dark:text-gray-400 text-sm mt-4">
                TODO PHONE NUMBER
              </p>
              <Button
                size="sm"
                className="inlineButton"
                onClick={() => setOpenModalPassword(!openModalPassword)}
              >
                Change trusted phone number
              </Button>
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

              <Button
                size="sm"
                className="inlineButton !block mt-2"
                onClick={() => setOpenModalPassword(!openModalPassword)}
              >
                Delete trusted phone number
              </Button>
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

            {/* Two-factor authentication */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Two-factor authentication
              </h3>
              <div>
                <Button
                  size="sm"
                  className="inlineButton"
                  onClick={() => setOpenModalPassword(!openModalPassword)}
                >
                  Remove SMS
                </Button>
                <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                  Primary method
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


              <div>
                <Button
                  size="sm"
                  className="inlineButton"
                  onClick={() => setOpenModalPassword(!openModalPassword)}
                >
                  Set up secondary method
                </Button>
                <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                  Secondary method
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

              <div>
                <Button
                  size="sm"
                  className="inlineButton"
                  onClick={() => setOpenModalPassword(!openModalPassword)}
                >
                  View backup codes
                </Button>
                <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                  10 codes remaining
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

            {/* Session Reset */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Session Reset
              </h3>
              <Button
                size="sm"
                className="inlineButton"
                onClick={() => setOpenModalPassword(!openModalPassword)}
              >
                Log Out of All Sessions
              </Button>
              <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                This will log you out of all devices and sessions, including this active one.
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

            {/* Remove from this account */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Remove from this account
              </h3>
              <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                This action will remove your user from this account. If you&apos;re part of other accounts, you&apos;ll still have access to them.
              </p>
              <Button
                size="sm"
                outline={true}
                gradientDuoTone="pinkToOrange"
                onClick={() => setOpenModalPassword(!openModalPassword)}
              >
                Remove me from this account
              </Button>
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



            {/* Permanently Remove */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Permanently Remove
              </h3>
              <Button
                size="sm"
                outline={true}
                gradientDuoTone="pinkToOrange"
                onClick={() => setOpenModalPassword(!openModalPassword)}
              >
                Delete my user account
              </Button>
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
        </div>
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
