import prisma from "@lib/prisma";
import { HttpMethod } from "@types";
import nodemailer from "nodemailer";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword, cyrb53 } from "@twol/utils/auth/passwords";
import { decrypt } from "@twol/utils/auth/crypto";

/*
 * Note: This endpoint is to check if the email exist and validate the possession of it from the user.
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
  } = req.query;

  if (Array.isArray(userEmail))
    return res
      .status(400)
      .end("Mauvaise requête. Le paramètre email ne peut pas être un tableau.");

  try {
    if (userEmail && userEmail.length !== 0) {
      //validate Email
      if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(userEmail)) {
        const error = "email invalid";
        return res.status(200).json(error);
      }
      const uEmail = userEmail as string;

      if (userPassIv === "" || userPassContent === "") {
        const error = "Password format invalid";
        return res.status(200).json(error);
      }
      const hash = {
        iv: userPassIv as string,
        content: userPassContent as string,
      };
      const uPass = decrypt(hash) as string;

      // Check if user exist and if password match
      const userCheck = await prisma.b2E.findFirst({
        where: {
          status: 2,
          inUse: true,
          user: {
            email: uEmail,
          },
        },
        select: {
          user: {
            select: {
              password: true,
            },
          },
        },
      });

      if (userCheck !== null) {
        // LET'S CHECK IF PASSWORD IS SIMILAR
        const passwordRef: string =
          userCheck.user?.password || "no_password_found";
        const isValid = await verifyPassword(uPass, passwordRef);
        if (!isValid) {
          const result = "Invalid Credentials";
          return res.status(200).json(result);
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
          //Hash the email
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
        const available = "unknownUser";
        return res.status(200).json(available);
      }
    } else {
      const result = "email invalid";
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
