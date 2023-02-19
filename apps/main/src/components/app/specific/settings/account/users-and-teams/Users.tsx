import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { useContext, useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  Modal,
  Table,
  TextInput,
  Tooltip,
} from 'flowbite-react'

import {
  UilSearchAlt,
  UilExport,
  UilInfo,
  UilSortAmountDown,
  UilSortAmountUp,
} from '@iconscout/react-unicons'

const CreateUser = dynamic(
  () =>
    import(
      '@components/app/specific/settings/account/users-and-teams/users/CreateUser'
    ),
  {
    ssr: false,
  }
)

import { AppLoggedInContext } from '@contexts/AppLoggedInContext'

import { api, type RouterOutputs } from '@lib/utils/api'

interface PropForm {
  userId: string
}
export default function Users({ userId }: PropForm) {
  const router = useRouter()

  // pagination table
  const [toTake, setToTake] = useState(25)
  const [toSkip, setToSkip] = useState(1)
  // search user
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
  // pagination table
  const [toOrderBy, setToOrderBy] = useState('')
  const [toOrderByStartWith, setToOrderByStartWith] = useState('')
  // Filters
  const [toFilterBy, setToFilterBy] = useState<
    { category: string; selected: string }[]
  >([])
  const [toFilterByLink, setToFilterByLink] = useState<string>('')

  // get all users from this account
  const {
    data: usersList,
    isLoading: isLoadingUsersList,
    refetch: refetchUsersList,
  } = api.adminSettingsAccountUsersAndTeamsUsers.getUsersSettings.useQuery(
    {
      userId: userId,
      toTake: toTake,
      toSkip: toSkip,
      searchTerm: debouncedSearchTerm,
      toOrderBy: toOrderBy,
      toOrderByStartWith: toOrderByStartWith,
    },
    {
      retry: 1,
      onError: () => router.push('/'),
      refetchOnWindowFocus: true, // on come back to page
      refetchInterval: false, // ?
      refetchIntervalInBackground: false, // ?
      refetchOnReconnect: true, // computer come out of standby (reconnect to web)
    }
  )

  useEffect(() => {
    if (debouncedSearchTerm !== null || debouncedSearchTerm !== undefined) {
      setToTake(25)
      setToSkip(1)
      setToOrderBy('')
      setToOrderByStartWith('')
      refetchUsersList()
    }
  }, [debouncedSearchTerm])

  // Handle Order By
  const handleOrderBy = (categoryName: string) => {
    if (toOrderBy === '') {
      setToOrderBy(categoryName)
      setToOrderByStartWith('asc')
    } else {
      if (toOrderBy !== categoryName) {
        setToOrderBy(categoryName)
        setToOrderByStartWith('asc')
      } else {
        if (toOrderByStartWith === 'asc') {
          setToOrderByStartWith('desc')
        } else {
          setToOrderBy('')
          setToOrderByStartWith('')
        }
      }
    }
  }

  // Handle Filter
  const handleFilter = (
    filterCategoryName: string,
    filterSelectedName: string
  ) => {
    if (filterCategoryName !== '' && filterSelectedName !== '') {
      const categoryIsFound = toFilterBy.some((filter) => {
        if (filter.category === filterCategoryName) {
          return true
        }
        return false
      })
      if (categoryIsFound) {
        if (filterSelectedName === 'All') {
          setToFilterBy(
            toFilterBy.filter((item) => item.category !== filterCategoryName)
          )
          // set link filter
          let link = ''
          toFilterBy
            .filter((item) => item.category !== filterCategoryName)
            .forEach((item, key) => {
              link += '&' + item.category + '=' + item.selected
            })
          setToFilterByLink(link)
        } else {
          setToFilterBy(
            toFilterBy.filter((item) => item.category !== filterCategoryName)
          )
          setToFilterBy((prevToFilterBy) => [
            ...prevToFilterBy,
            { category: filterCategoryName, selected: filterSelectedName },
          ])
          // set link filter
          let link = ''
          let filterForLink = toFilterBy.filter(
            (item) => item.category !== filterCategoryName
          )
          filterForLink = [
            ...filterForLink,
            { category: filterCategoryName, selected: filterSelectedName },
          ]
          filterForLink.forEach((item, key) => {
            link += '&' + item.category + '=' + item.selected
          })
          setToFilterByLink(link)
        }
      } else {
        if (filterSelectedName === 'All') {
        } else {
          setToFilterBy((prevToFilterBy) => [
            ...prevToFilterBy,
            { category: filterCategoryName, selected: filterSelectedName },
          ])
          // set link filter
          let link = ''
          let filterForLink = [
            ...toFilterBy,
            { category: filterCategoryName, selected: filterSelectedName },
          ]
          filterForLink.forEach((item, key) => {
            link += '&' + item.category + '=' + item.selected
          })
          setToFilterByLink(link)
        }
      }
      refetchUsersList()
    }
  }

  const getFilters = (filterCategoryName: string) => {
    if (filterCategoryName !== '') {
      let toReturn = 'All'
      const categorySelectedValue = toFilterBy.map((filter) => {
        if (filter.category === filterCategoryName) {
          toReturn = filter.selected
        }
      })
      return toReturn
    }
    return 'All'
  }

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
  )

  //Export users
  const [openModalExportUsers, setOpenModalExportUsers] =
    useState<boolean>(false)

  //Action Modal
  const [openModalActionsUsers, setOpenModalActionsUsers] =
    useState<boolean>(false)

  //create a User
  const { setRootModal, resetRootModal } = useContext(AppLoggedInContext)


  const finishProcessCreateUser = () => {
    resetRootModal()
    refetchUsersList()
  }

  const handleCreateNewUser = () => {
    setRootModal(
      <CreateUser
        closeProcess={resetRootModal}
        finishProcess={finishProcessCreateUser}
        userId={userId}
      />
    )
  }

  return (
    <>
      <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
        Create new users, customize user permissions, and remove users from your
        account.{' '}
        <Link
          className="font-bold text-blue-600"
          href={`/settings/${userId}/account-settings/users-and-teams`}
        >
          Learn more about user permissions
        </Link>
        .
      </p>
      <hr className="my-4 mb-10 h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="w-full">
        <div className="flex flex-wrap justify-between flex-col-reverse 2xl:flex-row">
          <div className="w-full 2xl:w-3/5 mt-4 2xl:mt-0 flex items-center gap-4 flex-col lg:flex-row">
            <div className="w-full lg:w-auto xs:flex">
              <label htmlFor="input-group-search" className="sr-only">
                Chercher un utilisateur
              </label>
              <TextInput
                id="input-group-search"
                type="text"
                value={searchTerm}
                onInput={(e) => {
                  setSearchTerm(e.currentTarget.value)
                }}
                placeholder="Chercher une utilisateur"
                required={true}
                icon={UilSearchAlt}
                sizing="md"
              />
            </div>
            <div className="w-full lg:w-auto flex gap-4 flex-col xs:flex-row">
              <div className="flex items-center gap-2">
                <p className="text-gray-800 dark:text-gray-400 text-sm">
                  Status
                </p>
                <Dropdown
                  label={
                    <span className="text-blue-600 text-sm font-medium flex">
                      {getFilters('Status')} {arrowDown}
                    </span>
                  }
                  inline={true}
                  arrowIcon={false}
                  placement="bottom-end"
                  className="w-40"
                >
                  <Dropdown.Item onClick={() => handleFilter('Status', 'All')}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleFilter('Status', 'Active')}
                  >
                    Active
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleFilter('Status', 'Pending')}
                  >
                    Pending
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleFilter('Status', 'Uninvited')}
                  >
                    Uninvited
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleFilter('Status', 'Deactivate')}
                  >
                    Deactivate
                  </Dropdown.Item>
                </Dropdown>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-gray-800 dark:text-gray-400 text-sm">
                  Permission Set
                </p>
                <Dropdown
                  label={
                    <span className="text-blue-600 text-sm font-medium flex">
                      {getFilters('Permission')} {arrowDown}
                    </span>
                  }
                  inline={true}
                  arrowIcon={false}
                  placement="bottom-end"
                  className="w-40"
                >
                  <Dropdown.Item
                    onClick={() => handleFilter('Permission', 'All')}
                  >
                    All
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleFilter('Permission', 'Settings')}
                  >
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleFilter('Permission', 'Deactivate')}
                  >
                    Earnings
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleFilter('Permission', 'Deactivate')}
                  >
                    Sign out
                  </Dropdown.Item>
                </Dropdown>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-gray-800 dark:text-gray-400 text-sm">
                  Partner
                </p>
                <Dropdown
                  label={
                    <span className="text-blue-600 text-sm font-medium flex">
                      {getFilters('Partner')} {arrowDown}
                    </span>
                  }
                  inline={true}
                  arrowIcon={false}
                  placement="bottom-end"
                  className="w-40"
                >
                  <Dropdown.Item onClick={() => handleFilter('Partner', 'All')}>
                    All
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleFilter('Partner', 'Partner')}
                  >
                    Partner users
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleFilter('Partner', 'Non-Partner')}
                  >
                    Non-partner users
                  </Dropdown.Item>
                </Dropdown>
              </div>
            </div>
          </div>

          <div className="flex items-end xs:items-center justify-start xs:justify-end gap-4 w-full 2xl:w-auto flex-col-reverse xs:flex-row">
            <Button
              size="sm"
              className="inlineButton"
              onClick={() => setOpenModalExportUsers(!openModalExportUsers)}
            >
              <UilExport className="mr-1 h-4 w-4" />
              Export users
            </Button>
            <Modal
              show={openModalExportUsers}
              size="lg"
              popup={true}
              onClose={() => setOpenModalExportUsers(!openModalExportUsers)}
            >
              <Modal.Header className="text-xl font-medium text-gray-900 dark:text-white !px-6 !py-3 bg-gray-100 items-center dark:bg-gray-800">
                Edit your password
              </Modal.Header>
              <Modal.Body className="px-6 pb-4 pt-4 sm:pt-4 sm:pb-6 lg:px-8 xl:pb-8">
                <p className="text-gray-800 dark:text-gray-400 text-sm mt-4 mb-5">
                  You&apos;ll need to check your email to validate this new
                  password.
                </p>

                <Modal.Footer className="w-full flex !p-0 mt-8">
                  <Button>Enregistrer</Button>
                  <Button
                    color="gray"
                    onClick={() => {
                      setOpenModalExportUsers(!openModalExportUsers)
                    }}
                  >
                    Annuler
                  </Button>
                </Modal.Footer>
              </Modal.Body>
            </Modal>
            <Button color="dark" onClick={() => handleCreateNewUser()}>
              Create user
            </Button>
          </div>
        </div>
        <div className="my-6">
          <Table hoverable={true} className="customTables">
            <Table.Head>
              <Table.HeadCell className="!p-4">
                <Checkbox />
              </Table.HeadCell>
              <Table.HeadCell
                className={
                  (toOrderBy === 'firstname'
                    ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500'
                    : 'rounded-none') +
                  ' cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                }
                onClick={() => handleOrderBy('firstname')}
              >
                <span className="flex w-full items-center gap-2">
                  Name{' '}
                  {toOrderBy === 'firstname' ? (
                    toOrderByStartWith === 'asc' ? (
                      <UilSortAmountUp />
                    ) : (
                      <UilSortAmountDown />
                    )
                  ) : (
                    ''
                  )}
                </span>
              </Table.HeadCell>
              <Table.HeadCell
                className={
                  (toOrderBy === 'teams'
                    ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500'
                    : 'rounded-none') +
                  ' cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                }
                onClick={() => handleOrderBy('teams')}
              >
                <span className="flex w-full items-center gap-2">
                  Teams{' '}
                  {toOrderBy === 'teams' ? (
                    toOrderByStartWith === 'asc' ? (
                      <UilSortAmountUp />
                    ) : (
                      <UilSortAmountDown />
                    )
                  ) : (
                    ''
                  )}
                </span>
              </Table.HeadCell>
              <Table.HeadCell
                className={
                  (toOrderBy === 'access'
                    ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500'
                    : 'rounded-none') +
                  ' cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                }
                onClick={() => handleOrderBy('access')}
              >
                <span className="flex w-full items-center gap-2">
                  Access{' '}
                  {toOrderBy === 'access' ? (
                    toOrderByStartWith === 'asc' ? (
                      <UilSortAmountUp />
                    ) : (
                      <UilSortAmountDown />
                    )
                  ) : (
                    ''
                  )}
                </span>
              </Table.HeadCell>
              <Table.HeadCell
                className={
                  (toOrderBy === 'lastActive'
                    ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500'
                    : 'rounded-none') +
                  ' cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                }
                onClick={() => handleOrderBy('lastActive')}
              >
                <div className="flex">
                  <span className="flex w-full items-center gap-2">
                    Last active{' '}
                    {toOrderBy === 'lastActive' ? (
                      toOrderByStartWith === 'asc' ? (
                        <UilSortAmountUp />
                      ) : (
                        <UilSortAmountDown />
                      )
                    ) : (
                      ''
                    )}
                  </span>
                  <Tooltip
                    className="text-xs font-light max-w-xs shadow normal-case"
                    content="The last time a user was logged in and active on desktop or mobile."
                  >
                    <Badge size="xs" color="gray" icon={UilInfo} />
                  </Tooltip>
                </div>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {usersList ? (
                usersList.data.length > 0 ? (
                  usersList.data.map((user, key) => (
                    <Table.Row
                      key={key}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 group"
                    >
                      <Table.Cell className="!p-4">
                        <Checkbox />
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[280px]">
                        <div className="flex items-center h-full gap-2">
                          <div className="flex w-full items-center grow-1 shrink-1 order-2 min-width-0">
                            <div className="table min-width-0 table-fixed w-full">
                              <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full align-middle table-cell">
                                <div className="flex items-center w-full">
                                  <div className="w-10 h-10 rounded-full block relative">
                                    <Image
                                      fill
                                      sizes="100%"
                                      className="rounded-full"
                                      src={
                                        user.user.image
                                          ? user.user.image
                                          : '/static/default-profile.jpg'
                                      }
                                      alt={
                                        user.user.firstname +
                                        ' ' +
                                        user.user.lastname
                                      }
                                    />
                                  </div>
                                  <div className="pl-4 w-[calc(100%-40px)] flex justify-center flex-col items-start">
                                    <div className="text-base font-semibold w-full relative truncate">
                                      <Button
                                        size="sm"
                                        className="inlineButton"
                                        onClick={() =>
                                          setOpenModalActionsUsers(
                                            !openModalActionsUsers
                                          )
                                        }
                                      >
                                        {user.user.firstname}{' '}
                                        {user.user.lastname}
                                      </Button>
                                    </div>
                                    <div className="font-normal w-full relative text-gray-500 flex items-center">
                                      <span
                                        className={
                                          (user.status === 1
                                            ? 'bg-yellow-400'
                                            : user.status === 2
                                            ? 'bg-green-400'
                                            : 'bg-red-400') +
                                          ' block relative w-2 h-2 rounded-full mr-2'
                                        }
                                      ></span>
                                      <span className="font-normal w-full text-gray-500 truncate flex items-center text-ellipsis overflow-hidden">
                                        {user.user.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="hidden group-hover:flex order-3 sr-only group-hover:not-sr-only">
                            <Button
                              color="dark"
                              size="xs"
                              onClick={() => {
                                setOpenModalActionsUsers(!openModalActionsUsers)
                              }}
                            >
                              Action {arrowDown}
                            </Button>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                        <span>{user.teams ? user.teams : '-'}</span>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[375px]">
                        <div className="flex flex-col">
                          <div>
                            <span className="font-medium text-sm">
                              {user.PermissionSets.name &&
                                user.PermissionSets.name}
                            </span>
                          </div>
                          <div>
                            <ul className="flex flex-row gap-2">
                              {user.PermissionSets.access.SuperAdmin && (
                                <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[length:1px_60%] pl-2 last:pr-0">
                                  Super Admin
                                </li>
                              )}
                              {user.PermissionSets.access.SuperAdmin &&
                                user.PermissionSets.access
                                  .SalesProfessional && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Sales Professional
                                  </li>
                                )}
                              {!user.PermissionSets.access.SuperAdmin && (
                                <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-no-repeat  bg-[length:1px_60%] pl-2 last:pr-0">
                                  Contacts
                                </li>
                              )}
                              {!user.PermissionSets.access.SuperAdmin &&
                                user.PermissionSets.access.Marketing && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Marketing
                                  </li>
                                )}
                              {!user.PermissionSets.access.SuperAdmin &&
                                user.PermissionSets.access.Sales && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Sales
                                  </li>
                                )}
                              {!user.PermissionSets.access.SuperAdmin &&
                                user.PermissionSets.access.Service && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Service
                                  </li>
                                )}
                              {!user.PermissionSets.access.SuperAdmin &&
                                user.PermissionSets.access.Reports && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Reports
                                  </li>
                                )}
                              {!user.PermissionSets.access.SuperAdmin &&
                                user.PermissionSets.access.Account && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Account
                                  </li>
                                )}
                            </ul>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[150px]">
                        <span>il y a 15 jours</span>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                    <Table.Cell className="!p-4">
                      <Checkbox />
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[280px]">
                      <p className="text-base font-semibold w-full relative truncate">
                        No users found
                      </p>
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                      <span> </span>
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[375px]">
                      <span> </span>
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[150px]">
                      <span> </span>
                    </Table.Cell>
                  </Table.Row>
                )
              ) : (
                [0, 1].map((i) => (
                  <Table.Row
                    key={i}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 group animate-pulse"
                  >
                    <Table.Cell className="!p-4">
                      <Checkbox disabled />
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[280px]">
                      <div className="flex items-center h-full gap-2">
                        <div className="flex w-full items-center grow-1 shrink-1 order-2 min-width-0">
                          <div className="table min-width-0 table-fixed w-full">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full align-middle table-cell">
                              <div className="flex items-center w-full">
                                <div className="w-10 h-10 rounded-full block relative bg-gray-400 dark:bg-gray-800 animate-pulse" />
                                <div className="pl-4 w-[calc(100%-40px)] flex justify-center flex-col items-start">
                                  <div className="text-base font-semibold w-full relative truncate flex gap-2 h-4 mb-2">
                                    <span className="w-14 h-4 inline-flex rounded-md bg-gray-300 animate-pulse" />
                                    <span className="w-20 h-4 inline-flex rounded-md bg-gray-300 animate-pulse" />
                                  </div>
                                  <div className="font-normal w-full relative text-gray-500 flex items-center">
                                    <span
                                      className={
                                        (i === 1
                                          ? 'bg-green-400'
                                          : 'bg-yellow-400') +
                                        ' block relative w-2 h-2 rounded-full mr-2'
                                      }
                                    ></span>
                                    <span className="font-normal w-full text-gray-500 truncate flex items-center text-ellipsis overflow-hidden">
                                      <span className="w-32 h-2 rounded-md bg-gray-300 animate-pulse" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[200px]">
                      <span className="w-20 h-4 block rounded-md bg-gray-300 animate-pulse" />
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[375px]">
                      <div className="flex flex-col">
                        <div>
                          <span className="w-28 h-4 rounded-md inline-block bg-gray-300 animate-pulse" />
                        </div>
                        <div>
                          <ul className="flex flex-row gap-2">
                            <li className="text-xs font-normal">
                              <span className="w-14 h-2 rounded-md inline-block bg-gray-300 animate-pulse" />
                            </li>
                            <li className="text-xs font-normal">
                              <span className="w-14 h-2 rounded-md inline-block bg-gray-300 animate-pulse" />
                            </li>
                            <li className="text-xs font-normal">
                              <span className="w-14 h-2 rounded-md inline-block bg-gray-300 animate-pulse" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[150px]">
                      <span className="w-20 h-4 rounded-md bg-gray-300 block animate-pulse" />
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
          {usersList && (
            <div className="flex items-center w-full">
              <nav
                className="flex w-full justify-between items-center pt-4"
                aria-label="Table navigation"
              >
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Showing{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {usersList.pagination.from}-{usersList.pagination.to}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {usersList.pagination.total}
                  </span>
                </span>
                <ul className="inline-flex items-center -space-x-px">
                  {usersList.pagination.currentPage > 1 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(usersList.pagination.currentPage - 1)
                          //mutate(`/api/settings/account/users-and-teams/users`)
                          refetchUsersList()
                        }}
                        className="block ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                    </li>
                  )}
                  {usersList.pagination.currentPage > 4 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(1)
                          // mutate(`/api/settings/account/users-and-teams/users`)
                          refetchUsersList()
                        }}
                        className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        1
                      </Button>
                    </li>
                  )}
                  {usersList.pagination.currentPage > 4 && (
                    <li>
                      <Button className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        ...
                      </Button>
                    </li>
                  )}
                  {usersList.pagination.currentPage > 3 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(usersList.pagination.currentPage - 3)
                          // mutate(`/api/settings/account/users-and-teams/users`)
                          refetchUsersList()
                        }}
                        className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        {usersList.pagination.currentPage - 3}
                      </Button>
                    </li>
                  )}
                  {usersList.pagination.currentPage > 2 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(usersList.pagination.currentPage - 2)
                          // mutate(`/api/settings/account/users-and-teams/users`)
                          refetchUsersList()
                        }}
                        className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        {usersList.pagination.currentPage - 2}
                      </Button>
                    </li>
                  )}
                  {usersList.pagination.currentPage > 1 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(usersList.pagination.currentPage - 1)
                          // mutate(`/api/settings/account/users-and-teams/users`)
                          refetchUsersList()
                        }}
                        className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        {usersList.pagination.currentPage - 1}
                      </Button>
                    </li>
                  )}
                  <li>
                    <Button
                      aria-current="page"
                      className={
                        (usersList.pagination.currentPage === 1 &&
                        usersList.pagination.currentPage ===
                          usersList.pagination.pageCount
                          ? 'rounded-md '
                          : usersList.pagination.currentPage === 1 &&
                            usersList.pagination.currentPage <
                              usersList.pagination.pageCount
                          ? 'rounded-l-md'
                          : usersList.pagination.currentPage > 1 &&
                            usersList.pagination.currentPage <
                              usersList.pagination.pageCount
                          ? 'rounded-none'
                          : usersList.pagination.currentPage > 1 &&
                            usersList.pagination.currentPage ===
                              usersList.pagination.pageCount
                          ? 'rounded-r-md'
                          : 'rounded-none') +
                        ' p-0 text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                      }
                    >
                      {usersList.pagination.currentPage}
                    </Button>
                  </li>
                  {usersList.pagination.currentPage > 1 &&
                    usersList.pagination.pageCount >
                      usersList.pagination.currentPage && (
                      <li>
                        <Button
                          onClick={() => {
                            setToSkip(usersList.pagination.currentPage + 1)
                            // mutate(
                            //   `/api/settings/account/users-and-teams/users`
                            // )
                            refetchUsersList()
                          }}
                          className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {usersList.pagination.currentPage + 1}
                        </Button>
                      </li>
                    )}
                  {usersList.pagination.currentPage > 1 &&
                    usersList.pagination.pageCount >
                      usersList.pagination.currentPage + 1 && (
                      <li>
                        <Button
                          onClick={() => {
                            setToSkip(usersList.pagination.currentPage + 2)
                            // mutate(
                            //   `/api/settings/account/users-and-teams/users`
                            // )
                            refetchUsersList()
                          }}
                          className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {usersList.pagination.currentPage + 2}
                        </Button>
                      </li>
                    )}
                  {usersList.pagination.currentPage > 1 &&
                    usersList.pagination.pageCount >
                      usersList.pagination.currentPage + 2 && (
                      <li>
                        <Button className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          ...
                        </Button>
                      </li>
                    )}

                  {usersList.pagination.currentPage !==
                    usersList.pagination.pageCount &&
                    usersList.pagination.pageCount >
                      usersList.pagination.currentPage + 2 && (
                      <li>
                        <Button
                          onClick={() => {
                            setToSkip(usersList.pagination.pageCount)
                            // mutate(
                            //   `/api/settings/account/users-and-teams/users`
                            // )
                            refetchUsersList()
                          }}
                          className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {usersList.pagination.pageCount}
                        </Button>
                      </li>
                    )}

                  {usersList.pagination.currentPage !==
                    usersList.pagination.pageCount &&
                    usersList.pagination.pageCount >
                      usersList.pagination.currentPage + 1 && (
                      <li>
                        <Button
                          onClick={() => {
                            setToSkip(usersList.pagination.currentPage + 1)
                            // mutate(
                            //   `/api/settings/account/users-and-teams/users`
                            // )
                            refetchUsersList()
                          }}
                          className="block p-0 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </li>
                    )}
                </ul>
              </nav>
            </div>
          )}

          <Modal
            show={openModalActionsUsers}
            size="sm"
            popup={true}
            onClose={() => setOpenModalActionsUsers(!openModalActionsUsers)}
          >
            <Modal.Header className="text-xl font-medium text-gray-900 dark:text-white !px-6 !py-3 bg-gray-100 items-center dark:bg-gray-800">
              Edit user
            </Modal.Header>
            <Modal.Body className="px-6 pb-4 pt-4 sm:pt-4 sm:pb-6 lg:px-8 xl:pb-8">
              <ul className="flex flex-col">
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Edit
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    View user permission history
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Copy permissions to new users
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Assign Permission Set
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Edit team
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Edit preset
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Reset password
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Copy invite link
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Resend invite email
                  </Button>
                </li>
              </ul>
              <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
              <ul className="flex flex-col gap-1">
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Log in as user
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Make Super Admin
                  </Button>
                </li>
              </ul>
              <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
              <ul className="flex flex-col gap-1">
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Deactivate user
                  </Button>
                </li>
                <li className="">
                  <Button
                    color="gray"
                    className="w-full border-none !text-left !justify-start font-normal"
                  >
                    Remove from account
                  </Button>
                </li>
              </ul>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  )
}
