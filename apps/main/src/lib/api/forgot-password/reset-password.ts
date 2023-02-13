import prisma from "@lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from ".prisma/client";
import { useState } from "react";
import { hashPassword, cyrb53 } from "@twol/utils/auth/passwords";
import { decrypt } from "@twol/utils/auth/crypto";

import { compare } from "bcryptjs";
/**
 * Reset Password
 *
 * Updates the password of a user using a collection of provided
 * query parameters. These include the following:
 *  - email
 *  - password
 *  - token
 *
 *
 * Will return one of the following :
 * - unknown
 * - given_inviteToken
 * - email invalid
 * - Password format invalid
 * - An error occured
 * - unknownOTP
 * - OTPExpired
 * - unknownUser
 * or the result "ok"
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function resetPassword(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<string>> {
  const { email, passwordIv, passwordContent, token } = req.body;

  //1- Validate data before processing them
  const given_inviteToken: string = token.replace(/\D/g, "");

  //2- validate Token
  if (!/^[0-9]{15}$/i.test(given_inviteToken)) {
    const available = "given_inviteToken";
    return res.status(500).end(available);
  }

  //validate Email
  if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(email)) {
    const available = "email invalid";
    return res.status(500).end(available);
  }

  if (
    passwordIv === "" ||
    passwordIv === undefined ||
    passwordContent === undefined ||
    passwordContent === ""
  ) {
    const error = "Password format invalid";
    return res.status(500).end(error);
  }

  const hashPasswordReceived = {
    iv: passwordIv as string,
    content: passwordContent as string,
  };
  const password = decrypt(hashPasswordReceived) as string;
  const hashedPassword = await hashPassword(password);

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

    //2 -- check the request exist
    const checkOTP = await prisma.verificationToken.findFirst({
      where: {
        identifier: hashEmail,
        token: given_inviteToken,
      },
      select: {
        expires: true,
        token: true,
      },
    });

    if (checkOTP === null) {
      // Stop the process the OTP does not exist
      const available = "unknownOTP";
      return res.status(500).end(available);
    }
    if (checkOTP.expires === null || checkOTP.expires < date) {
      // Stop the process the OTP is expired
      const available = "OTPExpired";
      return res.status(500).end(available);
    }

    if (checkOTP.token !== null) {
      // all good we can delete the OTP
      const deleteUsedOTP = await prisma.verificationToken.deleteMany({
        where: {
          identifier: hashEmail,
          token: given_inviteToken,
          expires: checkOTP.expires,
        },
      });
      if (deleteUsedOTP === null) {
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
    });
    if (userCheck !== null) {
      // User Exist
      // change password
      const response = await prisma.user.update({
        where: {
          id: userCheck.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return res.status(200).json("allGood");
    } else {
      // If user doesn't exist we throw error
      const available = "unknownUser";
      return res.status(500).end(available);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
