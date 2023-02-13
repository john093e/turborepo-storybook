import {
  getTeamsSettings,
  updateTeamsSettings,
  deleteTeamsSettings,
} from "@lib/api";
import { getServerSession } from "next-auth/next";

// import { requestWrapper } from "../../../auth/[...nextauth]";
import { requestWrapper } from "@twol/auth";
import { HttpMethod } from "@types";

import type { NextApiRequest, NextApiResponse } from "next";

/* Api endpoint to CRUD Teams Settings */
export default async function teamsSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const opts = requestWrapper(req, res);
  const session = await getServerSession(req, res, opts[2]);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getTeamsSettings(req, res, session);
    case HttpMethod.PUT:
      return updateTeamsSettings(req, res, session);
    case HttpMethod.DELETE:
      return deleteTeamsSettings(req, res, session);
    default:
      res.setHeader("Allow", [
        HttpMethod.GET,
        HttpMethod.PUT,
        HttpMethod.DELETE,
      ]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
