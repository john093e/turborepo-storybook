import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Teams } from ".prisma/client";
import type { Session } from "next-auth";

/**
 * Get TeamsDrawer Settings
 *
 * Fetches & returns all users from an account available depending
 * on a `userId` for fetching ong and the following filter query parameter.
 * - userId
 * - teamsId
 *
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getTeamsDrawerSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<{
  team: {
    name: string;
    parentTeam: {
      name: string;
      id: string;
    } | null;
    B2E:
      | {
          id: string;
          user: {
            firstname: string | null;
            lastname: string | null;
            email: string;
          };
        }[]
      | []
      | null;
  } | null;

  teams:
    | {
        id: string;
        name: string;
        parentTeamId: string;
      }[]
    | []
    | null;

  users:
    | {
        id: string;
        teamsId: string;
        user: {
          firstname: string | null;
          lastname: string | null;
          email: string;
        };
      }[]
    | []
    | null;
}>> {
  const { userId, id } = req.query;
  // TODO validate data
  // userId
  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  // team id
  if (Array.isArray(id))
    return res
      .status(400)
      .end("Bad request. The team id parameter cannot be an array.");

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
          // if update get the selected teams settings
          const team = await prisma.teams.findMany({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
              id: id,
            },
            select: {
              name: true,
              parentTeam: {
                select: {
                  name: true,
                  id: true,
                },
              },
              B2E: {
                select: {
                  id: true,
                  user: {
                    select: {
                      firstname: true,
                      lastname: true,
                      email: true,
                    },
                  },
                },
              },
            },
          });

          // get Teams from this account
          const teams = await prisma.teams.findMany({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
              NOT: {
                id: id,
              },
            },
            select: {
              id: true,
              name: true,
              parentTeamId: true,
            },
          });

          // get Users from this account
          const users = await prisma.b2E.findMany({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
            },
            select: {
              id: true,
              teamsId: true,
              user: {
                select: {
                  firstname: true,
                  lastname: true,
                  email: true,
                },
              },
            },
          });

          // constuct response
          const response = {
            team: team,
            teams: teams,
            users: users,
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
 * Create TeamsDrawer
 *
 * Creates a new Team from a set of provided query parameters.
 * These include:
 *  - name
 *  - parentTeamId
 *  - users <Array>
 *  - userId
 *
 * Once created, the new TeamsDrawer `email` and `link` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */

interface TeamsDrawerResponse {
  email: string;
  link: string;
}
export async function createTeamsDrawerSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<
  Array<TeamsDrawerResponse> | (TeamsDrawerResponse | null)
