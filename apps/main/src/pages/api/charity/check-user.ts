import prisma from "@lib/prisma";
import { HttpMethod } from "@types";

import type { NextApiRequest, NextApiResponse } from "next";

/*
 * Note: This endpoint is to check if a charity still has its activate configured correctly.
 */

export default async function checkUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userEmail = false } = req.query;

  if (Array.isArray(userEmail))
    return res
      .status(400)
      .end("Mauvaise requête. Le paramètre email ne peut pas être un tableau.");

  try {
    if (userEmail && userEmail.length !== 0) {
      //validate Email
      if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(userEmail)) {
        const available = "email invalid";
        return res.status(200).json(available);
      }
      const uEmail = userEmail as string;

      const data = await prisma.user.findUnique({
        where: {
          email: uEmail,
        },
        select: {
          password: true,
          firstname: true,
          lastname: true,
          marketingAccept: true,
        },
      });

      if (data === null && uEmail.length !== 0) {
        const available = "unknown";
        return res.status(200).json(available);
      } else if (data !== null) {
        let passwordSet: boolean = false,
          firstnameSet: boolean = false,
          lastnameSet: boolean = false,
          marketingAccept: boolean | null;
        if (data.password !== null) {
          passwordSet = true;
        }
        if (data.firstname !== null) {
          firstnameSet = true;
        }
        if (data.lastname !== null) {
          lastnameSet = true;
        }
        marketingAccept = data.marketingAccept;
        const available = {
          passwordSet,
          firstnameSet,
          lastnameSet,
          marketingAccept,
        };
        return res.status(200).json(available);
      } else {
        const available = "error";
        return res.status(200).json(available);
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
