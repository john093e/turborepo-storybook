import { createONG, deleteONG, getONG, updateONG } from "@/lib/api";
import { unstable_getServerSession } from "next-auth/next";

import { requestWrapper } from "./auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function ong(req: NextApiRequest, res: NextApiResponse) {
  const opts = requestWrapper(req, res);  
  const session = await unstable_getServerSession(req, res, opts[2]);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getONG(req, res, session);
    case HttpMethod.POST:
      return createONG(req, res);
    case HttpMethod.DELETE:
      return deleteONG(req, res);
    case HttpMethod.PUT:
      return updateONG(req, res);
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
