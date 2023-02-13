import { createTeamsDrawerSettings, getTeamsDrawerSettings, updateTeamsDrawerSettings } from "@/lib/api";
import { unstable_getServerSession } from "next-auth/next";

import { requestWrapper } from "../../../auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

/* Api endpoint to CRUD TeamsDrawer Settings */
export default async function teamsSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const opts = requestWrapper(req, res);
  const session = await unstable_getServerSession(req, res, opts[2]);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getTeamsDrawerSettings(req, res, session);
    case HttpMethod.POST:
      return createTeamsDrawerSettings(req, res, session);    
    case HttpMethod.PUT:
      return updateTeamsDrawerSettings(req, res, session);
    default:
      res.setHeader("Allow", [HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
