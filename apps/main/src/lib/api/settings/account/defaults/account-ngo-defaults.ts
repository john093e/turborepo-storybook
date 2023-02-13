import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ONG } from ".prisma/client";
import type { Session } from "next-auth";

/**
 * Get Account NGO Settings
 *
 * Fetches & returns a single user available depending
 * on a `userId` query parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getAccountNGOSettings(
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
          const settingsNGOAccount = await prisma.oNG.findFirst({
            where: {
              id: fetchOngId.B2E[0].ongId,
            },
            select: {
              name_set: true,
              domain_name: true,
              address_set: true,
              address_line_2_set: true,
              address_city_set: true,
              address_state_set: true,
              address_postcode_set: true,
              address_country_set: true,
            },
          });
          return res.status(200).json(settingsNGOAccount);
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
 * Update Account NGO Settings
 *
 * Updates a ONG & its users settings using a collection of provided
 * query parameters. These include the following:
 *  - name_set
 *  - domain_name
 *  - address_set
 *  - address_line_2_set
 *  - address_city_set
 *  - address_state_set
 *  - address_postcode_set
 *  - address_country_set
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function updateAccountNGOSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<ONG>> {
if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  const data = JSON.parse(req.body);
  //TODO : validate data
  //  - name_set
  //  - domain_name
  //  - address_set
  //  - address_line_2_set
  //  - address_city_set
  //  - address_state_set
  //  - address_postcode_set
  //  - address_country_set
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
            name_set: data.name_set,
            domain_name: data.domain_name,
            address_set: data.address_set,
            address_line_2_set: data.address_line_2_set,
            address_city_set: data.address_city_set,
            address_state_set: data.address_state_set,
            address_postcode_set: Number(data.address_postcode_set),
            address_country_set: data.address_country_set,
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