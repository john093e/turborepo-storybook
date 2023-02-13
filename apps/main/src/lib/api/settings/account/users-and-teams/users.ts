import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ONG } from ".prisma/client";
import type { Session } from "next-auth";

import nodemailer from "nodemailer";
import { cyrb53 } from "@twol/utils/auth/passwords";

/**
 * Get Account Settings
 *
 * Fetches & returns all users from an account available depending
 * on a `userId` for fetching ong and the following filter query parameter.
 * - userId
 * - toSkip
 * - toTake
 * - searchTerm
 * - toOrderBy
 * - toOrderByStartWith
 * - Status
 * - Permission
 * - Partner
 *
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getUsersSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<ONG> | (ONG | null)>> {
  const {
    userId,
    toSkip,
    toTake,
    searchTerm,
    toOrderBy,
    toOrderByStartWith,
    Status,
    Permission,
    Partner,
  } = req.query;
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
          const take: number = +toTake;
          const skip: number = +toSkip;

          const searchTermFilter =
            searchTerm !== "" && searchTerm !== null
              ? {
                OR: [
                  { user: { firstname: { contains: searchTerm as string } } },
                  { user: { lastname: { contains: searchTerm as string } } },
                  { user: { email: { contains: searchTerm as string } } },
                ],
              }
              : {};




          // Filters 
          // TO DO add permission and Partner
          const FiltersSet =
            ((Status !== undefined &&
              Status !== "" &&
              Status !== null) &&
              (Permission !== "" &&
                Permission !== undefined &&
                Permission !== null) &&
              (Partner !== "" &&
                Partner !== undefined &&
                Partner !== null)
            ) ? {
              status: Status === "Active" ? 2 : Status === "Pending" ? 1 : Status === "Uninvited" ? 3 : 4,
              permission: Permission,
              partner: Partner,
            }
              : (Status !== undefined &&
                Status !== "" &&
                Status !== null) &&
                (Permission === "" ||
                  Permission === undefined ||
                  Permission === null) &&
                (Partner === "" ||
                  Partner === undefined ||
                  Partner === null) ? {
                status: Status === "Active" ? 2 : Status === "Pending" ? 1 : Status === "Uninvited" ? 3 : 4,
              }
                : (Status !== "" &&
                  Status !== undefined &&
                  Status !== null) &&
                  (Permission !== "" &&
                    Permission !== undefined &&
                    Permission !== null) &&
                  (Partner === "" ||
                    Partner === undefined ||
                    Partner === null) ? {
                  status: Status === "Active" ? 2 : Status === "Pending" ? 1 : Status === "Uninvited" ? 3 : 4,
                  permission: Permission,
                }
                  : (Status !== "" &&
                    Status !== undefined &&
                    Status !== null) &&
                    (Permission === "" ||
                      Permission === undefined ||
                      Permission === null) &&
                    (Partner !== "" &&
                      Partner !== undefined &&
                      Partner !== null) ? {
                    status: Status === "Active" ? 2 : Status === "Pending" ? 1 : Status === "Uninvited" ? 3 : 4,
                    partner: Partner,
                  }
                    : (Status === "" ||
                      Status === undefined ||
                      Status === null) &&
                      (Permission !== "" &&
                        Permission !== undefined &&
                        Permission !== null) &&
                      (Partner !== "" &&
                        Partner !== undefined &&
                        Partner !== null) ? {
                      permission: Permission,
                      partner: Partner,
                    }
                      : (Status === "" ||
                        Status === undefined ||
                        Status === null) &&
                        (Permission !== "" &&
                          Permission !== undefined &&
                          Permission !== null) &&
                        (Partner === "" ||
                          Partner === undefined ||
                          Partner === null) ? {
                        permission: Permission,
                      }
                        : (Status === "" ||
                          Status === undefined ||
                          Status === null) &&
                          (Permission === "" ||
                            Permission === undefined ||
                            Permission === null) &&
                          (Partner !== "" &&
                            Partner !== undefined &&
                            Partner !== null) ? {
                          partner: Partner,
                        }
                          : {};


          // Count Team Mates 
          const teammatesCount = await prisma.b2E.count({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
              ...searchTermFilter,
              ...FiltersSet,
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
              ? toOrderBy === "firstname"
                ? {
                  orderBy: {
                    user: {
                      [toOrderBy as string]: toOrderByStartWith as string,
                    },
                  },
                }
                : toOrderBy === "teams"
                  ? {
                    orderBy: {
                      teams: {
                        ["name" as string]: toOrderByStartWith as string,
                      },
                    },
                  }
                  : toOrderBy === "access"
                    ? {
                      orderBy: {
                        user: {
                          [toOrderBy as string]: toOrderByStartWith as string,
                        },
                      },
                    }
                    : toOrderBy === "lastActive"
                      ? {
                        orderBy: {
                          user: {
                            [toOrderBy as string]: toOrderByStartWith as string,
                          },
                        },
                      }
                      : undefined
              : undefined;


          const teammates = await prisma.b2E.findMany({
            where: {
              ongId: fetchOngId.B2E[0].ongId,
              ...searchTermFilter,
              ...FiltersSet,
            },
            select: {
              user: {
                select: {
                  firstname: true,
                  lastname: true,
                  email: true,
                  image: true,
                },
              },
              role: true,
              status: true,
              teams:{
                select:{
                  name: true,
                },
              },
              PermissionSets: {
                select: {
                  name: true,
                  accountOwner: true,
                  super_admin: true,
                  sales_sales_professional: true,
                  marketing_marketing_access: true,
                  sales_sales_access: true,
                  service_service_access: true,
                  reports_reports_access: true,
                  account_account_access: true,
                }
              }
            },
            skip: take * (skip - 1),
            take: take,
            ...OrderBySet,
          });


          let dataToSend: {
            user: {
              firstname: string;
              lastname: string;
              email: string;
              image: string;
            };
            role: number;
            status: number;
            teams: string;
            PermissionSets: {
              name: string | null | undefined;
              access: {
                AccountOwner: boolean;
                SuperAdmin: boolean;
                SalesProfessional: boolean;
                Marketing: boolean;
                Sales: boolean;
                Service: boolean;
                Reports: boolean;
                Account: boolean;
              };
            };
          }[] = [];

          if (teammates.length > 0) {
            teammates.map(teammate => {
              dataToSend.push({
                user: {
                  firstname: teammate.user?.firstname!,
                  lastname: teammate.user?.lastname!,
                  email: teammate.user?.email!,
                  image: teammate.user?.image!,
                },
                role: teammate.role,
                status: teammate.status,
                teams: teammate.teams?.name!,
                PermissionSets: {
                  name: teammate.PermissionSets?.name,
                  access: {
                    AccountOwner: teammate.PermissionSets?.accountOwner!,
                    SuperAdmin: teammate.PermissionSets?.super_admin ? teammate.PermissionSets?.super_admin : false,
                    SalesProfessional: teammate.PermissionSets?.sales_sales_professional!,
                    Marketing: teammate.PermissionSets?.marketing_marketing_access!,
                    Sales: teammate.PermissionSets?.sales_sales_access!,
                    Service: teammate.PermissionSets?.service_service_access!,
                    Reports: teammate.PermissionSets?.reports_reports_access!,
                    Account: teammate.PermissionSets?.account_account_access!,
                  },
                },
              })
            })
          }



          const response = {
            data: dataToSend,
            pagination: {
              total: teammatesCount,
              pageCount: Math.ceil(teammatesCount / take),
              currentPage: skip,
              perPage: take,
              from: (skip - 1) * take + 1,
              to: (skip - 1) * take + teammates.length,
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
 * Create Users
 *
 * Creates a new user or multiple user from a set of provided query parameters.
 * These include:
 *  - emails<Array>
 *  - permissionSettings <Array>
 *  - userId
 *
 * Once created, the new Users `email` and `link` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */

