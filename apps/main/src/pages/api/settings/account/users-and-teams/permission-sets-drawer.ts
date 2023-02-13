import { createPermissionSetsDrawerSettings, getPermissionSetsDrawerSettings, updatePermissionSetsDrawerSettings } from "@lib/api";
import { getServerSession } from "next-auth/next";

// import { requestWrapper } from "../../../auth/[...nextauth]";
import { requestWrapper } from "@twol/auth";
import { HttpMethod } from "@types";

import type { NextApiRequest, NextApiResponse } from "next";

/* Api endpoint to CRUD permissionSetsDrawer Settings */
export default async function permissionSetsDrawerSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const opts = requestWrapper(req, res);
  const session = await getServerSession(req, res, opts[2]);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getPermissionSetsDrawerSettings(req, res, session);
    case HttpMethod.POST:
      return createPermissionSetsDrawerSettings(req, res, session);    
    case HttpMethod.PUT:
      return updatePermissionSetsDrawerSettings(req, res, session);
    default:
      res.setHeader("Allow", [HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
