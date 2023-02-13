import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useContext, useState, useEffect } from "react";
import { AppLoggedInContext } from "@contexts/AppLoggedInContext";
import {
  AppLoggedInContextType,
  IUser,
  IB2E,
} from "@types/appLoggedInContext";
import { useSession } from "next-auth/react";

import styles from "./Header.module.css";
import {
  Avatar,
  Dropdown,
  Navbar,
  DarkThemeToggle,
  Spinner,
  Label,
  TextInput,
  Radio,
} from "flowbite-react";
import {
  UilCog,
  UilEnglishToChinese,
  UilUser,
  UilSignout,
  UilBell,
  UilMailbox,
  UilEye,
  UilTimes,
  UilSearchAlt,
} from "@iconscout/react-unicons";
import LoadingDots from "@components/common/loading-dots/LoadingDots";

import { usePrevious } from "@lib/hooks/use-previous";

import { fetcher } from "@lib/fetcher";
import useSWR, { mutate } from "swr";

interface IUserHeader
  extends Pick<
    IUser,
    | "email"
    | "firstname"
    | "lastname"
    | "image"
    | "inUseOngId"
    | "inUseOngName"
    | "language"
    | "ongConnected"
    | "role"
    | "permissionSet"
  > { }

export default function Header() {
  const { changeAccount, setError } = useContext(
    AppLoggedInContext
  ) as AppLoggedInContextType;

  const { data: session } = useSession();
  const { data: userAccessAndRole } = useSWR<IUserHeader | null>(
    session && `/api/charity/accessAndRole?userId=${session.user.id}`,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnReconnect: true,
    }
  );
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<IUserHeader>({
    email: null,
    firstname: null,
    image: null,
    inUseOngId: null,
    inUseOngName: null,
    language: null,
    lastname: null,
    ongConnected: null,
    role: null,
    permissionSet: null
  });

  const previousUserAccessAndRole = usePrevious({ userAccessAndRole });

  useEffect(() => {
    if (
      userAccessAndRole &&
      session &&
      previousUserAccessAndRole?.userAccessAndRole !== userAccessAndRole
    ) {
      setUser({
        email: userAccessAndRole.email,
        firstname: userAccessAndRole.firstname,
        image: userAccessAndRole.image,
        inUseOngId: userAccessAndRole.inUseOngId,
        inUseOngName: userAccessAndRole.inUseOngName,
        language: userAccessAndRole.language,
        lastname: userAccessAndRole.lastname,
        ongConnected: userAccessAndRole.ongConnected,
        role: userAccessAndRole.role,
        permissionSet: userAccessAndRole.permissionSet,
      });
      if (userAccessAndRole.ongConnected !== null) {
        setNgoFound(userAccessAndRole.ongConnected);
        return;
      }
      setLoading(false);
    }
  }, [userAccessAndRole, session, previousUserAccessAndRole]);

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

  const [searchNgo, setSearchNgo] = useState("");
  const [ngoFound, setNgoFound] = useState<Array<IB2E>>();

  const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    if (keyword !== "") {
      const results = user.ongConnected!.filter((user: IB2E) => {
        return user.ong.registered_name
          .toLowerCase()
          .startsWith(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setNgoFound(results);
    } else {
      setNgoFound(user.ongConnected!);
      // If the text field is empty, show all users
    }

    setSearchNgo(keyword);
  };

  const changeAccountRequest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ongIdSelected = e.target.value;
    if (ongIdSelected === user.inUseOngId) {
      setError("Tu es déjà sur ce compte");
    }
    changeAccount(ongIdSelected);
  };

  return (
    <header>
      <Navbar
        fluid={true}
        className="bg-white px-4 lg:px-6 py-2.5 dark:bg-gray-800 fixed w-full z-20 top-0 left-0 border-b border-gray-200"
      >
        <Navbar.Brand href="/">
          <Image
            width={40}
            height={40}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
            src="/logo.png"
            className="mr-6 w-auto !h-10 !sm:h-9"
            alt="T-WOL Logo"
          />
        </Navbar.Brand>

        {/* Buttons Left */}
        <div className="flex md:order-2">
          {/* Dark Mode */}
          <DarkThemeToggle />

          {/* Divider */}
          <div className="px-2 items-center flex justify-center">
            <span className="h-3/5 p-relative w-0.5 bg-gray-400 dark:text-gray-700 block rounded"></span>
          </div>

          {/* Notification */}
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <>
                <span className="rounded-lg p-2 relative text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                  <UilBell className="w-6 h-6" />
                  <div className="flex absolute top-1.5 right-1.5">
                    <div className="inline-flex relative w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                </span>
              </>
            }
            placement="bottom-end"
            className="w-80 mr-2 bg-white rounded-none divide-gray-100 shadow dark:bg-gray-800 dark:divide-gray-700 !top-[3.75em]"
          >
            <Dropdown.Header className="font-medium text-center">
              Notifications
            </Dropdown.Header>
            <Dropdown.Item className="relative">
              <div className="flex-shrink-0">
                <Image
                  className="w-11 h-11 rounded-full"
                  src="/static/profile-picture-1.jpg"
                  alt="Jese image"
                  height={30}
                  width={30}
                />
                <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-blue-600 rounded-full border border-white dark:border-gray-800">
                  <UilMailbox className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="px-3 w-full">
                <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                  New message from{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Jese Leos
                  </span>
                  : &ldquo;Hey, what&apos;s up? All set for the
                  presentation?&ldquo;
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-500">
                  a few moments ago
                </div>
              </div>
              <div className="flex relative self-start">
                <div
                  className="inline-flex justify-center items-center center relative w-4 pt-1 h-4 bg-grey-500 rounded-full dark:border-gray-900"
                  onClick={() => alert("remove notification")}
                >
                  <UilTimes />
                </div>
              </div>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Link href={"/notifications"} className="">
              <Dropdown.Item className="w-full items-center block justify-center text-sm font-medium text-center">
                <UilEye className="mr-2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                Tout voir
              </Dropdown.Item>
            </Link>
          </Dropdown>

          {/* Divider */}
          <div className="px-2 items-center flex justify-center">
            <span className="h-3/5 p-relative w-0.5 bg-gray-400 dark:text-gray-700 block rounded"></span>
          </div>

          {/* User & Account */}
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              user ? (
                <div className="flex pr-0 lg:pr-1 item-center justify-center items-center h-10 w-full rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                  <Avatar
                    alt={
                      user.firstname !== null && user.lastname !== null
                        ? user.firstname + " " + user.lastname
                        : "User picture"
                    }
                    img={user.image || "/static/default-profile.jpg"}
                    rounded={true}
                    className="flex item-center justify-center w-10 h-10 relative"
                    size="sm"
                  />
                  <div className="hidden lg:flex text-gray-700 dark:text-gray-400 dark:hover:text-white md:dark:hover:text-white ">
                    <span
                      className={
                        styles.customUserButton +
                        " block text-sm font-light text-gray-700 truncate dark:text-gray-400"
                      }
                    >
                      {user.inUseOngName && !loading ? (
                        user.inUseOngName
                      ) : (
                        <LoadingDots />
                      )}
                    </span>
                    {arrowDown}
                  </div>
                </div>
              ) : (
                <Spinner aria-label="Loading user data" size="md" />
              )
            }
            className="font-normal rounded-none w-60 !top-[3.75em]"
          >
            <Dropdown.Header className="relative flex w-full">
              <div className="relative flex w-full flex-row">
                <div className="w-10 flex-shrink-0">
                  <Avatar
                    alt={
                      user.firstname !== null && user.lastname !== null
                        ? user.firstname + " " + user.lastname
                        : "User picture"
                    }
                    img={user.image || "/logo.png"}
                    rounded={true}
                    className="flex item-center justify-center w-10 h-10 relative"
                    size="sm"
                  />
                </div>
                <div className="w-auto flex flex-col truncate pl-2">
                  <span className="block text-sm font-semibold truncate text-ellipsis overflow-hidden text-gray-700 dark:text-white">
                    {user && !loading ? (
                      user.firstname !== null && user.lastname !== null ? (
                        user.firstname + " " + user.lastname
                      ) : (
                        "User name"
                      )
                    ) : (
                      <LoadingDots />
                    )}
                  </span>
                  <span className="block text-xs font-light text-gray-700 text-ellipsis overflow-hidden truncate dark:text-gray-400">
                    {user && !loading ? user.email : <LoadingDots />}
                  </span>
                </div>
              </div>
            </Dropdown.Header>
            {user.ongConnected !== null ? (
              <Dropdown.Header>
                <Dropdown
                  arrowIcon={true}
                  inline={true}
                  placement="bottom-end"
                  label={
                    <div className="w-48 flex flex-col">
                      {user && !loading ? (
                        <>
                          <span className="text-xs text-left truncate font-semibold text-gray-700 dark:text-white">
                            {user && !loading ? user.inUseOngName : <LoadingDots />}
                          </span>
                          {user.permissionSet?.accountOwner ? (<span className="block text-left text-xs font-light text-gray-700 truncate dark:text-gray-400">{user.permissionSet?.name}</span>)
                            : user.permissionSet?.super_admin
                              ? (<span className="block text-left text-xs font-light text-gray-700 truncate dark:text-gray-400">Super Administrateur</span>)
                              : null}
                        </>
                      ) : (
                        <LoadingDots />
                      )}
                    </div>
                  }
                  className="w-56 rounded-none"
                >
                  <Dropdown.Header>
                    <label htmlFor="input-group-search" className="sr-only">
                      Chercher
                    </label>
                    <TextInput
                      id="input-group-search"
                      type="text"
                      value={searchNgo}
                      onChange={filter}
                      placeholder="Chercher une ONG"
                      required={true}
                      icon={UilSearchAlt}
                      sizing="sm"
                    />
                  </Dropdown.Header>
                  <div className="overflow-y-auto pb-3 max-h-40 text-sm text-gray-700 dark:text-gray-200">
                    {ngoFound && ngoFound.length > 0 ? (
                      ngoFound.map((ong, key) => (
                        <Dropdown.Item
                          key={key}
                          className="flex items-center text-sm text-gray-700 gap-2"
                        >
                          <Radio
                            id={ong.ongId}
                            name="ngo"
                            value={ong.ongId}
                            checked={ong.inUse}
                            onChange={changeAccountRequest}
                          />
                          <Label
                            className="text-xs font-normal text-gray-700 dark:text-gray-200 dark:hover:text-white"
                            htmlFor={ong.ongId}
                          >
                            {ong.ong.account_name === null
                              ? ong.ong.registered_name
                              : ong.ong.account_name}
                          </Label>
                        </Dropdown.Item>
                      ))
                    ) : (
                      <p>Auncun resultat</p>
                    )}
                  </div>
                </Dropdown>
              </Dropdown.Header>
            ) : (
              <></>
            )}
            <Link
              href={`/settings/${session?.user.id}/user-preferences/profile`}
            >
              <Dropdown.Item icon={UilUser}>Mon profile</Dropdown.Item>
            </Link>
            <Link
              href={`/settings/${session?.user.id}/account-settings/account-defaults`}
            >
              <Dropdown.Item icon={UilCog}>Paramètre</Dropdown.Item>
            </Link>
            <Dropdown.Item icon={UilEnglishToChinese}>Langue</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={UilSignout} onClick={() => signOut()}>
              Déconnexion
            </Dropdown.Item>
          </Dropdown>

          {/* Open Mobile Menu */}
          <Navbar.Toggle />
        </div>

        {/* Menu Nav */}
        <Navbar.Collapse className={"flex-grow " + styles.customNavbarCollapse}>
          <li>
            <div className="block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white font-normal lg:text-md">
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={<>Contacts {arrowDown}</>}
                className="w-48 rounded-none !top-[2.85em]"
              >
                <Link href={"/contacts"}>
                  <Dropdown.Item>Contacts</Dropdown.Item>
                </Link>
                <Link href={"/list"}>
                  <Dropdown.Item>List</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Link href={"/activity-feed"}>
                  <Dropdown.Item>Activity Feed</Dropdown.Item>
                </Link>
              </Dropdown>
            </div>
          </li>

          <li>
            <div className="block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white font-normal lg:text-md">
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={<>Conversation {arrowDown}</>}
                className="w-48 rounded-none !top-[2.85em]"
              >
                <Link href={"/chat"}>
                  <Dropdown.Item>Chat</Dropdown.Item>
                </Link>
                <Link href={"/mailbox"}>
                  <Dropdown.Item>Mailbox</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Link href={"/chatbot"}>
                  <Dropdown.Item>Chatbot</Dropdown.Item>
                </Link>
              </Dropdown>
            </div>
          </li>

          <li>
            <div className="block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white font-normal lg:text-md">
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={<>Marketing {arrowDown}</>}
                className="w-48 rounded-none !top-[2.85em]"
              >
                <li className="flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                  <Dropdown
                    arrowIcon={true}
                    inline={true}
                    placement="right-start"
                    label={
                      <>
                        <span className="w-36 text-left">Donation</span>
                      </>
                    }
                    className="w-48 rounded-none !-top-0 h-full"
                  >
                    <Link href={"/fundraising"}>
                      <Dropdown.Item>Fundraising</Dropdown.Item>
                    </Link>
                    <Link href={"/crowdfunding"}>
                      <Dropdown.Item>Crowdfunding</Dropdown.Item>
                    </Link>
                  </Dropdown>
                </li>
                <Link href={"/email"}>
                  <Dropdown.Item>Email</Dropdown.Item>
                </Link>

                <Link href={"/landinpage"}>
                  <Dropdown.Item>Landing Page</Dropdown.Item>
                </Link>

                <Link href={"/website"}>
                  <Dropdown.Item>Web Site</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <li className="flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                  <Dropdown
                    arrowIcon={true}
                    inline={true}
                    placement="right-start"
                    label={
                      <>
                        <span className="w-36 text-left">Lead Capture</span>
                      </>
                    }
                    className="w-48 rounded-none !-top-0 h-full"
                  >
                    <Link href={"/forms"}>
                      <Dropdown.Item>Form</Dropdown.Item>
                    </Link>
                    <Link href={"/popup"}>
                      <Dropdown.Item>Pop Up</Dropdown.Item>
                    </Link>
                  </Dropdown>
                </li>
                <Link href={"/files"}>
                  <Dropdown.Item>Files & Media</Dropdown.Item>
                </Link>
              </Dropdown>
            </div>
          </li>

          <li>
            <div className="block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white font-normal lg:text-md">
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={<>Automation {arrowDown}</>}
                className="w-48 rounded-none !top-[2.85em]"
              >
                <Link href={"/workflow"}>
                  <Dropdown.Item>Workflow</Dropdown.Item>
                </Link>
              </Dropdown>
            </div>
          </li>

          <li>
            <div className="block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white font-normal lg:text-md">
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={<>Reporting {arrowDown}</>}
                className="w-48 rounded-none !top-[2.85em]"
              >
                <Link href={"/analytics"}>
                  <Dropdown.Item>Analitycs</Dropdown.Item>
                </Link>
                <Link href={"/dashboard"}>
                  <Dropdown.Item>Dashboard</Dropdown.Item>
                </Link>
                <Link href={"/reports"}>
                  <Dropdown.Item>Rapports</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Link href={"/trackers"}>
                  <Dropdown.Item>Trackers</Dropdown.Item>
                </Link>
              </Dropdown>
            </div>
          </li>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}
