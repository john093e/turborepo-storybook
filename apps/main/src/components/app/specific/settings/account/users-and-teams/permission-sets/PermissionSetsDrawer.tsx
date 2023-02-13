import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import PermissionDrawerContent from "@components/app/specific/settings/account/users-and-teams/permission-sets/PermissionDrawerContent";

import LoadingDots from "@components/common/loading-dots/LoadingDots";

import { HttpMethod } from "@types";

import {
  PermissionProvider,
} from "@contexts/app/specific/settings/account/users-and-teams/permission-sets/PermissionContext";


interface PropPermissionDrawer {
  userId: string;
  id: string | null;
  closeProcess: () => void;
  finishProcess: () => void;
}

export default function PermissionSetsDrawer({
  userId,
  id,
  closeProcess,
  finishProcess,
}: PropPermissionDrawer) {

  const router = useRouter();

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [fetchRequested, setFetchRequested] = useState<boolean>(id ? false : true);
  const [data, setData] = useState<any | null>(null);

  async function getPermissionData() {
    try {
      const res = await fetch(`/api/settings/account/users-and-teams/permission-sets-drawer?userId=${userId}&permissionSetId=${id}`, {
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const dataFetched = await res.json();        
        if(dataFetched){
          setData(dataFetched[0]);
          setIsFetching(false);
        } else {
          alert("Server Failed to fetch Permission Data 2");
        }

      } else {
        alert("Server Failed to fetch Permission Data 2");
      }
    } catch (error: any) {
      alert("Server Failed to fetch Permission Data");
      console.log(error);
      setIsFetching(false);
    }
  }

  useEffect(() => {
    if (!fetchRequested) {
      console.log("getdata");
      getPermissionData();
      setFetchRequested(true);
    }
  }, [fetchRequested, getPermissionData]);


  return (
    <>
      { ((id === null) || (id && !isFetching && fetchRequested && data)) && 
        <PermissionProvider data={data} id={id} userId={userId} finishProcess={finishProcess}>
          <PermissionDrawerContent closeProcess={closeProcess} />
        </PermissionProvider>
      }
    </>
  );
}
