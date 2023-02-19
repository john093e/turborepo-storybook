import dynamic from 'next/dynamic'

import { useRouter } from 'next/router'

import { useContext, useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { Button, Checkbox, Table, TextInput } from 'flowbite-react'

import {
  UilSearchAlt,
  UilSortAmountDown,
  UilSortAmountUp,
} from '@iconscout/react-unicons'

const PermissionSetsDrawer = dynamic(
  () =>
    import(
      '@components/app/specific/settings/account/users-and-teams/permission-sets/PermissionSetsDrawer'
    ),
  {
    ssr: false,
  }
)
const PermissionSetsDeleteModal = dynamic(
  () =>
    import(
      '@components/app/specific/settings/account/users-and-teams/permission-sets/PermissionSetsDeleteModal'
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
export default function PermissionSetsSet({ userId }: PropForm) {
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

  // get all Permission sets from this account
  const {
    data: permissionSetsList,
    isLoading: isLoadingPermissionSetsList,
    refetch: refetchPermissionSetsList,
  } = api.adminSettingsAccountUsersAndTeamsPermissionSets.getPermissionSetsSettings.useQuery(
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
  // debounce searcch term
  useEffect(() => {
    if (debouncedSearchTerm !== null || debouncedSearchTerm !== undefined) {
      setToTake(25)
      setToSkip(1)
      setToOrderBy('')
      setToOrderByStartWith('')
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

  const { setRootDrawer, resetRootDrawer, setRootModal, resetRootModal } =
    useContext(AppLoggedInContext)

  const finishProcessDrawer = () => {
    resetRootDrawer()
    refetchPermissionSetsList()
  }

  //Create a PermissionSets
  const handleCreateNewPermissionSets = () => {
    setRootDrawer(
      <PermissionSetsDrawer
        closeProcess={resetRootDrawer}
        finishProcess={finishProcessDrawer}
        userId={userId}
        id={null}
      />
    )
  }

  // Edit a PermissionSets
  const handleEditPermissionSets = (id: string) => {
    setRootDrawer(
      <PermissionSetsDrawer
        closeProcess={resetRootDrawer}
        finishProcess={finishProcessDrawer}
        userId={userId}
        id={id}
      />
    )
  }

  const finishProcessModal = () => {
    resetRootModal()
    refetchPermissionSetsList()
  }

  //Delete a PermissionSets
  const handleDeletePermissionSets = (name: string, id: string) => {
    setRootModal(
      <PermissionSetsDeleteModal
        closeProcess={resetRootModal}
        finishProcess={finishProcessModal}
        name={name}
        id={id}
        userId={userId}
      />
    )
  }

  return (
    <>
      <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
        Set pre-defined Permission Sets for users and to define how your team
        accesses T-WOL.
      </p>
      <hr className="my-4 mb-10 h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="w-full">
        <div className="flex flex-wrap justify-between flex-col-reverse xs:flex-row">
          <div className="w-full mt-4 max-w-[16.5em] xs:mt-0 flex items-center gap-4 flex-col xs:flex-row">
            <div className="w-full xs:flex">
              <label htmlFor="input-group-search" className="sr-only">
                Chercher un set de permissions
              </label>
              <TextInput
                id="input-group-search"
                type="text"
                className="w-full"
                value={searchTerm}
                onInput={(e) => {
                  setSearchTerm(e.currentTarget.value)
                }}
                placeholder="Chercher un set de permissions"
                required={true}
                icon={UilSearchAlt}
                sizing="md"
              />
            </div>
          </div>

          <div className="flex items-end xs:items-center justify-start xs:justify-end gap-4 w-full xs:w-auto flex-col-reverse xs:flex-row">
            <Button
              color="dark"
              onClick={() => handleCreateNewPermissionSets()}
            >
              Create permission set
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
                  (toOrderBy === 'name'
                    ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500'
                    : 'rounded-none') +
                  ' cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                }
                onClick={() => handleOrderBy('name')}
              >
                <span className="flex w-full items-center gap-2">
                  Name{' '}
                  {toOrderBy === 'name' ? (
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
              <Table.HeadCell className="rounded-none cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600">
                <span className="flex w-full items-center gap-2">Access </span>
              </Table.HeadCell>
              <Table.HeadCell
                className={
                  (toOrderBy === 'users'
                    ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500'
                    : 'rounded-none') +
                  ' cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                }
                onClick={() => handleOrderBy('users')}
              >
                <span className="flex w-full items-center gap-2">
                  Users{' '}
                  {toOrderBy === 'users' ? (
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
            </Table.Head>
            <Table.Body className="divide-y">
              {permissionSetsList ? (
                permissionSetsList.data.length > 0 ? (
                  permissionSetsList.data.map((permissionSet, key) => (
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
                                <div className="text-base py-2 font-semibold w-full relative truncate">
                                  <Button size="sm" className="inlineButton">
                                    {permissionSet.name}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="hidden group-hover:flex order-3 sr-only group-hover:not-sr-only gap-2">
                            <Button
                              color="dark"
                              size="xs"
                              disabled={!permissionSet.editable}
                              onClick={() =>
                                handleEditPermissionSets(permissionSet.id)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              color="dark"
                              size="xs"
                              disabled={!permissionSet.editable}
                              onClick={() =>
                                handleDeletePermissionSets(
                                  permissionSet.name!,
                                  permissionSet.id
                                )
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[320px]">
                        <div className="flex flex-col">
                          <div>
                            <ul className="flex flex-row gap-2">
                              {permissionSet.access.SuperAdmin && (
                                <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[length:1px_60%] pl-2 last:pr-0">
                                  Super Admin
                                </li>
                              )}
                              {permissionSet.access.SuperAdmin &&
                                permissionSet.access.SalesProfessional && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Sales Professional
                                  </li>
                                )}
                              {!permissionSet.access.SuperAdmin && (
                                <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-no-repeat  bg-[length:1px_60%] pl-2 last:pr-0">
                                  Contacts
                                </li>
                              )}
                              {!permissionSet.access.SuperAdmin &&
                                permissionSet.access.Marketing && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Marketing
                                  </li>
                                )}
                              {!permissionSet.access.SuperAdmin &&
                                permissionSet.access.Sales && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Sales
                                  </li>
                                )}
                              {!permissionSet.access.SuperAdmin &&
                                permissionSet.access.Service && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Service
                                  </li>
                                )}
                              {!permissionSet.access.SuperAdmin &&
                                permissionSet.access.Reports && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Reports
                                  </li>
                                )}
                              {!permissionSet.access.SuperAdmin &&
                                permissionSet.access.Account && (
                                  <li className="text-xs font-normal first:bg-none first:bg-no-repeat first:pl-0 bg-left bg-no-repeat bg-[linear-gradient(180deg,#cbd6e2,#cbd6e2)] bg-[length:1px_60%] pl-2 last:pr-0">
                                    Account
                                  </li>
                                )}
                            </ul>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[150px]">
                        <span>{permissionSet.users}</span>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 group">
                    <Table.Cell className="!p-4">
                      <Checkbox />
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words py-4 px-6 text-gray-900 dark:text-white min-w-[280px]">
                      <p className="text-base py-2 font-medium w-full relative truncate">
                        No permission sets found
                      </p>
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[320px]">
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
                              <div className="text-base py-2 font-semibold w-full relative truncate flex gap-2 h-4 mb-2">
                                <span className="w-14 h-4 inline-flex rounded-md bg-gray-300 animate-pulse" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="align-middle break-words items-center py-4 px-6 text-gray-900 dark:text-white min-w-[320px]">
                      <div className="flex flex-col">
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
                      <span className="w-10 h-4 block rounded-md bg-gray-300 animate-pulse" />
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
          {permissionSetsList && (
            <div className="flex items-center w-full">
              <nav
                className="flex w-full justify-between items-center pt-4"
                aria-label="Table navigation"
              >
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Showing{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {permissionSetsList.pagination.from}-
                    {permissionSetsList.pagination.to}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {permissionSetsList.pagination.total}
                  </span>
                </span>
                <ul className="inline-flex items-center -space-x-px">
                  {permissionSetsList.pagination.currentPage > 1 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(
                            permissionSetsList.pagination.currentPage - 1
                          )
                          refetchPermissionSetsList()
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
                  {permissionSetsList.pagination.currentPage > 4 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(1)
                          refetchPermissionSetsList()
                        }}
                        className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        1
                      </Button>
                    </li>
                  )}
                  {permissionSetsList.pagination.currentPage > 4 && (
                    <li>
                      <Button className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        ...
                      </Button>
                    </li>
                  )}
                  {permissionSetsList.pagination.currentPage > 3 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(
                            permissionSetsList.pagination.currentPage - 3
                          )
                          refetchPermissionSetsList()
                        }}
                        className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        {permissionSetsList.pagination.currentPage - 3}
                      </Button>
                    </li>
                  )}
                  {permissionSetsList.pagination.currentPage > 2 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(
                            permissionSetsList.pagination.currentPage - 2
                          )
                          refetchPermissionSetsList()
                        }}
                        className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        {permissionSetsList.pagination.currentPage - 2}
                      </Button>
                    </li>
                  )}
                  {permissionSetsList.pagination.currentPage > 1 && (
                    <li>
                      <Button
                        onClick={() => {
                          setToSkip(
                            permissionSetsList.pagination.currentPage - 1
                          )
                          refetchPermissionSetsList()
                        }}
                        className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        {permissionSetsList.pagination.currentPage - 1}
                      </Button>
                    </li>
                  )}
                  <li>
                    <Button
                      aria-current="page"
                      className={
                        (permissionSetsList.pagination.currentPage === 1 &&
                        permissionSetsList.pagination.currentPage ===
                          permissionSetsList.pagination.pageCount
                          ? 'rounded-md '
                          : permissionSetsList.pagination.currentPage === 1 &&
                            permissionSetsList.pagination.currentPage <
                              permissionSetsList.pagination.pageCount
                          ? 'rounded-l-md'
                          : permissionSetsList.pagination.currentPage > 1 &&
                            permissionSetsList.pagination.currentPage <
                              permissionSetsList.pagination.pageCount
                          ? 'rounded-none'
                          : permissionSetsList.pagination.currentPage > 1 &&
                            permissionSetsList.pagination.currentPage ===
                              permissionSetsList.pagination.pageCount
                          ? 'rounded-r-md'
                          : 'rounded-none') +
                        ' p-0 text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                      }
                    >
                      {permissionSetsList.pagination.currentPage}
                    </Button>
                  </li>
                  {permissionSetsList.pagination.currentPage > 1 &&
                    permissionSetsList.pagination.pageCount >
                      permissionSetsList.pagination.currentPage && (
                      <li>
                        <Button
                          onClick={() => {
                            setToSkip(
                              permissionSetsList.pagination.currentPage + 1
                            )
                            refetchPermissionSetsList()
                          }}
                          className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {permissionSetsList.pagination.currentPage + 1}
                        </Button>
                      </li>
                    )}
                  {permissionSetsList.pagination.currentPage > 1 &&
                    permissionSetsList.pagination.pageCount >
                      permissionSetsList.pagination.currentPage + 1 && (
                      <li>
                        <Button
                          onClick={() => {
                            setToSkip(
                              permissionSetsList.pagination.currentPage + 2
                            )
                            refetchPermissionSetsList()
                          }}
                          className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {permissionSetsList.pagination.currentPage + 2}
                        </Button>
                      </li>
                    )}
                  {permissionSetsList.pagination.currentPage > 1 &&
                    permissionSetsList.pagination.pageCount >
                      permissionSetsList.pagination.currentPage + 2 && (
                      <li>
                        <Button className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          ...
                        </Button>
                      </li>
                    )}

                  {permissionSetsList.pagination.currentPage !==
                    permissionSetsList.pagination.pageCount &&
                    permissionSetsList.pagination.pageCount >
                      permissionSetsList.pagination.currentPage + 2 && (
                      <li>
                        <Button
                          onClick={() => {
                            setToSkip(permissionSetsList.pagination.pageCount)
                            refetchPermissionSetsList()
                          }}
                          className="rounded-none p-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {permissionSetsList.pagination.pageCount}
                        </Button>
                      </li>
                    )}

                  {permissionSetsList.pagination.currentPage !==
                    permissionSetsList.pagination.pageCount &&
                    permissionSetsList.pagination.pageCount >
                      permissionSetsList.pagination.currentPage + 1 && (
                      <li>
                        <Button
                          onClick={() => {
                            setToSkip(
                              permissionSetsList.pagination.currentPage + 1
                            )
                            refetchPermissionSetsList()
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
        </div>
      </div>
    </>
  )
}
