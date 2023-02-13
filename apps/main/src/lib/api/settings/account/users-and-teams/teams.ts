import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Teams } from ".prisma/client";
import type { Session } from "next-auth";

/**
 * Get Teams Settings
 *
 * Fetches & returns all users from an account available depending
 * on a `userId` for fetching ong and the following filter query parameter.
 * - userId
 * - toSkip
 * - toTake
 * - searchTerm
 * - toOrderBy
 * - toOrderByStartWith
 *
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getTeamsSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Teams> | (Teams | null)>> {
  const { userId, toSkip, toTake, searchTerm, toOrderBy, toOrderByStartWith } =
    req.query;
  // TODO validate data
  // userId | take | skip
  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  if (
    toTake === null ||
    toTake === undefined ||
    toSkip === null ||
    toSkip === undefined
  ) {
    return res.status(500).end("Server failed to get pagination");
  }

  if (
    toOrderBy === null ||
    toOrderBy === undefined ||
    toOrderByStartWith === null ||
    toOrderByStartWith === undefined
  ) {
    return res.status(500).end("Server failed to get OrderBy data");
  }

  if (Array.isArray(searchTerm))
    return res
      .status(400)
      .end("Bad request. searchTerm parameter cannot be an array.");

  try {
    if (userId) {
      const fetchOngId = await prisma.user.findFirst({
        where: {
          id: userId,
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
          const take: number = +toTake;
          const skip: number = +toSkip;

          const searchTermFilter =
            searchTerm !== "" && searchTerm !== null
              ? { name: { contains: searchTerm as string } }
              : {};

          // Count Teams
          const teamsCount = await prisma.teams.count({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
              ...searchTermFilter,
            },
          });
          //TODO
          // order by :
          // - teams
          // - access
          // - lastActive
          const OrderBySet =
            toOrderBy !== "" &&
            toOrderBy !== null &&
            toOrderByStartWith !== "" &&
            toOrderByStartWith !== null
              ? toOrderBy === "name"
                ? {
                    orderBy: {
                      [toOrderBy as string]: toOrderByStartWith as string,
                    },
                  }
                : toOrderBy === "child-teams"
                ? {
                    orderBy: {
                      childTeam: {
                        _count: toOrderByStartWith as string,
                      },
                    },
                  }
                : toOrderBy === "users"
                ? {
                    orderBy: {
                      B2E: {
                        _count: toOrderByStartWith as string,
                      },
                    },
                  }
                : undefined
              : undefined;

          const teams = await prisma.teams.findMany({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
              ...searchTermFilter,
            },
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  childTeam: true,
                  B2E: true,
                },
              },
            },
            skip: take * (skip - 1),
            take: take,
            ...OrderBySet,
          });

          const response = {
            data: teams,
            pagination: {
              total: teamsCount,
              pageCount: Math.ceil(teamsCount / take),
              currentPage: skip,
              perPage: take,
              from: (skip - 1) * take + 1,
              to: (skip - 1) * take + teams.length,
            },
          };

          return res.status(200).json(response);
        } else {
          return res.status(500).end("Server failed to get Account ID");
        }
      } else {
        return res.status(500).end("You don't have an account connected");
      }
    } else {
      return res.status(500).end("Server failed to get user ID");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * TODO
 * Delete Team
 *
 * Deletes a team from the database using a provided `userId` & the team "id" query
 * parameter.
 * - userId
 * - id
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function deleteTeamsSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { userId, id } = req.query;

  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (Array.isArray(id))
    return res
      .status(400)
      .end("Bad request. the team id parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  try {
    // fetch the user NGO
    const fetchOngId = await prisma.user.findFirst({
      where: {
        id: userId,
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
        // delete the team and remove or delete all relation
        // await prisma.$transaction([
        //   prisma.post.deleteMany({
        //     where: {
        //       site: {
        //         id: siteId,
        //       },
        //     },
        //   }),
        //   prisma.site.delete({
        //     where: {
        //       id: siteId,
        //     },
        //   }),
        // ]);
        // fetch the user NGO
        const removeRelation = await prisma.teams.update({
          where: {
            id: id,
          },
          data: {
            parentTeam: {
              disconnect: true,
            },
            B2E: {
              set: [],
            },
            childTeam: {
              set: [],
            },
          },
        });
        await prisma.teams.delete({
          where: {
            id: id,
          },
        });
        return res.status(200).end();
      } else {
        return res.status(500).end("Server failed to get Account ID");
      }
    } else {
      return res.status(500).end("You don't have an account connected");
    }
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
export async function updateTeamsSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Teams>> {
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
