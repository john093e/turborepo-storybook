import cuid from "cuid";
import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ONG, B2E } from ".prisma/client";
import type { Session } from "next-auth";

import { hashPassword } from "@twol/utils/auth/passwords";

/**
 * Get Token
 *
 * Fetches & returns either a single or all Token available depending on
 * whether a `ongId` query parameter is provided. If not all Token are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getToken(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<B2E> | (B2E | null)>> {
  const { ongId } = req.query;

  if (Array.isArray(ongId))
    return res
      .status(400)
      .end("Bad request. ongId parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  try {
    if (ongId) {
      const settings = await prisma.b2E.findFirst({
        where: {
          ong: {
            id: ongId,
          },
          user: {
            id: session.user.id,
          },
        },
      });

      return res.status(200).json(settings);
    }

    const ongs = await prisma.b2E.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
    });

    return res.status(200).json(ongs);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Token
 *
 * Creates a new Token from a set of provided query parameters.
 * These include:
 *  - registered_name
 *  - registered_charity_number
 *  - registered_address
 *  - registered_postcode
 *  - registered_postcode_name
 *
 * Once created, the Token new `ongId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  ongId: string;
}>> {
  const {
    registered_name,
    registered_charity_number,
    registered_address,
    registered_postcode,
    registered_postcode_name,
  } = req.body;

  const given_registered_charity_number: string =
    req.body.registered_charity_number.replace(/\D/g, "");

  try {
    const response = await prisma.oNG.create({
      data: {
        registered_name: registered_name,
        registered_charity_number: given_registered_charity_number,
        registered_address: registered_address,
        registered_postcode: registered_postcode,
        registered_postcode_name: registered_postcode_name,
      },
    });

    return res.status(201).json({
      ongId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Token
 *
 * Deletes an Token from the database using a provided `ongId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse> {
  const { ongId } = req.query;

  if (Array.isArray(ongId))
    return res
      .status(400)
      .end("Bad request. ongId parameter cannot be an array.");

  try {
    await prisma.$transaction([
      prisma.post.deleteMany({
        where: {
          site: {
            ong: {
              id: ongId,
            },
          },
        },
      }),
      prisma.site.deleteMany({
        where: {
          ong: {
            id: ongId,
          },
        },
      }),
      prisma.oNG.delete({
        where: {
          id: ongId,
        },
      }),
    ]);

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update Token
 *
 * Updates a Token & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - activated
 *  - activated_at
 *  - activated_by
 *  - charity_number_set
 *  - name_set
 *  - address_set
 *  - postcode_set
 *  - postcode_name_set
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<ONG>> {
  const {
    activated,
    activated_at,
    activated_by,
    charity_number_set,
    name_set,
    address_set,
    address_postcode_set,
    postcode_name_set,
  } = req.body;

  const given_charity_number_set: string = req.body.charity_number_set.replace(
    /\D/g,
    ""
  );
  // const subdomain = sub.length > 0 ? sub : currentSubdomain;

  try {
    const response = await prisma.oNG.update({
      where: {
        charity_number_set: given_charity_number_set,
      },
      data: {
        activated,
        activated_at,
        activated_by,
        charity_number_set,
        name_set,
        address_set,
        address_postcode_set,
        postcode_name_set,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}










