import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import PermissionDrawerContent from '@components/app/specific/settings/account/users-and-teams/permission-sets/PermissionDrawerContent'

import { PermissionProvider } from '@contexts/app/specific/settings/account/users-and-teams/permission-sets/PermissionContext'

import { api, type RouterOutputs } from '@lib/utils/api'

interface PropPermissionDrawer {
  userId: string
  id: string | null
  closeProcess: () => void
  finishProcess: () => void
}

export default function PermissionSetsDrawer({
  userId,
  id,
  closeProcess,
  finishProcess,
}: PropPermissionDrawer) {
  const router = useRouter()

  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [fetchRequested, setFetchRequested] = useState<boolean>(
    id ? false : true
  )
  const [data, setData] = useState<any | null>(null)

  const {
    mutate: getPermissionSetsDrawerSettings,
    isLoading: isLoadingGetPermissionSetsDrawerSettings,
  } =
    api.adminSettingsAccountUsersAndTeamsPermissionSets.getPermissionSetsDrawerSettings.useMutation(
      {
        onSuccess(data) {
          setData(data[0])
          setIsFetching(false)
        },
        onError(error) {
          setIsFetching(false)
          toast.error(error.message, {
            position: 'top-right',
          })
        },
      }
    )
    
  async function getPermissionData() {
    if (id !== null) {
      getPermissionSetsDrawerSettings({
        userId: userId,
        permissionSetId: id,
      })
    }
  }

  useEffect(() => {
    if (!fetchRequested) {
      console.log('getdata')
      getPermissionData()
      setFetchRequested(true)
    }
  }, [fetchRequested, getPermissionData])

  return (
    <>
      {(id === null || (id && !isFetching && fetchRequested && data)) && (
        <PermissionProvider
          data={data}
          id={id}
          userId={userId}
          finishProcess={finishProcess}
        >
          <PermissionDrawerContent closeProcess={closeProcess} />
        </PermissionProvider>
      )}
    </>
  )
}