>> {
  const { name, parentTeamId, users, userId } = req.body;
  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (Array.isArray(name))
    return res
      .status(400)
      .end("Bad request. name parameter cannot to be an array.");

  if (Array.isArray(parentTeamId))
    return res
      .status(400)
      .end("Bad request. name parameter cannot to be an array.");

  if (!Array.isArray(users))
    return res
      .status(400)
      .end("Bad request. users parameter needs to be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  try {
    // check if we got user id
    if (userId) {
      //check if userId exist and fetch his data :
      // B2E.ongId
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
      // Check if we fetch something
      if (fetchOngId) {
        // check if we fetch an NGO related to the userId
        if (fetchOngId.B2E[0].ongId) {
          // Add team in db
          // We can create the team
          if (
            parentTeamId &&
            parentTeamId !== "" &&
            users &&
            users.length > 0
          ) {
            const responseTeam = await prisma.oNG.update({
              where: {
                id: fetchOngId.B2E[0].ongId,
              },
              data: {
                Teams: {
                  create: {
                    name: name,
                    B2E: {
                      connect: users.map((user) => ({ id: user.id })) || [],
                    },
                    parentTeam: {
                      connect: {
                        id: parentTeamId,
                      },
                    },
                  },
                },
              },
            });
            if (responseTeam) {
              return res.status(201).json("allGood");
            } else {
              return res.status(500).end("Server failed to create the team");
            }
          } else if (
            users &&
            users.length > 0 &&
            (!parentTeamId || parentTeamId === "")
          ) {
            const responseTeam = await prisma.oNG.update({
              where: {
                id: fetchOngId.B2E[0].ongId,
              },
              data: {
                Teams: {
                  create: {
                    name: name,
                    B2E: {
                      connect: users.map((user) => ({ id: user.id })) || [],
                    },
                  },
                },
              },
            });
            if (responseTeam) {
              return res.status(201).json("allGood");
            } else {
              return res.status(500).end("Server failed to create the team");
            }
          } else if (
            (!users || users.length === 0) &&
            parentTeamId &&
            parentTeamId !== ""
          ) {
            const responseTeam = await prisma.oNG.update({
              where: {
                id: fetchOngId.B2E[0].ongId,
              },
              data: {
                Teams: {
                  create: {
                    name: name,
                    parentTeam: {
                      connect: {
                        id: parentTeamId,
                      },
                    },
                  },
                },
              },
            });
            if (responseTeam) {
              return res.status(201).json("allGood");
            } else {
              return res.status(500).end("Server failed to create the team");
            }
          } else {
            const responseTeam = await prisma.oNG.update({
              where: {
                id: fetchOngId.B2E[0].ongId,
              },
              data: {
                Teams: {
                  create: {
                    name: name,
                  },
                },
              },
            });

            if (responseTeam) {
              return res.status(201).json("allGood");
            } else {
              return res.status(500).end("Server failed to create the team");
            }
          }
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
 * Update Team Settings
 *
 * Updates a Team settings using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - name
 *  - parentTeamId
 *  - users <Array>
 *  - userId
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function updateTeamsDrawerSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Teams>> {
  const { id, name, parentTeamId, users, userId } = req.body;
  if (Array.isArray(id))
    return res
      .status(400)
      .end("Bad request. the Team id parameter cannot be an array.");

  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (Array.isArray(name))
    return res
      .status(400)
      .end("Bad request. name parameter cannot to be an array.");

  if (Array.isArray(parentTeamId))
    return res
      .status(400)
      .end("Bad request. name parameter cannot to be an array.");

  if (!Array.isArray(users))
    return res
      .status(400)
      .end("Bad request. users parameter needs to be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  try {
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
        if (parentTeamId && users.length > 0) {
          await prisma.$transaction([
            prisma.teams.update({
              where: {
                id: id,
              },
              data: {
                B2E: {
                  set: [],
                },
              },
            }),
            prisma.teams.update({
              where: {
                id: id,
              },
              data: {
                name: name,
                parentTeam: {
                  connect: {
                    id: parentTeamId,
                  },
                },
                B2E: {
                  connect: users.map((user) => ({ id: user.id })),
                },
              },
            }),
          ]);
          return res.status(200).end();
        } else if (!parentTeamId && users.length > 0) {
          await prisma.$transaction([
            prisma.teams.update({
              where: {
                id: id,
              },
              data: {
                B2E: {
                  set: [],
                },
              },
            }),
            prisma.teams.update({
              where: {
                id: id,
              },
              data: {
                name: name,
                parentTeam: {
                  disconnect: true,
                },
                B2E: {
                  connect: users.map((user) => ({ id: user.id })),
                },
              },
            }),
          ]);

          return res.status(200).end();
        } else if (!parentTeamId && users.length === 0) {
          const response = await prisma.teams.update({
            where: {
              id: id,
            },
            data: {
              name: name,
              parentTeam: {
                disconnect: true,
              },
              B2E: {
                set: [],
              },
            },
          });
          return res.status(200).end();
        } else if (parentTeamId && users.length === 0) {
          const response = await prisma.teams.update({
            where: {
              id: id,
            },
            data: {
              name: name,
              parentTeam: {
                connect: {
                  id: parentTeamId,
                },
              },
              B2E: {
                set: [],
              },
            },
          });
          return res.status(200).end();
        } else {
          return res.status(500).end("Server failed to update the team");
        }
      }
      return res.status(500).end("Server failed to get Account ID");
    }
    return res.status(500).end("You don't have an account connected");
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