interface UsersResponse {
  id?: string;
  email: string;
  link: string;
}
export async function createUsersSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<
  Array<UsersResponse> | (UsersResponse | null)
>> {
  const { emails, userId } = req.body;
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
          // create a token & save it
          // send email
          // add user in db USER + B2E

          function LeftPadWithZeros(number: number, length: number) {
            var str = "" + number;
            while (str.length < length) {
              str = "0" + str;
            }
            return str;
          }
          // list of emails and links of new users
          let emailAndLink: { id?: string; email: string; link: string }[] = [];
          //1 - for each email :
          function proccessEmails() {
            return new Promise((resolve, reject) => {
              // var proccessEmails = new Promise((resolve, reject) => {
              emails.forEach(
                async (email: string, key: number, array: string | any[]) => {
                  // 2- check if exist or not
                  const existOrNot = await prisma.b2E.findFirst({
                    where: {
                      ongId: fetchOngId?.B2E[0].ongId as string,
                      user: {
                        email: email,
                      },
                    },select:{
                      id: true,
                    }
                  });

                  if (existOrNot) {
                    // if user exist on this account push notification message
                    emailAndLink.push({
                      id: existOrNot.id,
                      email: email,
                      link: "Already got access to this account.",
                    });
                    if (key === array.length - 1) {
                      resolve(true);
                    }
                  } else {
                    // generate token
                    const randomNumber = Math.floor(
                      Math.random() * 1000000000000000
                    );
                    const randomNumberToSend = LeftPadWithZeros(
                      randomNumber,
                      15
                    );

                    // generate link
                    const link = `https://${process.env.VERCEL_URL}/join/${randomNumberToSend}`;

                    // prepare email
                    async function wrapedSendMail() {
                      return new Promise((resolve, reject) => {
                        // send email
                        const transporter = nodemailer.createTransport({
                          port: process.env.EMAIL_PORT,
                          host: process.env.EMAIL_HOST,
                          auth: {
                            user: process.env.EMAIL_NAME,
                            pass: process.env.EMAIL_PASS,
                          },
                          secure: true,
                        });

                        const mailData = {
                          from: process.env.EMAIL_NAME,
                          to: email,
                          subject: `${fetchOngId?.firstname + " " + fetchOngId?.lastname
                            } has invited you to join them in T-WOL`,
                          text:
                            `Join ${fetchOngId?.firstname + " " + fetchOngId?.lastname
                            } in T-WOL, ` +
                            "T-WOL is marketing, sales, and service software that helps businesses grow. " +
                            "To get started, login by clicking the button below. " +
                            "Log in to T-WOL: " +
                            link +
                            "For added security, this link will only work for 5 days after it was sent." +
                            "If the link expires, you can reach out to your teammate, John Emmerechts, and ask them to send a new invite." +
                            "You can't unsubscribe from important emails about your account like this one." +
                            "T-WOL," +
                            "Ma Future adresse" +
                            "Belgique, 1000",
                          html:
                            "<div>" +
                            `<h1>Join ${fetchOngId?.firstname + " " + fetchOngId?.lastname
                            } in T-WOL</h1>` +
                            "<p>T-WOL is marketing, sales, and service software that helps charities grow.</br>" +
                            "To get started, <b>login by clicking the button</b> below:</p>" +
                            "<p><a href='" +
                            link +
                            "'>Log in to T-WOL</a></p>" +
                            "<p>For added security, this link will only work for <b>5 days</b> after it was sent.</br>" +
                            "If the link expires, you can reach out to your teammate, " +
                            fetchOngId?.firstname +
                            " " +
                            fetchOngId?.lastname +
                            ", and ask them to send a new invite.</p>" +
                            "<p>You can't unsubscribe from important emails about your account like this one.</p>" +
                            "<p>T-WOL,</br>" +
                            "Ma Future adresse</br>" +
                            "Belgique, 1000</p>" +
                            "</div>",
                        };

                        transporter.sendMail(
                          mailData,
                          async function (err, info) {
                            if (err) {
                              resolve(false);
                            } else {
                              resolve(true);
                            }
                          }
                        );
                      });
                    }
                    // send email and get response
                    let resp = await wrapedSendMail();
                    if (resp) {
                      //Hash the email for identifier in db
                      const hashEmail = await cyrb53(email);

                      function addMinutes(
                        numOfMinutes: number,
                        date = new Date()
                      ) {
                        date.setMinutes(date.getMinutes() + numOfMinutes);
                        return date;
                      }

                      // Add 5 days in minutes to current Date
                      const date = addMinutes(7200);

                      //Insert token dans la database
                      const responseToken =
                        await prisma.verificationToken.create({
                          data: {
                            identifier: hashEmail,
                            token: randomNumberToSend,
                            expires: date,
                          },
                        });
                      if (!responseToken) {
                        // if user verification was not saved
                        emailAndLink.push({
                          email: email,
                          link: "token not saved",
                        });
                        if (key === array.length - 1) {
                          resolve(true);
                        }
                      } else {
                        // We can create a user
                        // 4 - Create a User
                        // 4.1 --- Update user si il exist et creer b2e
                        // 4.2 --- Creer user si n exist pas
                        const responseUser = await prisma.user.upsert({
                          where: {
                            email: email,
                          },
                          update: {
                            B2E: {
                              create: {
                                role: 2,
                                inUse: false,
                                ong: {
                                  connect: {
                                    id: fetchOngId?.B2E[0].ongId as string,
                                  },
                                },
                              },
                            },
                          },
                          create: {
                            email: email,
                            language: "fr",
                            B2E: {
                              create: {
                                role: 2,
                                ong: {
                                  connect: {
                                    id: fetchOngId?.B2E[0].ongId as string,
                                  },
                                },
                              },
                            },
                          },
                          select:  {
                            B2E: {
                              where: {
                                ong :{
                                  id : fetchOngId?.B2E[0].ongId as string,
                                },
                              },
                              select: {
                                id: true,
                              }
                            },
                          }
                        });
                        if (responseUser) {
                          // 5 - User is created we can pass email and link to variable and pass to next email
                          emailAndLink.push({
                            id: responseUser.B2E[0].id,
                            email: email,
                            link: link,
                          });
                          if (key === array.length - 1) {
                            resolve(true);
                          }
                        } else {
                          emailAndLink.push({
                            email: email,
                            link: "An error occured while creating user",
                          });
                          if (key === array.length - 1) {
                            resolve(true);
                          }
                        }
                      }
                    } else {
                      emailAndLink.push({
                        email: email,
                        link: "Invite email not send",
                      });
                      if (key === array.length - 1) {
                        resolve(true);
                      }
                    }
                  }
                }
              );
            });
          }
          // send email and get response
          let respProccessEmails = await proccessEmails();
          if (respProccessEmails) {
            return res.status(201).json(emailAndLink);
          } else {
            return res.status(500).end("Server failed to save users");
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
export async function updateUsersSettings(
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
