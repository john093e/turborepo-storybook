import cuid from "cuid";
import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { User, B2E } from ".prisma/client";
import type { Session } from "next-auth";

/**
 * Get User Settings
 *
 * Fetches & returns a single user available depending
 * on a `userId` query parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getUserSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<User> | (User | null)>> {
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
      const settings = await prisma.user.findFirst({
        where: {
          id: session.user.id,
        },
        select: {
            dateFormat: true,
            firstname: true,
            image: true,
            lastname: true,
            language: true,
            phone: true,
            phonePrefix: true,
            B2E: {
                where: {
                    inUse: true,
                },
                select: {
                    defaultHomepage: true,
                }
            }

        }
      });

      return res.status(200).json(settings);
    }

    return res.status(500).end("Server failed to get user ID");
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * TODO 
 * Create Site
 *
 * Creates a new site from a set of provided query parameters.
 * These include:
 *  - name
 *  - description
 *  - subdomain
 *  - userId
 *
 * Once created, the sites new `siteId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createUserSettings(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  siteId: string;
}>> {
  const { name, subdomain, description, userId } = req.body;

  const sub = subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");

  try {
    const response = await prisma.site.create({
      data: {
        name: name,
        description: description,
        subdomain: sub.length > 0 ? sub : cuid(),
        logo: "/logo.png",
        image: `/placeholder.png`,
        imageBlurhash:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==",
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(201).json({
      siteId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * TODO
 * Delete Site
 *
 * Deletes a site from the database using a provided `siteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteUserSettings(
  req: NextApiRequest,
  res: NextApiResponse,

): Promise<void | NextApiResponse> {
  const { siteId } = req.query;

  if (Array.isArray(siteId))
    return res
      .status(400)
      .end("Bad request. siteId parameter cannot be an array.");

  try {
    await prisma.$transaction([
      prisma.post.deleteMany({
        where: {
          site: {
            id: siteId,
          },
        },
      }),
      prisma.site.delete({
        where: {
          id: siteId,
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
 * Update User Settings
 *
 * Updates a User & its users settings using a collection of provided
 * query parameters. These include the following:
 *  - dateFormat
 *  - defaultHomepage
 *  - firstname
 *  - image
 *  - language
 *  - lastname
 *  - phone
 *  - phonePrefix
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
*/
export async function updateUserSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<User>> {

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

    const data = JSON.parse(req.body);
    //TODO : validate data 
    //  - dateFormat
    //  - defaultHomepage
    //  - firstname
    //  - image
    //  - language
    //  - lastname
    //  - phone
    //  - phonePrefix

    try {
      const response = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          dateFormat:data.dateFormat,
          firstname:data.firstname,
          image:data.image,
          language:data.language,
          lastname:data.lastname,
          phone:data.phone,
          phonePrefix: data.phonePrefix,
          B2E: {
            updateMany: {
              where: {
                userId: session.user.id,
                inUse: true,
              },
              data: {
                defaultHomepage: data.defaultHomepage,
              }
            }
          }
        },
      });  
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).end(error);
    }
}
