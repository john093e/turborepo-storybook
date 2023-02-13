import { createUsersSettings, getUsersSettings, updateUsersSettings } from "@/lib/api";
import { unstable_getServerSession } from "next-auth/next";

import { requestWrapper } from "../../../auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

/* Api endpoint to CRUD Account Settings */
export default async function usersSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const opts = requestWrapper(req, res);
  const session = await unstable_getServerSession(req, res, opts[2]);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getUsersSettings(req, res, session);
    case HttpMethod.POST:
      return createUsersSettings(req, res, session);    
    case HttpMethod.PUT:
      return updateUsersSettings(req, res, session);
    default:
      res.setHeader("Allow", [HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
