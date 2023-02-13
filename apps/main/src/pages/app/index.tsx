import Layout from "@components/app/layout/Layout";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@lib/fetcher";

import type { Site } from "@prisma/client";

export default function AppIndex() {  
  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: sites } = useSWR<Array<Site>>(
    sessionId && `/api/site`,
    fetcher
  );
  return (
    <Layout>
      <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">


      </div>
    </Layout>
  );
}
