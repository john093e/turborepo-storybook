import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";
import nodemailer from "nodemailer";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { cyrb53 } from "@/lib/auth/passwords";
import { decrypt } from "@/lib/auth/crypto";

/**
 * Note: This endpoint is to create a password change request if the email exist from the user.
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
  if (req.method !== HttpMethod.POST) {
    res.setHeader("Allow", [HttpMethod.POST]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { email = false } = req.body;

  if (Array.isArray(email))
    return res
      .status(400)
      .end(
        "Mauvaise requête. Les paramètres emails ne peut pas être un tableaux."
      );

  try {
    if (email && email.length !== 0) {
      //- validate Email
      if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(email)) {
        const error = "email invalid";
        return res.status(500).end(error);
      }
      const uEmail = email as string;

      //2- Hash the email for identifier in db
      const hashEmail = (await cyrb53(uEmail)) as string;

      //3- Get Date to delete outdated token
      const date = new Date();
      date.setDate(date.getDate());

      //4- Function to add minutes to time
      function addMinutes(numOfMinutes: number, date = new Date()) {
        date.setMinutes(date.getMinutes() + numOfMinutes);
        return date;
      }
      function minusMinutes(numOfMinutes: number, date = new Date()) {
        date.setMinutes(date.getMinutes() - numOfMinutes);
        return date;
      }

      //5- Check user exist
      const data = await prisma.user.findFirst({
        where: {
          email: uEmail,
        },
      });
      if (data === null) {
        // Stop the process the User does not exist
        const available = "unknown";
        return res.status(500).end(available);
      }
      //6 -- check the invite-check went fine
      if (data === null && uEmail.length !== 0) {
        // Stop the process the User does not exist
        const available = "unknown";
        return res.status(500).end(available);
      } else if (data !== null) {

        //7-  check if already request in the last 5min.
        async function wrappedCheckAlredyRequest() {
          const checkAlreadyRequest = await prisma.verificationToken.findFirst({
            where: {
              identifier: hashEmail,
            },
            select: {
              expires: true,
              token: true,
            },
          });
          if (checkAlreadyRequest) {
            // There is a token, is it a forget token ?
            if (checkAlreadyRequest.token.length === 15) {
              //  token is the right size, is it more than 5 min old ?
              if (minusMinutes(10, checkAlreadyRequest.expires) > date) {
                // Stop the process the User does not exist
                return "wait5min";
              } else {
                //delete old token
                // all good we can delete the OTP
                const deleteUsedOTP = await prisma.verificationToken.deleteMany(
                  {
                    where: {
                      identifier: hashEmail,
                    },
                  }
                );                
                if (deleteUsedOTP === null) {
                  return "An error occured";
                }
                return true;
              }
            }else{
              return true;
            }
          } else {
            return true;
          }
        }

        let respWrappedCheckAlredyRequest = await wrappedCheckAlredyRequest();
        if (respWrappedCheckAlredyRequest === "An error occured") {
          const available = "An error occured";
          return res.status(500).end(available);

        } else if (respWrappedCheckAlredyRequest === "wait5min") {
          // Stop the process the User does not exist
          const available = "wait5min";
          return res.status(200).json(available);

        } else if (respWrappedCheckAlredyRequest === true) {
          //8- create request and send email

          // generate token
          const randomNumber = Math.floor(Math.random() * 1000000000000000);
          function LeftPadWithZeros(number: number, length: number) {
            var str = "" + number;
            while (str.length < length) {
              str = "0" + str;
            }
            return str;
          }
          const randomNumberToSend = LeftPadWithZeros(randomNumber, 15);

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
              const link = `https://${process.env.VERCEL_URL}/forgot-password/${randomNumberToSend}/${uEmail}`;

              const mailData = {
                from: process.env.EMAIL_NAME,
                to: uEmail,
                subject: `T-WOL.com | Mot de passe oublié ?`,
                text:
                  "Nous avons reçu une demande de reset ton mot de passe," +
                  "si tu n'es pas à l'origine de la demande ne clique pas sur le lien et tout sera en sécurité :)" +
                  "Dans le cas contraire, voici ton lien magic :" +
                  link +
                  "For added security, this link will only work for 15 min after it was sent." +
                  "If the link expires, you can reach out to your teammate, John Emmerechts, and ask them to send a new invite." +
                  "You can't unsubscribe from important emails about your account like this one." +
                  "T-WOL," +
                  "Ma Future adresse" +
                  "Belgique, 1000",
                html:
                  "<div>" +
                  `<h1>Alors comme ça on oublie son mot de passe ?</h1>` +
                  "<p>Nous avons reçu une demande de reset ton mot de passe,</br>" +
                  "si tu n'es pas à l'origine de la demande ne clique pas sur le lien et tout sera en sécurité :)</p>" +
                  "<p>Dans le cas contraire, voici ton lien magic :</p>" +
                  "<p><a href='" +
                  link +
                  "'>Reset mon mot de passe</a></p>" +
                  "<p>For added security, this link will only work for <b>15 min</b> after it was sent.</br>" +
                  "If the link expires, you can do the process again.</p>" +
                  "<p>You can't unsubscribe from important emails about your account like this one.</p>" +
                  "<p>T-WOL,</br>" +
                  "Ma Future adresse</br>" +
                  "Belgique, 1000</p>" +
                  "</div>",
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
              return res.status(500).end(result);
            }
          } else {
            const result = "email not send";
            return res.status(500).end(result);
          }
        } else {
          const result = "error";
          return res.status(500).end(result);
        }
      } else {
        const available = "error";
        return res.status(500).end(available);
      }
    } else {
      const available = "error";
      return res.status(500).end(available);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
