import { createUserSettings, deleteUserSettings, getUserSettings, updateUserSettings } from "@lib/api";
import { getServerSession } from "next-auth/next";

// import { requestWrapper } from "../../auth/[...nextauth]";
import { requestWrapper } from "@twol/auth";
import { HttpMethod } from "@types";

import type { NextApiRequest, NextApiResponse } from "next";

/* Api endpoint to CRUD User Settings */
export default async function userSettings(req: NextApiRequest, res: NextApiResponse) {
  const opts = requestWrapper(req, res);  
  const session = await getServerSession(req, res, opts[2]);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getUserSettings(req, res, session);
    // case HttpMethod.POST:
    //   return createUserSettings(req, res);
    // case HttpMethod.DELETE:
    //   return deleteUserSettings(req, res);
    case HttpMethod.PUT:      
      return updateUserSettings(req, res, session);
    default:
      res.setHeader("Allow", [
        HttpMethod.GET,
        // HttpMethod.POST,
        // HttpMethod.DELETE,
        HttpMethod.PUT,
      ]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
