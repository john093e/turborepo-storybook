import { createSite, deleteSite, getSite, updateSite } from "@lib/api";
import { getServerSession } from "next-auth/next";

// import { requestWrapper } from "./auth/[...nextauth]";
import { requestWrapper } from "@twol/auth";
import { HttpMethod } from "@types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function site(req: NextApiRequest, res: NextApiResponse) {
  const opts = requestWrapper(req, res);  
  const session = await getServerSession(req, res, opts[2]);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getSite(req, res, session);
    case HttpMethod.POST:
      return createSite(req, res);
    case HttpMethod.DELETE:
      return deleteSite(req, res);
    case HttpMethod.PUT:
      return updateSite(req, res);
    default:
      res.setHeader("Allow", [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.DELETE,
        HttpMethod.PUT,
      ]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
