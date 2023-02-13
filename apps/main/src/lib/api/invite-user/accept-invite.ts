import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ONG, B2E } from ".prisma/client";
import type { Session } from "next-auth";
import { useState } from "react";
import { hashPassword, cyrb53 } from "@twol/utils/auth/passwords";
import { decrypt } from "@twol/utils/auth/crypto";

import { compare } from "bcryptjs";
/**
 * Accept Invite
 *
 * Updates a site & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - charityNumber
 *  - firstName
 *  - lastName
 *  - email
 *  - password
 *  - passwordConfirmation
 *  - marketingAccept
 *  - activated
 *  - verificationNumber
 *
 *
 * Will return one of the following :
 * - unknown
 * - given_inviteToken
 * - given_verificationNumber
 * - email invalid
 * - firstname invalid
 * - lastname invalid
 * - LanguageError
 * - Password format invalid
 * - invalidPassword
 * - invalidMarketingValue
 * - An error occured
 * - unknownCheckInviteOTP
 * - checkInviteOTPExpired
 * - unknownOTP
 * - OTPExpired
 * - wrongPassword
 * - unknownUser
 * or the result "ok"
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function acceptInvite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<ONG>> {
  const {
    firstName,
    lastName,
    language,
    email,
    passwordIv,
    passwordContent,
    passwordConfirmationIv,
    passwordConfirmationContent,
    marketingAccept,
    activated,
    verificationNumber,
    inviteToken,
  } = req.body;

  // 0- Validate data before processing them
  const given_inviteToken: string = req.body.inviteToken.replace(/\D/g, "");
  const given_verificationNumber: string = req.body.verificationNumber.replace(
    /\D/g,
    ""
  );
  //3- validate Token
  if (!/^[0-9]{15}$/i.test(given_inviteToken)) {
    const available = "given_inviteToken";
    return res.status(200).json(available);
  }

  if (given_verificationNumber.length !== 9) {
    const available = "given_verificationNumber";
    return res.status(200).json(available);
  }

  //validate Email
  if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(email)) {
    const available = "email invalid";
    return res.status(200).json(available);
  }

  //validate First and last name
  if (!firstName || !lastName) {
  } else {
    if (
      !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(
        firstName
      )
    ) {
      const available = "firstname invalid";
      return res.status(200).json(available);
    }
    if (
      !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(
        lastName
      )
    ) {
      const available = "lastname invalid";
      return res.status(200).json(available);
    }
  }
  /* TODO - MANAGE LANGUAGE  */
  if (language !== "fr") {
    const error = "LanguageError";
    return res.status(200).json(error);
  }

  if (
    passwordIv === "" ||
    passwordContent === "" ||
    passwordConfirmationIv === "" ||
    passwordConfirmationContent === ""
  ) {
    const error = "Password format invalid";
    return res.status(200).json(error);
  }
  const hashPasswordReceived = {
    iv: passwordIv as string,
    content: passwordContent as string,
  };
  const password = decrypt(hashPasswordReceived) as string;

  const hashPasswordConfirmationReceived = {
    iv: passwordConfirmationIv as string,
    content: passwordConfirmationContent as string,
  };
  const passwordConfirmation = decrypt(
    hashPasswordConfirmationReceived
  ) as string;

  if (password !== passwordConfirmation) {
    const available = "invalidPassword";
    return res.status(200).json(available);
  }
  const hashedPassword = await hashPassword(password);

  if (
    req.body.marketingAccept !== true &&
    req.body.marketingAccept !== null &&
    req.body.marketingAccept !== false
  ) {
    const available = "invalidMarketingValue";
    return res.status(200).json(available);
  }

  try {
    //0- First Check the OTP
    //Hash the email
    const hashEmail = await cyrb53(email);
    const date = new Date();
    date.setDate(date.getDate());

    //0.1 -- delete outdated token
    const deleteOutdatedOTP = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lte: date,
        },
      },
    });
    if (deleteOutdatedOTP === null) {
      const available = "An error occured";
      return res.status(500).end(available);
    }

    //2 -- check an invite exist
    const checkInviteOTP = await prisma.verificationToken.findFirst({
      where: {
        identifier: hashEmail,
        token: given_inviteToken,
      },
      select: {
        expires: true,
        token: true,
      },
    });
    if (checkInviteOTP === null) {
      // Stop the process the OTP does not exist
      const available = "unknownCheckInviteOTP";
      return res.status(200).json(available);
    }
    if (checkInviteOTP.expires === null || checkInviteOTP.expires < date) {
      // Stop the process the OTP is expired
      const available = "checkInviteOTPExpired";
      return res.status(200).json(available);
    }

    const checkOTP = await prisma.verificationToken.findFirst({
      where: {
        identifier: hashEmail,
        token: given_verificationNumber,
      },
      select: {
        expires: true,
        token: true,
      },
    });
    if (checkOTP === null) {
      // Stop the process the OTP does not exist
      const available = "unknownOTP";
      return res.status(200).json(available);
    }
    if (checkOTP.expires === null || checkOTP.expires < date) {
      // Stop the process the OTP is expired
      const available = "OTPExpired";
      return res.status(200).json(available);
    }

    if (checkOTP.token !== null && checkInviteOTP.token !== null) {
      // all good we can delete the OTP
      const deleteUsedOTP = await prisma.verificationToken.deleteMany({
        where: {
          identifier: hashEmail,
          token: given_verificationNumber,
          expires: checkOTP.expires,
        },
      });
      const deleteUsedCheckInviteOTP =
        await prisma.verificationToken.deleteMany({
          where: {
            identifier: hashEmail,
            token: given_inviteToken,
            expires: checkInviteOTP.expires,
          },
        });
      if (deleteUsedOTP === null || deleteUsedCheckInviteOTP === null) {
        const available = "An error occured";
        return res.status(500).end(available);
      }
    } else {
      const available = "An error occured";
      return res.status(500).end(available);
    }

    // Good we can continue
    // 1 - Check if User exist
    const userCheck = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        password: true,
        B2E: {
          where: {
            status: 1,
          },
          select: {
            id: true,
          },
        },
      },
    });
    if (userCheck !== null) {
      // User Exist
      // 2.1- check if password exist and if it exist check if it match
      if (userCheck.password !== null) {
        const isValid = await compare(password, userCheck.password);
        if (isValid) {
        } else {
          const available = "wrongPassword";
          return res.status(200).json(available);
        }
      }

      // 2.2- activate the B2E relation for User access to Charity
      if (
        (userCheck.firstname === null || userCheck.lastname === null) &&
        userCheck.password === null
      ) {
        const response = await prisma.user.update({
          where: {
            id: userCheck.id,
          },
          data: {
            firstname: firstName,
            lastname: lastName,
            marketingAccept: marketingAccept,
            password: hashedPassword,
            B2E: {
              updateMany: {
                where: {
                  inUse: true,
                },
                data: {
                  inUse: false,
                },
              },
              update: {
                where: {
                  id: userCheck.B2E[0].id,
                },
                data: {
                  status: 2,
                  inUse: true,
                },
              },
            },
          },
        });
        const account = await prisma.account.create({
          data: {
            userId: userCheck.id,
            type: "credentials",
            provider: "admin-login",
            providerAccountId: userCheck.id,
          },
        });
        return res.status(200).json(response);
      } else if (
        (userCheck.firstname === null || userCheck.lastname === null) &&
        userCheck.password !== null
      ) {
        const response = await prisma.user.update({
          where: {
            id: userCheck.id,
          },
          data: {
            firstname: firstName,
            lastname: lastName,
            marketingAccept: marketingAccept,
            B2E: {
              updateMany: {
                where: {
                  inUse: true,
                },
                data: {
                  inUse: false,
                },
              },
              update: {
                where: {
                  id: userCheck.B2E[0].id,
                },
                data: {
                  status: 2,
                  inUse: true,
                },
              },
            },
          },
        });
        return res.status(200).json(response);
      } else if (
        userCheck.firstname !== null &&
        userCheck.lastname !== null &&
        userCheck.password === null
      ) {
        const response = await prisma.user.update({
          where: {
            id: userCheck.id,
          },
          data: {
            marketingAccept: marketingAccept,
            password: hashedPassword,
            B2E: {
              updateMany: {
                where: {
                  inUse: true,
                },
                data: {
                  inUse: false,
                },
              },
              update: {
                where: {
                  id: userCheck.B2E[0].id,
                },
                data: {
                  status: 2,
                  inUse: true,
                },
              },
            },
          },
        });

        const account = await prisma.account.create({
          data: {
            userId: userCheck.id,
            type: "credentials",
            provider: "admin-login",
            providerAccountId: userCheck.id,
          },
        });

        return res.status(200).json(response);
      } else {
        const response = await prisma.user.update({
          where: {
            id: userCheck.id,
          },
          data: {
            marketingAccept: marketingAccept,
            B2E: {
              updateMany: {
                where: {
                  inUse: true,
                },
                data: {
                  inUse: false,
                },
              },
              update: {
                where: {
                  id: userCheck.B2E[0].id,
                },
                data: {
                  status: 2,
                  inUse: true,
                },
              },
            },
          },
        });
        return res.status(200).json(response);
      }
      // ^ END If user exist ^
    } else {
      // If user doesn't exist we throw error
      const available = "unknownUser";
      return res.status(200).json(available);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
