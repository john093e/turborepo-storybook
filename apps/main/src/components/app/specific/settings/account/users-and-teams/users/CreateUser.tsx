import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Select from "@components/common/forms/select/Select";
import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  Label,
  Radio,
  Timeline,
  TextInput,
  Tooltip,
} from "flowbite-react";

import {
  UilAt,
  UilCheck,
  UilInfo,
  UilLinkAlt,
  UilMessage,
  UilPadlock,
} from "@iconscout/react-unicons";

import useSWR, { mutate } from "swr";
import { fetcher } from "@lib/fetcher";
import { HttpMethod } from "@types";

type NewUserFormValues = {
  email: string;
};
type NewUserAddedFormValues = {
  id?: string;
  email: string;
  link: string;
};
interface PropForm {
  userId: string;
  closeProcess: () => void;
  finishProcess: () => void;
}
export default function CreateUser({
  userId,
  closeProcess,
  finishProcess,
}: PropForm) {
  const router = useRouter();

  const [createUserStep, setCreateUserStep] = useState<number>(1);
  const [displayFormOne, setDisplayFormOne] = useState<boolean>(true);
  const [displayFormTwo, setDisplayFormTwo] = useState<boolean>(false);
  const [displayFormThree, setDisplayFormThree] = useState<boolean>(false);
  const [displayFormFour, setDisplayFormFour] = useState<boolean>(false);
  const [savingNewUser, setSavingNewUser] = useState<boolean>(false);
  // Form
  const {
    register: registerNewUser,
    reset: resetNewUser,
    handleSubmit: handleSubmitNewUser,
    setValue: setValueNewUser,
    formState: formStateNewUser,
    watch: watchNewUser,
  } = useForm<NewUserFormValues>({
    defaultValues: {
      email: "",
    },
  });

  // Step 1 Email
  const [newUserEmailItems, setNewUserEmailItems] = useState<Array<string>>([]);
  const [newUserEmailValue, setNewUserEmailValue] = useState("");
  const [newUserEmailError, setNewUserEmailError] = useState<string | null>(
    null
  );
  const [newUserEmailIsValid, setNewUserEmailIsValid] =
    useState<boolean>(false);

  const handleKeyDown = (evt: any) => {
    if (["Enter", "Tab", ",", " "].includes(evt.key)) {
      evt.preventDefault();
      var value = newUserEmailValue.trim();

      if (value && isValid(value)) {
        setNewUserEmailItems([...newUserEmailItems, value]);
        setNewUserEmailValue("");
        setNewUserEmailIsValid(true);
      }
    }
  };

  const handleChange = (evt: any) => {
    setNewUserEmailValue(evt.target.value);
    setNewUserEmailError(null);
    if (
      evt.target.value &&
      !isInList(evt.target.value) &&
      isEmail(evt.target.value)
    ) {
      setNewUserEmailIsValid(true);
    } else {
      if (newUserEmailItems.length > 0 && evt.target.value.length === 0) {
        setNewUserEmailIsValid(true);
      } else {
        if (isInList(evt.target.value)) {
          setNewUserEmailError(`${evt.target.value} has already been added.`);
        }

        setNewUserEmailIsValid(false);
      }
    }
  };

  const handleDelete = (item: string) => {
    setNewUserEmailItems(newUserEmailItems.filter((i) => i !== item));
    setNewUserEmailValue("");
    let arraySize = newUserEmailItems.filter((i) => i !== item);
    if (arraySize.length === 0) {
      setNewUserEmailIsValid(false);
      setDisplayFormThree(false);
      setDisplayFormTwo(false);
      setDisplayFormOne(true);
      setCreateUserStep(1);
      setRadioPermission("");
    }
  };

  const handlePaste = (evt: any) => {
    evt.preventDefault();

    var paste = evt.clipboardData.getData("text");
    var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

    if (emails) {
      var toBeAdded = emails.filter((email: string) => !isInList(email));
      setNewUserEmailItems([...newUserEmailItems, ...toBeAdded]);
      setNewUserEmailValue("");
      setNewUserEmailIsValid(true);
    }
  };

  const isValid = (email: string) => {
    let error = null;
    if (isInList(email)) {
      error = `${email} has already been added.`;
    }

    if (!isEmail(email)) {
      error = `${email} is not a valid email address.`;
    }

    if (error) {
      setNewUserEmailError(error);
      return false;
    }

    return true;
  };

  const isInList = (email: string) => {
    return newUserEmailItems.includes(email);
  };

  const isEmail = (email: string) => {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  };

  // Step 2
  const [radioPermission, setRadioPermission] = useState("");

  function handleClickOnRadioPermission(event: any) {
    if (event.target.value === radioPermission) {
      setRadioPermission("");
    } else {
      setRadioPermission(event.target.value);
    }
  }

  //Step 4 confirmation + link
  const [newUserEmailItemsResponse, setNewUserEmailItemsResponse] = useState<
    Array<NewUserAddedFormValues>
  >([]);



  // Button next & Step 3
  const handleNextStep = async () => {
    if (createUserStep === 1 && newUserEmailIsValid) {
      if (newUserEmailValue !== "") {
        var value = newUserEmailValue.trim();
        if (value && isValid(value)) {
          setNewUserEmailItems([...newUserEmailItems, value]);
          setNewUserEmailValue("");
          setNewUserEmailIsValid(true);
        }
      }
      setDisplayFormTwo(true);
      setCreateUserStep(2);
      await new Promise((r) => setTimeout(r, 1000));
      setDisplayFormOne(false);
    }
    if (createUserStep === 2 && radioPermission !== "") {
      setDisplayFormThree(true);
      setCreateUserStep(3);
      await new Promise((r) => setTimeout(r, 1000));
      setDisplayFormTwo(false);
    }
    if (createUserStep === 3 && radioPermission !== "" && newUserEmailIsValid) {
      //set user function
      setSavingNewUser(true);
      const response = await fetch(
        "/api/settings/account/users-and-teams/users",
        {
          method: HttpMethod.POST,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            emails: newUserEmailItems,
            //need to add permission
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setNewUserEmailItemsResponse(data);
        setSavingNewUser(false);
        setDisplayFormFour(true);
        setCreateUserStep(4);
        await new Promise((r) => setTimeout(r, 1000));
        setDisplayFormThree(false);
      }else{
        //error
      }
    }
    if (createUserStep === 4) {
      //send extra users settings to server
      if(team){
        setSavingNewUser(true);
        let emailsAndIdToSend:string[] = [];
        newUserEmailItemsResponse.map(newUserEmailItem => {
          emailsAndIdToSend.push(newUserEmailItem.id!);
        });
        const response = await fetch(
          "/api/settings/account/users-and-teams/users-extra",
          {
            method: HttpMethod.POST,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              emails: emailsAndIdToSend,
              team: team,
              //need to add savve this custom permission 
              // need to add presets
            }),
          }
        );
        if (response.ok) {
          setSavingNewUser(false);
          finishProcess();
        }else{
          // error
        }
      }else{
        // if no extra users settings directly finish the process        
        finishProcess();
      }
    }
  };

  // Button Previous
  const handlePreviousStep = async () => {
    if (createUserStep === 1) {
    }
    if (createUserStep === 2) {
      setDisplayFormOne(true);
      await new Promise((r) => setTimeout(r, 50));
      setCreateUserStep(1);
      await new Promise((r) => setTimeout(r, 950));
      setDisplayFormTwo(false);
    }
    if (createUserStep === 3) {
      setDisplayFormTwo(true);
      await new Promise((r) => setTimeout(r, 50));
      setCreateUserStep(2);
      await new Promise((r) => setTimeout(r, 950));
      setDisplayFormThree(false);
    }
  };

  //copy link
  const [clickCopyLinkTrigger, setClickCopyLinkTrigger] = useState(false);

  const onClickCopyLink = (linkCopied: string) => {
    navigator.clipboard.writeText(linkCopied);
    setClickCopyLinkTrigger(true);
    setTimeout(() => {
      setClickCopyLinkTrigger(false);
    }, 2000);
  };


  // step 4 set Teams
  // Get data for Form
  const [optionsTeams, setOptionsTeams] = useState<Array<{ value: string; label: string, disabled?: boolean }>>([]);

  const [team, setTeam] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const handleChangeTeam = (value: any) => {
    if (value) {
      setTeam(value);
    } else {
      setTeam(null)
    }
  };

  const { data: teamsList } = useSWR<{ teams: { id: string; name: string }[]; } | null>(
    userId &&
    `/api/settings/account/users-and-teams/teams-drawer?userId=${userId}`,
    fetcher,
    {
      onError: () => router.push("/"),
      revalidateOnFocus: false, // on come back to page
      revalidateOnReconnect: true, // computer come out of standby (reconnect to web)
      revalidateIfStale: true, //if data stale retry
      revalidateOnMount: true,
      onSuccess: (data) => {
        if (data) {
          if (
            optionsTeams.length === 0
          ) {
            // Team list
            let optionsTeamsArray: Array<{
              value: string;
              label: string;
              disabled?: boolean;
            }> = [];
            data.teams.forEach((team) => {
              optionsTeamsArray.push({
                value: team.id,
                label: team.name,
              });
              setOptionsTeams(optionsTeamsArray);
            });
          }
        }
      },
    }
  );


  return (
    <div className="fixed w-full h-full top-0 left-0 z-30 bg-white dark:bg-gray-800 flex flex-col">
      {/* header & steps */}
      <div className="flex flex-row items-center gap-4 p-6">
        <span className="text-gray-800 dark:text-gray-400 text-sm">
          Create users
        </span>
        <div className="items-start justify-between inline-flex grow shrink flex-wrap ml-2 mt-2">
          <Timeline
            horizontal={true}
            className="w-full inline-flex grow shrink flex-wrap customTimeline"
          >
            <Timeline.Item
              className={
                "items-center flex-col justify-center flex grow shrink" +
                (createUserStep === 1 ? " active" : "") +
                (createUserStep > 1 ? " complete" : "")
              }
            >
              <Timeline.Point
                icon={createUserStep === 1 ? UilAt : UilCheck}
                className="relative"
              />
              <Timeline.Content className="uppercase break-word !p-0">
                <Timeline.Title className="!text-xs font-normal">
                  Email
                </Timeline.Title>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item
              className={
                "items-center flex-col justify-center flex grow shrink" +
                (createUserStep === 2 ? " active" : "") +
                (createUserStep > 2 ? " complete" : "")
              }
            >
              <Timeline.Point
                icon={createUserStep >= 3 ? UilCheck : UilPadlock}
                className="relative"
              />
              <Timeline.Content className="uppercase break-word !p-0">
                <Timeline.Title className="!text-xs font-normal">
                  Permission
                </Timeline.Title>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item
              className={
                "items-center flex-col justify-center flex grow shrink" +
                (createUserStep === 3 ? " active" : "") +
                (createUserStep > 3 ? " complete" : "")
              }
            >
              <Timeline.Point
                icon={createUserStep === 4 ? UilCheck : UilMessage}
                className="relative"
              />
              <Timeline.Content className="uppercase break-word !p-0">
                <Timeline.Title className="!text-xs font-normal">
                  Invite
                </Timeline.Title>
              </Timeline.Content>
            </Timeline.Item>
          </Timeline>
        </div>
        <span className="text-gray-800 dark:text-gray-400 text-sm">
          {createUserStep &&
            createUserStep < 4 &&
            `Step ${createUserStep} of 3`}
        </span>
      </div>
      {/* body */}
      <div className="block min-h-100 py-6 w-full h-full relative overflow-hidden">
        <div className="w-screen mx-auto bg-white min-w-0 dark:bg-slate-800 h-full">
          <div className="overflow-hidden flex h-full">
            {/* Step 1 */}
            <div
              className={
                "flex-none w-screen py-6 px-3 first:pl-3 last:pr-6 left-0 transform translate-x-0 transition-all duration-700 ease-in-out ml-0" +
                (createUserStep === 2 ? " ml-[-100vw]" : "") +
                (!displayFormOne ? " hidden" : "")
              }
            >
              <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
                <div className="flex grow shrink flex-col justify-center items-center w-full max-w-md">
                  <h2 className="text-gray-800 dark:text-white text-xl font-medium mt-4">
                    Create new users, one at a time.
                  </h2>
                  <p className="text-gray-800 dark:text-gray-400 text-sm mb-4">
                    Add a new user to your T-WOL account with an email address.
                  </p>
                  {newUserEmailItems.map((item) => (
                    <Badge key={item} size="xs" color="gray">
                      <span className="inline-flex gap-2 font-normal p-1">
                        {item}
                        <button
                          type="button"
                          className="button"
                          onClick={() => handleDelete(item)}
                        >
                          &times;
                        </button>
                      </span>
                    </Badge>
                  ))}
                  <div className="mt-4 w-full">
                    <div className="mb-2 flex gap-2 items-center">
                      <Label htmlFor="email" value="Add email address" />
                      <Tooltip
                        className="text-xs font-light max-w-xs shadow"
                        content={
                          <div className="!leading-6 flex flex-col">
                            <b className="font-medium text-sm">
                              Adding more than one user?
                            </b>
                            <p className="my-2">
                              Press{" "}
                              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                                Enter
                              </kbd>{" "}
                              or{" "}
                              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                                Tab
                              </kbd>{" "}
                              after each email address or separate each email
                              address with a{" "}
                              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                                ,
                              </kbd>{" "}
                              .
                            </p>
                          </div>
                        }
                      >
                        <Badge size="xs" color="gray" icon={UilInfo} />
                      </Tooltip>
                    </div>
                    <TextInput
                      id="email"
                      required={true}
                      {...registerNewUser("email")}
                      className={"input " + (newUserEmailError && " has-error")}
                      value={newUserEmailValue}
                      placeholder="Type or paste email addresses and press `Enter`..."
                      onKeyDown={handleKeyDown}
                      onChange={handleChange}
                      onPaste={handlePaste}
                    />
                    {newUserEmailError && (
                      <p className="error">{newUserEmailError}</p>
                    )}
                  </div>
                </div>
                <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700 flex w-4/5" />
                <div className="flex grow shrink flex-col justify-center items-center w-full max-w-md">
                  <h2 className="text-gray-800 dark:text-white text-xl font-medium mt-4">
                    Or create multiple users at once.
                  </h2>
                  <p className="text-gray-800 dark:text-gray-400 text-sm mb-4">
                    Create multiple users at once. Import their info from a
                    file.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={
                "flex-none w-screen py-6 px-3 first:pl-3 last:pr-6 left-0 transform translate-x-0 transition-all duration-700 ease-in-out ml-0" +
                (createUserStep === 3 ? " ml-[-100vw]" : "") +
                (!displayFormTwo ? " hidden" : "")
              }
            >
              <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
                <div className="flex grow shrink flex-col justify-center items-center w-full max-w-3xl">
                  <h2 className="text-gray-800 dark:text-white text-xl font-medium mb-10">
                    How do you want to assign permissions to this user?
                  </h2>
                  <ul className="grid gap-6 w-full md:grid-cols-3">
                    <li>
                      <Radio
                        id="permission-default-set"
                        name="permission"
                        value="permission-default-set"
                        className="hidden peer"
                        readOnly
                        checked={radioPermission === "permission-default-set"}
                        onClick={handleClickOnRadioPermission}
                        required
                      />
                      <label
                        htmlFor="permission-default-set"
                        className="h-full inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <div className="flex grow shrink h-full justify-start flex-col">
                          <div className="w-full text-lg font-semibold mb-4">
                            <h3>Start with a default Permission Set</h3>
                          </div>
                          <div className="w-full">
                            <p>
                              We&apos;ve created several sets of job-based
                              permissions for you. Assign one as-is or customize
                              for your needs.
                            </p>
                          </div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <Radio
                        id="permission-saved-set"
                        name="permission"
                        value="permission-saved-set"
                        className="hidden peer"
                        readOnly
                        onClick={handleClickOnRadioPermission}
                        checked={radioPermission === "permission-saved-set"}
                      />
                      <label
                        htmlFor="permission-saved-set"
                        className="h-full inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <div className="flex grow shrink h-full justify-start flex-col">
                          <div className="w-full text-lg font-semibold mb-4">
                            <h3>Use a saved Permission Set</h3>
                          </div>
                          <div className="w-full">
                            <span>
                              Quickly assign your user one of your Permission
                              Sets or Super Admin access.
                            </span>
                          </div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <Radio
                        id="permission-scratch"
                        name="permission"
                        value="permission-scratch"
                        className="hidden peer"
                        readOnly
                        onClick={handleClickOnRadioPermission}
                        checked={radioPermission === "permission-scratch"}
                      />
                      <label
                        htmlFor="permission-scratch"
                        className="h-full inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <div className="flex grow shrink h-full justify-start flex-col">
                          <div className="w-full text-lg font-semibold mb-4">
                            <h3>Start from scratch</h3>
                          </div>
                          <div className="w-full">
                            <span>
                              Customize permissions specifically for these user.
                            </span>
                          </div>
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={
                "flex-none w-screen py-6 px-3 first:pl-3 last:pr-6 left-0 transform translate-x-0 transition-all duration-700 ease-in-out ml-0" +
                (createUserStep === 4 ? " ml-[-100vw]" : "") +
                (!displayFormThree ? " hidden" : "")
              }
            >
              <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
                <div className="flex grow shrink flex-col justify-start items-center w-full max-w-2xl">
                  <p className="text-gray-800 dark:text-gray-400 text-sm mb-4">
                    Sending to users:
                  </p>
                  <div className="flex flex-warp mb-4 gap-4">
                    {newUserEmailItems.map((item) => (
                      <Badge key={item} size="xs" color="gray">
                        <span className="inline-flex gap-2 font-normal p-1">
                          {item}
                          <button
                            type="button"
                            className="button"
                            disabled={savingNewUser}
                            onClick={() => handleDelete(item)}
                          >
                            &times;
                          </button>
                        </span>
                      </Badge>
                    ))}
                  </div>

                  <h2 className="text-gray-800 dark:text-white text-xl font-medium mt-4 mb-4">
                    Invite your teammates to T-WOL
                  </h2>
                  <p className="text-gray-800 dark:text-gray-400 text-sm mb-10">
                    Send them a friendly invitation with everything they need to
                    get started.
                  </p>

                  <div className="flex items-center gap-2">
                    <Checkbox id="accept" defaultChecked={false} />
                    <Label
                      htmlFor="accept"
                      className="!text-lg text-gray-700 dark:text-gray-400 font-light"
                    >
                      Don&apos;t send an email invite when these users are added
                      to T-WOL. They&apos;ll still get access to this account
                      once they log in.
                    </Label>
                  </div>
                </div>
                <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700 flex w-4/5" />
                <div className="flex grow shrink flex-col justify-start items-center w-full">
                  <h4>Review permissions</h4>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex-none py-6 px-3 first:pl-6 w-screen h-full">
              <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
                <div className="flex grow shrink flex-col justify-start items-center w-full max-w-3xl">

                  <h2 className="text-gray-800 dark:text-gray-400 font-medium text-xl text-center mt-10 mb-10">Success! You&apos;ve invited 1 user and sent an email notification.</h2>

                  <div className="flex flex-row justify-between w-full">
                    <h3 className="text-gray-800 dark:text-gray-400 font-medium text-xl text-center">Continue setting up your users with these next steps:</h3>
                  </div>
                  <Accordion flush alwaysOpen className="w-full">
                    <Accordion.Panel>
                      <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
                        Send an invite link
                      </Accordion.Title>
                      <Accordion.Content>
                        <h4 className="text-gray-800 dark:text-gray-400 font-medium text-lg text-left">
                          Copy their unique invite link, and send it to them on
                          whatever platform you like
                        </h4>
                        <div className="flex flex-col flex-warp mt-4 gap-4 w-full">
                          {newUserEmailItemsResponse &&
                            newUserEmailItemsResponse.map((item, key) => (
                              <div key={key} className="w-full">
                                <p className="text-gray-800 dark:text-gray-400 mb-2">
                                  <b>Unique link for:</b> {item.email}
                                </p>
                                {item.link.startsWith("https:") ? (
                                  <span className="relative inline-block">
                                    <div
                                      id="tooltip-default"
                                      role="tooltip"
                                      className={
                                        (clickCopyLinkTrigger
                                          ? "opacity-1 visible "
                                          : "invisible opacity-0") +
                                        " inline-flex left-0 right-0 mr-auto ml-auto justify-center absolute bottom-[120%] w-min z-10 py-2 px-4 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm transition-opacity duration-300 tooltip dark:bg-gray-700"
                                      }
                                    >
                                      <span className="flex">Copied&nbsp;!</span>
                                      <div
                                        className="tooltip-arrow -bottom-1"
                                        data-popper-arrow
                                      ></div>
                                    </div>
                                    <Button
                                      color="dark"
                                      onClick={() => onClickCopyLink(item.link)}
                                    >
                                      <div className="mr-3">
                                        <UilLinkAlt className="h-6 w-6" />
                                      </div>
                                      Copy invite link
                                    </Button>
                                  </span>
                                ) : (
                                  <p className="text-gray-800 dark:text-gray-400 mb-4">
                                    {item.link}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                      <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
                        Add your users to a team
                      </Accordion.Title>
                      <Accordion.Content>
                        <h4 className="text-gray-800 dark:text-gray-400 font-medium text-lg text-left">
                          Teams help partition content and reports
                        </h4>
                        <div className="flex flex-col flex-warp mt-4 gap-4 w-full">
                          <div className="flex gap-4">
                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                              Team
                            </p>
                            <Tooltip
                              className="text-xs font-light max-w-xs shadow"
                              placement="top"
                              content="The primary team gives access to data and assets owned by the team for routing of conversations or meetings and for reporting. A user can only be on one primary team."
                            >
                              <Badge size="xs" color="gray" icon={UilInfo} />
                            </Tooltip>
                          </div>

                          <Select
                            value={team}
                            isSearchable
                            isClearable
                            placeholder="No team assigned"
                            onChange={handleChangeTeam}
                            options={optionsTeams}
                          />
                        </div>
                      </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                      <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
                        Set up users with presets
                      </Accordion.Title>
                      <Accordion.Content>
                        <h4 className="text-gray-800 dark:text-gray-400 font-medium text-lg text-left">
                          Presets help you set up the user experience once they join.
                        </h4>
                        <div className="flex flex-col flex-warp mt-4 gap-4 w-full">
                          <div className="flex gap-4">
                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                              Presets
                            </p>
                            <Tooltip
                              className="text-xs font-light max-w-xs shadow"
                              placement="top"
                              content="Presets help set up your users, so they can get started once they join."
                            >
                              <Badge size="xs" color="gray" icon={UilInfo} />
                            </Tooltip>
                          </div>

                          <Select
                            value={team}
                            isSearchable
                            placeholder="No team assigned"
                            isClearable
                            onChange={handleChangeTeam}
                            options={optionsTeams}
                          />
                        </div>
                      </Accordion.Content>
                    </Accordion.Panel>
                    <Accordion.Panel>
                      <Accordion.Title className="!p-0 !py-4 flex flex-row-reverse !justify-end gap-2 text-md font-medium text-gray-800 dark:text-white">
                        Save these permissions into a reusable permission set
                      </Accordion.Title>
                      <Accordion.Content>
                        <h4 className="text-gray-800 dark:text-gray-400 font-medium text-lg text-left">
                          Save time inviting future users that need the same access.
                        </h4>
                        <div className="flex flex-col flex-warp mt-4 gap-4 w-full">
                          <div className="flex gap-4">
                            <Checkbox id="saveCustomPermSet" />
                            <Label htmlFor="saveCustomPermSet" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                              Save as a custom Permission Set
                            </Label>
                            <Tooltip
                              className="text-xs font-light max-w-xs shadow"
                              placement="top"
                              content="Save to assign new and existing users the Permission Set to grant them the same access."
                            >
                              <Badge size="xs" color="gray" icon={UilInfo} />
                            </Tooltip>
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Panel>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="flex flex-row w-full justify-between items-center border-solid border-t-2 border-gray-100 dark:border-gray-600 px-6 py-4 self-end bg-gray-50 dark:bg-gray-700">
        <Button
          onClick={() => closeProcess()}
          color="gray"
          className={"w-20 " + (createUserStep === 4 && " hidden")}
          disabled={savingNewUser ? true : false}
        >
          Cancel
        </Button>
        <Button.Group className="ml-auto">
          <Button
            color="dark"
            disabled={savingNewUser ? true : false}
            className={
              "w-20 " +
              ((createUserStep === 1 || createUserStep === 4) && " hidden")
            }
            onClick={() => {
              handlePreviousStep();
            }}
          >
            Back
          </Button>

          <Button
            color="dark"
            className="w-20"
            disabled={
              savingNewUser
                ? true
                : createUserStep === 1 && !newUserEmailIsValid
                  ? true
                  : createUserStep === 1 && newUserEmailIsValid
                    ? false
                    : createUserStep === 2 && radioPermission == ""
                      ? true
                      : createUserStep === 2 && radioPermission !== ""
                        ? false
                        : createUserStep === 3 &&
                          radioPermission !== "" &&
                          newUserEmailIsValid
                          ? false
                          : createUserStep === 4
                            ? false
                            : true
            }
            onClick={() => {
              handleNextStep();
            }}
          >
            {createUserStep === 3
              ? "Send"
              : createUserStep === 4
                ? "Done"
                : "Next"}
          </Button>
        </Button.Group>
      </div>
    </div >
  );
}
