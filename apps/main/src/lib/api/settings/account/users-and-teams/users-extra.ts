import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ONG } from ".prisma/client";
import type { Session } from "next-auth";

import nodemailer from "nodemailer";
import { cyrb53 } from "@twol/utils/auth/passwords";


/**
 * Create Users
 *
 * Creates a new user or multiple user from a set of provided query parameters.
 * These include:
 *  - emails : string[]
 *  - permissionSettings <Array>
 *  - userId
 *  - team : string
 *
 * Once created, the new Users `email` and `link` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */

export async function createUsersExtraSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse> {
  const { emails, team, userId } = req.body;
  if (Array.isArray(userId))
    return res
      .status(400)
      .end("Bad request. userId parameter cannot be an array.");

  if (!Array.isArray(emails))
    return res
      .status(400)
      .end("Bad request. emails parameter needs to be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  if (session.user.id !== userId)
    return res.status(500).end("You don't have access to this user data");

  try {
    // check if we got user id
    if (userId) {
      //check if userId exist and fetch his data :
      // firstname | lastname | B2E.ongId
      const fetchOngId = await prisma.user.findFirst({
        where: {
          id: session.user.id,
        },
        select: {
          firstname: true,
          lastname: true,
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
          // pour chaque email :
          // check if exist or not
          // add team

          //1 - for each email :
          function proccessEmails() {
            return new Promise((resolve, reject) => {
              // var proccessEmails = new Promise((resolve, reject) => {
              emails.forEach(
                async (id: string, key: number, array: string | any[]) => {
                  // 2- check if exist or not
                  const existOrNot = await prisma.b2E.findFirst({
                    where: {
                      id: id,
                      ongId: fetchOngId?.B2E[0].ongId as string,
                    },
                  });

                  if (existOrNot) {
                    if (team) {
                      // if user exist on this account add extra settings
                      const updateUser = await prisma.b2E.update({
                        where: {
                          id: id,
                        },
                        data: {
                          teams: {
                            connect: {
                              id: team.value,
                            },
                          }
                        }
                      });
                      if (updateUser) {
                        if (key === array.length - 1) {
                          resolve(true);
                        }
                      } else {
                        // error to return
                        if (key === array.length - 1) {
                          resolve(true);
                        }
                      }
                    } else {
                      // if no extra settings to add
                      if (key === array.length - 1) {
                        resolve(true);
                      }
                    }
                  } else {
                    // if user does not exist
                    if (key === array.length - 1) {
                      resolve(true);
                    }
                  }
                }
              );
            });
          }
          // add extra for each email and get response
          let respProccessEmails = await proccessEmails();
          if (respProccessEmails) {
            return res.status(200).end();
          } else {
            return res.status(500).end("Server failed to save extra users data");
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
export async function updateUsersExtraSettings(
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
