import { activateONG } from "@lib/api";
import { HttpMethod } from "@types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function charity(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case HttpMethod.POST:
      return activateONG(req, res);
    default:
      res.setHeader("Allow", [HttpMethod.POST]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
