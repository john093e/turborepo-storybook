import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import LoadingDots from '@components/common/loading-dots/LoadingDots'
import toast from 'react-hot-toast'

import { Badge, Button, Tooltip } from 'flowbite-react'
import { UilInfo } from '@iconscout/react-unicons'
import Select from '@components/common/forms/select/Select'

import { usePrevious } from '@lib/hooks/use-previous'

import { api, type RouterOutputs } from '@lib/utils/api'

type TeamsPreferencesFormValues = {
  name: string
  parentTeamId: string
  users: Array<{
    id: string
  }>
}

interface PropTeamsDrawer {
  userId: string
  id: string | null
  closeProcess: () => void
  finishProcess: () => void
}

export default function TeamsDrawer({
  userId,
  id,
  closeProcess,
  finishProcess,
}: PropTeamsDrawer) {
  const [showDrawer, setShowDrawer] = useState<boolean>(true)

  const handleCloseDrawer = () => {
    setShowDrawer(false)
    setTimeout(() => {
      closeProcess()
    }, 100)
  }

  const router = useRouter()

  // Get data for Form
  const {
    data: teamsSettings,
    isLoading: isLoadingTeamsSettings,
    refetch: refetchTeamsSettings,
  } = api.adminSettingsAccountUsersAndTeamsTeams.getTeamsDrawerSettings.useQuery(
    {
      userId: userId,
      id: id,
    },
    {
      retry: 1,
      onError: () => router.push('/'),
      refetchOnWindowFocus: true, // on come back to page
      refetchInterval: false, // ?
      refetchIntervalInBackground: false, // ?
      refetchOnReconnect: true, // computer come out of standby (reconnect to web)
      onSuccess: (data) => {
        if (
          data &&
          !dataInFormUpdated &&
          previousTeamsSettings?.teamsSettings !== data
        ) {
          if (
            optionsParentTeam.length === 0 &&
            optionsTeamMember.length === 0
          ) {
            //parent Team list
            let optionsParentTeamsArray: Array<{
              value: string
              label: string
              disabled?: boolean
            }> = []
            data.teams.forEach((team) => {
              optionsParentTeamsArray.push({
                value: team.id,
                label: team.name,
                disabled: team.parentTeamId
                  ? team.parentTeamId === id
                    ? true
                    : false
                  : false,
              })
              setOptionsParentTeam(optionsParentTeamsArray)
            })

            //Team Member list
            let optionsTeamMemberArray: Array<{
              value: string
              label: string
              disabled?: boolean
            }> = []
            data.users.forEach((user) => {
              optionsTeamMemberArray.push({
                value: user.id,
                label:
                  user?.user?.firstname && user?.user?.lastname
                    ? user.user.firstname + ' ' + user.user.lastname
                    : user?.user?.email!,
                disabled: user.teamsId ? true : false,
              })
              setOptionsTeamMember(optionsTeamMemberArray)
            })

            //if update team set data in the form
            if (id && id !== null && id !== undefined) {
              if (data.team && data.team[0] !== undefined) {
                if (data.team[0].name) {
                  setValueTeamsPreferences('name', data.team[0].name, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                  // set users
                  let usersArray: Array<{ id: string }> = []
                  let usersArrayTeamMember: Array<{
                    value: string
                    label: string
                  }> = []
                  data.team[0].B2E.forEach((user: any) => {
                    usersArray.push({ id: user.id })
                    usersArrayTeamMember.push({
                      value: user.id,
                      label:
                        user.user.firstname && user.user.lastname
                          ? user.user.firstname + ' ' + user.user.lastname
                          : user.user.email,
                    })
                  })
                  setValueTeamsPreferences('users', usersArray)
                  setTeamMember(usersArrayTeamMember)
                  // set parentTeam
                  if (data.team[0].parentTeam) {
                    setValueTeamsPreferences(
                      'parentTeamId',
                      data.team[0].parentTeam.id
                    )
                    setParentTeam({
                      value: data.team[0].parentTeam.id,
                      label: data.team[0].parentTeam.name,
                    })
                  }
                }
              }
            }

            setDataInFormUpdated(!dataInFormUpdated)
          }
        }
      },
    }
  )
  const previousTeamsSettings = usePrevious({ teamsSettings })
  const [saving, setSaving] = useState<boolean>(false)
  const [dataInFormUpdated, setDataInFormUpdated] = useState<boolean>(false)
  const [teamsDrawerError, setTeamsDrawerError] = useState<string | null>(null)

  // Form
  const {
    register: registerTeamsPreferences,
    reset: resetTeamsPreferences,
    handleSubmit: handleSubmitTeamsPreferences,
    setValue: setValueTeamsPreferences,
    formState: formStateTeamsPreferences,
  } = useForm<TeamsPreferencesFormValues>({
    defaultValues: {
      name: '',
      parentTeamId: '',
      users: [],
    },
  })

  // Parent Team
  const [optionsParentTeam, setOptionsParentTeam] = useState<
    Array<{ value: string; label: string }>
  >([])
  const [parentTeam, setParentTeam] = useState<{
    value: string
    label: string
  } | null>(null)
  const handleChangeParentTeam = (value: any) => {
    if (value) {
      setParentTeam(value)
      setValueTeamsPreferences('parentTeamId', value.value, {
        shouldDirty: true,
      })
    } else {
      setValueTeamsPreferences('parentTeamId', '', {
        shouldDirty: false,
      })
    }
  }

  // Users
  const [optionsTeamMember, setOptionsTeamMember] = useState<
    Array<{ value: string; label: string }>
  >([])
  const [teamMember, setTeamMember] = useState<
    Array<{ value: string; label: string }>
  >([])
  const handleChangeTeamMember = (value: any) => {
    if (value) {
      setTeamMember(value)
      let usersArray: Array<{ id: string }> = []
      value.forEach((user: any) => {
        usersArray.push({ id: user.value })
      })
      setValueTeamsPreferences('users', usersArray, {
        shouldDirty: true,
      })
    } else {
      setTeamMember(value)
      setValueTeamsPreferences('users', [], {
        shouldDirty: false,
      })
    }
  }

  // saving function
  const {
    mutate: createTeamsDrawerSettings,
    isLoading: isLoadingCreateTeamsDrawerSettings,
  } =
    api.adminSettingsAccountUsersAndTeamsTeams.createTeamsDrawerSettings.useMutation(
      {
        async onSuccess(data) {
          setSaving(false)
          setTeamsDrawerError(null)
          finishProcess()
          toast.success(`Teams created`, {
            position: 'top-right',
          })
        },
        onError(error) {
          setSaving(false)
          setTeamsDrawerError('An error occured')
          toast.error(error.message, {
            position: 'top-right',
          })
        },
      }
    )
  const {
    mutate: updateTeamsDrawerSettings,
    isLoading: isLoadingUpdateTeamsDrawerSettings,
  } =
    api.adminSettingsAccountUsersAndTeamsTeams.updateTeamsDrawerSettings.useMutation(
      {
        async onSuccess(data) {
          setSaving(false)
          setTeamsDrawerError(null)
          finishProcess()
          toast.success(`Teams updated`, {
            position: 'top-right',
          })
        },
        onError(error) {
          setSaving(false)
          setTeamsDrawerError('An error occured')
          toast.error(error.message, {
            position: 'top-right',
          })
        },
      }
    )
  const onSubmit = handleSubmitTeamsPreferences(async (data) => {
    try {
      setSaving(true)
      if (id) {
        updateTeamsDrawerSettings({
          userId: userId,
          id: id,
          name: data.name,
          parentTeamId: data.parentTeamId,
          users: data.users,
        })
      } else {
        createTeamsDrawerSettings({
          userId: userId,
          name: data.name,
          parentTeamId: data.parentTeamId,
          users: data.users,
        })
      }
    } catch (error) {
      setSaving(false)
      setTeamsDrawerError('An error occured')
    }
  })

  return (
    <>
      <div
        id="drawer-create-teams-default"
        className={`fixed top-0 right-0 z-40 w-full h-screen flex flex-col max-w-xs overflow-y-auto transition-transform bg-white dark:bg-gray-800 ${
          showDrawer ? 'transform-none' : 'translate-x-full'
        }`}
        tabIndex={-1}
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        {/* Header */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 flex p-4">
          <h5
            id="drawer-label"
            className="inline-flex items-center text-sm font-semibold text-gray-500 uppercase dark:text-gray-100"
          >
            {id ? 'Update team' : 'Create team'}
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
        <div className="h-full w-full flex flex-col">
          {!dataInFormUpdated ? (
            <div className="h-full w-full flex flex-col items-center justify-center">
              <LoadingDots color="#000" />{' '}
            </div>
          ) : (
            <form action="#" onSubmit={onSubmit}>
              <div className="space-y-4 p-4 pt-10">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Team name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...registerTeamsPreferences('name', {
                      required: true,
                      pattern:
                        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(([',. -][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ])?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]*)*$/,
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Team name"
                  />
                </div>

                <div>
                  <div className="flex gap-4">
                    <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Parent team
                    </h3>
                    <Tooltip
                      className="text-xs font-light max-w-xs shadow"
                      placement="top"
                      content="The parent team is the team directly above this team in your organizational structure. It has access to all contacts, companies, deals, tasks, properties, etc. associated with the child team."
                    >
                      <Badge size="xs" color="gray" icon={UilInfo} />
                    </Tooltip>
                  </div>

                  <Select
                    value={parentTeam}
                    isSearchable
                    placeholder="No team assigned"
                    onChange={handleChangeParentTeam}
                    options={optionsParentTeam}
                  />
                </div>

                <hr className="!my-10 h-px bg-gray-200 border-0 dark:bg-gray-700" />

                <div>
                  <div className="flex gap-4">
                    <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Team members
                    </h3>
                    <Tooltip
                      className="text-xs font-light max-w-xs shadow"
                      placement="top"
                      content="Users shown below can be assigned or unassigned to this team as their primary team. A user can only belong to one primary team at a time."
                    >
                      <Badge size="xs" color="gray" icon={UilInfo} />
                    </Tooltip>
                  </div>

                  <Select
                    value={teamMember}
                    isSearchable
                    isMultiple
                    placeholder="No members assigned"
                    onChange={handleChangeTeamMember}
                    options={optionsTeamMember}
                  />
                </div>

                <div>
                  <div className="flex gap-4">
                    <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Primary team members
                    </h3>
                    <Tooltip
                      className="text-xs font-light max-w-xs shadow"
                      placement="top"
                      content="Users shown below can be assigned or unassigned to this team as their primary team. A user can only belong to one primary team at a time."
                    >
                      <Badge size="xs" color="gray" icon={UilInfo} />
                    </Tooltip>
                  </div>
                  {teamMember
                    ? teamMember.map((teamMember, index) => {
                        return (
                          <div key={index}>
                            <h2>{teamMember.label}</h2>
                          </div>
                        )
                      })
                    : null}
                </div>
                {teamsDrawerError ? (
                  <div className="mt-1 text-sm font-normal text-red-700 dark:text-red-200">
                    <p>{teamsDrawerError}</p>
                  </div>
                ) : null}
              </div>
              <div className="bottom-0 left-0 flex justify-center w-full bg-gray-200 dark:bg-gray-800 space-x-4 p-4 absolute">
                <Button
                  type="submit"
                  color="dark"
                  disabled={saving || !formStateTeamsPreferences.isValid}
                  className="w-full justify-center h-full font-medium text-sm text-center"
                >
                  {!saving ? (
                    id ? (
                      'Update'
                    ) : (
                      'Create'
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
                  data-drawer-dismiss="drawer-create-teams-default"
                  aria-controls="drawer-create-teams-default"
                  onClick={handleCloseDrawer}
                  className="inline-flex w-full justify-center items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
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
            </form>
          )}
        </div>
      </div>
      {/* overlay */}
      <div
        className="w-full h-full fixed z-30 bg-black opacity-40 top-0 left-0 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 border border-gray-200"
        onClick={saving ? () => null : handleCloseDrawer}
      ></div>
    </>
  )
}
