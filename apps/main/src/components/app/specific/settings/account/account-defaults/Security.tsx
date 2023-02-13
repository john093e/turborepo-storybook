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
  Modal,
  Checkbox,
  ToggleSwitch,
} from "flowbite-react";
import { UilInfo } from "@iconscout/react-unicons";
import Select from "@components/common/forms/select/Select";
import Loader from "@components/common/Loader";

import { usePrevious } from "@lib/hooks/use-previous";

import { fetcher } from "@lib/fetcher";
import { HttpMethod } from "@types";

import { ONG } from "@prisma/client";

interface PropForm {
  userId: string;
}
type UserSecurityLoginFormValues = {
  newLogin: string;
};
type UserSecurityActivityLogsFormValues = {
  newActivityLogs: string;
};
export default function Security({ userId }: PropForm) {
  const router = useRouter();
  //Open Modal Change Login
  const [openModalLogin, setOpenModalLogin] = useState(false);
  //Saving new Login
  const [newLoginIsValid, setNewLoginIsValid] = useState<boolean>(false);
  const [savingNewLogin, setSavingNewLogin] = useState<boolean>(false);

  const {
    register: registerNewLogin,
    reset: resetNewLogin,
    handleSubmit: handleSubmitNewLogin,
    watch: watchNewLogin,
  } = useForm<UserSecurityLoginFormValues>({
    defaultValues: {
      newLogin: "",
    },
  });

  const submitNewLogin = handleSubmitNewLogin(async (data) => {
    setSavingNewLogin(true);
    const response = await fetch("/api/settings/user/security", {
      method: HttpMethod.PUT,
      body: JSON.stringify({
        ...data,
      }),
    });

    if (response.ok) {
      setSavingNewLogin(false);
      toast.success(`Changes Saved`);
    }
  });

  useEffect(() => {
    const subscription = watchNewLogin((value, { name, type }) => {
      if (value.newLogin !== undefined) {
        if (
          /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(value.newLogin)
        ) {
          setNewLoginIsValid(true);
        } else {
          setNewLoginIsValid(false);
        }
      } else {
        setNewLoginIsValid(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watchNewLogin]);

  //Open Modal Change ActivityLogs
  const [openModalActivityLogs, setOpenModalActivityLogs] = useState(false);
  //Saving new ActivityLogs
  const [newActivityLogsIsValid, setNewActivityLogsIsValid] =
    useState<boolean>(false);
  const [savingNewActivityLogs, setSavingNewActivityLogs] =
    useState<boolean>(false);
  const {
    register: registerNewActivityLogs,
    reset: resetNewActivityLogs,
    handleSubmit: handleSubmitNewActivityLogs,
    watch: watchNewActivityLogs,
  } = useForm<UserSecurityActivityLogsFormValues>({
    defaultValues: {
      newActivityLogs: "",
    },
  });
  const submitNewActivityLogs = handleSubmitNewActivityLogs(async (data) => {
    setSavingNewActivityLogs(true);
    const response = await fetch("/api/settings/user/security", {
      method: HttpMethod.PUT,
      body: JSON.stringify({
        ...data,
      }),
    });

    if (response.ok) {
      setSavingNewActivityLogs(false);
      toast.success(`Changes Saved`);
    }
  });

  useEffect(() => {
    const subscription = watchNewActivityLogs((value, { name, type }) => {
      if (value.newActivityLogs !== undefined) {
        if (
          /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(
            value.newActivityLogs
          )
        ) {
          setNewActivityLogsIsValid(true);
        } else {
          setNewActivityLogsIsValid(false);
        }
      } else {
        setNewActivityLogsIsValid(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watchNewActivityLogs]);

  if (!userId) return <Loader />;

  return (
    <>
      <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
        These defaults will be applied to the entire account. To manage your
        personal security settings, go to{" "}
        <Link
          href={`/settings/${userId}/user-preferences/security`}
          className="font-bold text-blue-600"
        >
          security preferences
        </Link>
        .
      </p>
      <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex-row lg:flex">
        <div className="w-full lg:w-1/2">
          <div className="mt-8 flex flex-col space-y-6 max-w-md">
            {/* Login */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Login
              </h3>
              <Button
                size="sm"
                className="inlineButton"
                onClick={() => setOpenModalLogin(!openModalLogin)}
              >
                Set up single sign-on
              </Button>
              <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                When this is set up all users can log in using company
                credentials.
              </p>
              <Modal
                show={openModalLogin}
                size="lg"
                popup={true}
                onClose={() => setOpenModalLogin(!openModalLogin)}
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
                      <Label htmlFor="newLogin" value="Your actual password" />
                    </div>
                    <TextInput
                      id="newLogin"
                      required={true}
                      {...registerNewLogin("newLogin")}
                    />
                  </div>
                  {newLoginIsValid ? (
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
                      disabled={!newLoginIsValid}
                      onClick={submitNewLogin}
                      className={`${
                        savingNewLogin
                          ? "cursor-not-allowed bg-gray-300 border-gray-300"
                          : "bg-black hover:bg-white dark:disabled:bg-transparent dark:disabled:text-black dark:border-none dark:disabled:border-solid dark:hover:!bg-blue-700 dark:disabled:hover:!bg-transparent dark:hover:text-white hover:!bg-transparent dar:!hover:bg-blue-400 hover:text-black border-black"
                      } text-white border-1 focus:outline-none transition-all ease-in-out duration-150`}
                    >
                      {savingNewLogin ? (
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
                        setOpenModalLogin(!openModalLogin);
                        resetNewLogin({
                          newLogin: "",
                        });
                      }}
                    >
                      Annuler
                    </Button>
                  </Modal.Footer>
                </Modal.Body>
              </Modal>
            </div>
            {/* ActivityLogs */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Activity Logs
              </h3>
              <Button
                size="sm"
                className="inlineButton"
                onClick={() => setOpenModalActivityLogs(!openModalActivityLogs)}
              >
                View account login history
              </Button>
              <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                Inspect history of login activity in your T-WOL account from the
                last year.{" "}
              </p>
              <Modal
                show={openModalActivityLogs}
                size="lg"
                popup={true}
                onClose={() => setOpenModalActivityLogs(!openModalActivityLogs)}
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
                        htmlFor="newActivityLogs"
                        value="Your actual password"
                      />
                    </div>
                    <TextInput
                      id="newActivityLogs"
                      required={true}
                      {...registerNewActivityLogs("newActivityLogs")}
                    />
                  </div>
                  {newActivityLogsIsValid ? (
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
                      disabled={!newActivityLogsIsValid}
                      onClick={submitNewActivityLogs}
                      className={`${
                        savingNewActivityLogs
                          ? "cursor-not-allowed bg-gray-300 border-gray-300"
                          : "bg-black hover:bg-white dark:disabled:bg-transparent dark:disabled:text-black dark:border-none dark:disabled:border-solid dark:hover:!bg-blue-700 dark:disabled:hover:!bg-transparent dark:hover:text-white hover:!bg-transparent dar:!hover:bg-blue-400 hover:text-black border-black"
                      } text-white border-1 focus:outline-none transition-all ease-in-out duration-150`}
                    >
                      {savingNewActivityLogs ? (
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
                        setOpenModalActivityLogs(!openModalActivityLogs);
                        resetNewActivityLogs({
                          newActivityLogs: "",
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
                className="inlineButton"
                onClick={() => setOpenModalActivityLogs(!openModalActivityLogs)}
              >
                Export T-WOL employee access history
              </Button>
              <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                Get a report showing when T-WOL employees accessed your account
                in the last 90 days.{" "}
              </p>
              <Modal
                show={openModalActivityLogs}
                size="lg"
                popup={true}
                onClose={() => setOpenModalActivityLogs(!openModalActivityLogs)}
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
                        htmlFor="newActivityLogs"
                        value="Your actual password"
                      />
                    </div>
                    <TextInput
                      id="newActivityLogs"
                      required={true}
                      {...registerNewActivityLogs("newActivityLogs")}
                    />
                  </div>
                  {newActivityLogsIsValid ? (
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
                      disabled={!newActivityLogsIsValid}
                      onClick={submitNewActivityLogs}
                      className={`${
                        savingNewActivityLogs
                          ? "cursor-not-allowed bg-gray-300 border-gray-300"
                          : "bg-black hover:bg-white dark:disabled:bg-transparent dark:disabled:text-black dark:border-none dark:disabled:border-solid dark:hover:!bg-blue-700 dark:disabled:hover:!bg-transparent dark:hover:text-white hover:!bg-transparent dar:!hover:bg-blue-400 hover:text-black border-black"
                      } text-white border-1 focus:outline-none transition-all ease-in-out duration-150`}
                    >
                      {savingNewActivityLogs ? (
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
                        setOpenModalActivityLogs(!openModalActivityLogs);
                        resetNewActivityLogs({
                          newActivityLogs: "",
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
                className="inlineButton"
                onClick={() => setOpenModalActivityLogs(!openModalActivityLogs)}
              >
                View security activity history
              </Button>
              <p className="text-gray-800 dark:text-gray-400 text-xs mb-5">
                Review insights into notable security actions taken in your
                T-WOL account in the last year.
              </p>
              <Modal
                show={openModalActivityLogs}
                size="lg"
                popup={true}
                onClose={() => setOpenModalActivityLogs(!openModalActivityLogs)}
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
                        htmlFor="newActivityLogs"
                        value="Your actual password"
                      />
                    </div>
                    <TextInput
                      id="newActivityLogs"
                      required={true}
                      {...registerNewActivityLogs("newActivityLogs")}
                    />
                  </div>
                  {newActivityLogsIsValid ? (
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
                      disabled={!newActivityLogsIsValid}
                      onClick={submitNewActivityLogs}
                      className={`${
                        savingNewActivityLogs
                          ? "cursor-not-allowed bg-gray-300 border-gray-300"
                          : "bg-black hover:bg-white dark:disabled:bg-transparent dark:disabled:text-black dark:border-none dark:disabled:border-solid dark:hover:!bg-blue-700 dark:disabled:hover:!bg-transparent dark:hover:text-white hover:!bg-transparent dar:!hover:bg-blue-400 hover:text-black border-black"
                      } text-white border-1 focus:outline-none transition-all ease-in-out duration-150`}
                    >
                      {savingNewActivityLogs ? (
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
                        setOpenModalActivityLogs(!openModalActivityLogs);
                        resetNewActivityLogs({
                          newActivityLogs: "",
                        });
                      }}
                    >
                      Annuler
                    </Button>
                  </Modal.Footer>
                </Modal.Body>
              </Modal>
            </div>
            {/* Account Access */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Account Access
              </h3>
              <div className="flex items-center gap-2 mb-5">
                <Checkbox
                  id="allowTWOLAccess"
                  onClick={() => setOpenModalLogin(!openModalLogin)}
                />
                <Label
                  htmlFor="allowTWOLAccess"
                  className="text-gray-800 dark:text-gray-400 text-xs mb-5s"
                >
                  Allow T-WOL employees access to your account for support and
                  assistance
                </Label>
              </div>
              <Modal
                show={openModalLogin}
                size="lg"
                popup={true}
                onClose={() => setOpenModalLogin(!openModalLogin)}
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
                      <Label htmlFor="newLogin" value="Your actual password" />
                    </div>
                    <TextInput
                      id="newLogin"
                      required={true}
                      {...registerNewLogin("newLogin")}
                    />
                  </div>
                  {newLoginIsValid ? (
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
                      disabled={!newLoginIsValid}
                      onClick={submitNewLogin}
                      className={`${
                        savingNewLogin
                          ? "cursor-not-allowed bg-gray-300 border-gray-300"
                          : "bg-black hover:bg-white dark:disabled:bg-transparent dark:disabled:text-black dark:border-none dark:disabled:border-solid dark:hover:!bg-blue-700 dark:disabled:hover:!bg-transparent dark:hover:text-white hover:!bg-transparent dar:!hover:bg-blue-400 hover:text-black border-black"
                      } text-white border-1 focus:outline-none transition-all ease-in-out duration-150`}
                    >
                      {savingNewLogin ? (
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
                        setOpenModalLogin(!openModalLogin);
                        resetNewLogin({
                          newLogin: "",
                        });
                      }}
                    >
                      Annuler
                    </Button>
                  </Modal.Footer>
                </Modal.Body>
              </Modal>
            </div>
            {/* Allowed IPs */}
            <div className="w-full">
              <h3 className="block text-sm mb-2 font-medium text-gray-900 dark:text-gray-100">
                Limit Logins to Allowed IPs <Tooltip
                        className="text-xs font-light max-w-xs shadow"
                        content="An Internet Protocol (IP) address identifies a specific user device and location."
                      >
                        <Badge size="xs" color="gray" icon={UilInfo} />
                      </Tooltip>
              </h3>
              <p className="text-gray-800 dark:text-gray-400 text-xs mb-5" >
                Limit T-WOL user access to specific login locations using IP addresses or IP ranges.
              </p>
              <ToggleSwitch
                checked={false}
                label={openModalLogin? "actually activate": "actually deactivate"}
                onChange={() => setOpenModalLogin(!openModalLogin)}
              />
              <Modal
                show={openModalLogin}
                size="lg"
                popup={true}
                onClose={() => setOpenModalLogin(!openModalLogin)}
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
                      <Label htmlFor="newLogin" value="Your actual password" />
                    </div>
                    <TextInput
                      id="newLogin"
                      required={true}
                      {...registerNewLogin("newLogin")}
                    />
                  </div>
                  {newLoginIsValid ? (
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
                      disabled={!newLoginIsValid}
                      onClick={submitNewLogin}
                      className={`${
                        savingNewLogin
                          ? "cursor-not-allowed bg-gray-300 border-gray-300"
                          : "bg-black hover:bg-white dark:disabled:bg-transparent dark:disabled:text-black dark:border-none dark:disabled:border-solid dark:hover:!bg-blue-700 dark:disabled:hover:!bg-transparent dark:hover:text-white hover:!bg-transparent dar:!hover:bg-blue-400 hover:text-black border-black"
                      } text-white border-1 focus:outline-none transition-all ease-in-out duration-150`}
                    >
                      {savingNewLogin ? (
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
                        setOpenModalLogin(!openModalLogin);
                        resetNewLogin({
                          newLogin: "",
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
}
