import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ONG } from ".prisma/client";
import type { Session } from "next-auth";

/**
 * Get Account Settings
 *
 * Fetches & returns a single account settings available depending
 * on a `userId` query parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getAccountSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<ONG> | (ONG | null)>> {
  const { userId } = req.query;
  // TODO validate data
  // userId
  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  try {
    if (userId) {
      const fetchOngId = await prisma.user.findFirst({
        where: {
          id: session.user.id,
        },
        select: {
          B2E: {
            where: {
              inUse: true,
            },
            select: {
              ongId: true,
            },
          },
        },
      });
      if (fetchOngId) {
        if (fetchOngId.B2E[0].ongId) {
          const settingsAccount = await prisma.oNG.findFirst({
            where: {
              id: fetchOngId.B2E[0].ongId,
            },
            select: {
              account_name: true,
              dateFormat: true,
              fiscalYear: true,
            },
          });
          return res.status(200).json(settingsAccount);
        }
        return res.status(500).end("Server failed to get Account ID");
      }
      return res.status(500).end("You don't have an account connected");
    }
    return res.status(500).end("Server failed to get user ID");
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Account Settings
 *
 * Updates an Account settings using a collection of provided
 * query parameters. These include the following:
 *  - account_name
 *  - dateFormat
 *  - fiscalYear
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function updateAccountSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<ONG>> {
  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  const data = JSON.parse(req.body);
  //TODO : validate data
  //  - account_name
  //  - dateFormat
  //  - fiscalYear
  try {
    const fetchOngId = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: {
        B2E: {
          where: {
            inUse: true,
          },
          select: {
            ongId: true,
          },
        },
      },
    });

    if (fetchOngId) {
      if (fetchOngId.B2E[0].ongId) {
        const response = await prisma.oNG.update({
          where: {
            id: fetchOngId.B2E[0].ongId,
          },
          data: {
            account_name: data.account_name,
            dateFormat: data.dateFormat,
            fiscalYear: data.fiscalYear,
          },
        });
        return res.status(200).json(response);
      }
      return res.status(500).end("Server failed to get Account ID");
    }
    return res.status(500).end("You don't have an account connected");
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
