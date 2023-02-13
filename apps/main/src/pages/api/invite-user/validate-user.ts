import prisma from "@lib/prisma";
import { HttpMethod } from "@types";
import nodemailer from "nodemailer";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { cyrb53 } from "@twol/utils/auth/passwords";
import { decrypt } from "@twol/utils/auth/crypto";
import { requestWrapper } from "@twol/auth";

/**
 * Note: This endpoint is to check if the email exist and validate the possession of it from the user.
 *  Will return one of the following :
 * - email invalid
 * - token invalid
 * - Password format invalid
 * - unknownOTP
 * - OTPExpired
 * - unknown
 * - wrongPassword
 * - allGood
 * - tokenNotSaved
 * - email not send
 * - error
 * or the result "ok"
 *
 */
export default async function post(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<string>> {
  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    userEmail = false,
    userPassIv = "",
    userPassContent = "",
    inviteToken = false,
  } = req.query;

  if (Array.isArray(userEmail) || Array.isArray(inviteToken))
    return res
      .status(400)
      .end(
        "Mauvaise requête. Les paramètres emails et Token ne peuvent pas être des tableaux."
      );

  try {
    if (
      userEmail &&
      userEmail.length !== 0 &&
      inviteToken &&
      inviteToken.length !== 0
    ) {
      //validate Email
      if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(userEmail)) {
        const error = "email invalid";
        return res.status(200).json(error);
      }
      const uEmail = userEmail as string;

      //3- validate Token
      if (!/^[0-9]{15}$/i.test(inviteToken)) {
        const available = "token invalid";
        return res.status(200).json(available);
      }
      const uToken = inviteToken as string;

      if (userPassIv === "" || userPassContent === "") {
        const error = "Password format invalid";
        return res.status(200).json(error);
      }
      const hash = {
        iv: userPassIv as string,
        content: userPassContent as string,
      };
      const uPass = decrypt(hash) as string;

      //4- Hash the email for identifier in db
      const hashEmail = (await cyrb53(uEmail)) as string;
      //5- get Date to delete outdated token
      const date = new Date();
      date.setDate(date.getDate());

      //6 -- check an invite exist
      const data = await prisma.verificationToken.findFirst({
        where: {
          identifier: hashEmail,
          token: uToken,
        },
        select: {
          expires: true,
          token: true,
        },
      });
      if (data === null) {
        // Stop the process the OTP does not exist
        const available = "unknownOTP";
        return res.status(200).json(available);
      }
      if (data.expires === null || data.expires < date) {
        // Stop the process the OTP is expired
        const available = "OTPExpired";
        return res.status(200).json(available);
      }
      //8 -- check the invite-check went fine
      if (data === null && uEmail.length !== 0 && uToken.length !== 0) {
        const available = "unknown";
        return res.status(200).json(available);
      } else if (data !== null) {
        //9 -- if there is a token for this email check if new user or already exist

        // Check if user exist and if password match
        const userCheck = await prisma.user.findFirst({
          where: {
            email: uEmail,
          },
          select: {
            password: true,
          },
        });

        if (userCheck !== null) {
          if (userCheck.password !== null) {
            const isValid = await compare(uPass, userCheck.password);
            if (isValid) {
            } else {
              const available = "wrongPassword";
              return res.status(200).json(available);
            }
          }
        }

        // generate token
        const randomNumber = Math.floor(Math.random() * 1000000000);
        function LeftPadWithZeros(number: number, length: number) {
          var str = "" + number;
          while (str.length < length) {
            str = "0" + str;
          }
          return str;
        }
        const randomNumberToSend = LeftPadWithZeros(randomNumber, 9);

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
              to: uEmail,
              subject: `T-WOL.com | Votre code d'activation`,
              text:
                "Voici votre code d'activation : " +
                randomNumberToSend +
                " (ne dure que 15min)",
              html:
                "<div>Voici votre code d'activation : " +
                randomNumberToSend +
                " (ne dure que 15min)</div>",
            };

            transporter.sendMail(mailData, async function (err, info) {
              if (err) {
                resolve(false);
              } else {
                resolve(true);
              }
            });
          });
        }

        let resp = await wrapedSendMail();
        if (resp) {
          //Hash the password
          const hashEmail = await cyrb53(uEmail);

          function addMinutes(numOfMinutes: number, date = new Date()) {
            date.setMinutes(date.getMinutes() + numOfMinutes);
            return date;
          }

          // Add 15 minutes to current Date
          const date = addMinutes(15);

          //Insert token dans la database
          const response = await prisma.verificationToken.create({
            data: {
              identifier: hashEmail,
              token: randomNumberToSend,
              expires: date,
            },
          });
          if (response) {
            const result = "allGood";
            return res.status(200).json(result);
          } else {
            const result = "tokenNotSaved";
            return res.status(200).json(result);
          }
        } else {
          const result = "email not send";
          return res.status(200).json(result);
        }
      } else {
        const available = "error";
        return res.status(200).json(available);
      }
    } else {
      const available = "error";
      return res.status(200).json(available);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
