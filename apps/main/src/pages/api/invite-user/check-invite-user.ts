import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

import { cyrb53 } from "@/lib/auth/passwords";

/*
 * Note: This endpoint is to check if a User has been invited.
 */

export default async function checkUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userEmail = false , inviteToken = null} = req.query;

  if (Array.isArray(userEmail) || Array.isArray(inviteToken) )
    return res
      .status(400)
      .end("Mauvaise requête. Les paramètres emails et Token ne peuvent pas être des tableaux.");

  try {
    //1 - check we receive data
    if (userEmail && userEmail.length !== 0 && inviteToken && inviteToken.length !== 0) {
      //2 - validate Email
      if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(userEmail)) {
        const available = "email invalid";
        return res.status(200).json(available);
      }
      const uEmail = userEmail as string;

      //3- validate Token
      if (!/^[0-9]{15}$/i.test(inviteToken)) {
        const available = "token invalid";
        return res.status(200).json(available);
      }
      const uToken = inviteToken as string;

      //4- Hash the email for identifier in db
      const hashEmail = await cyrb53(uEmail) as string;

      //5- get Date to delete outdated token
      const date = new Date();
      date.setDate(date.getDate());
  
      //6 -- delete outdated token
      const deleteOutdatedOTP = await prisma.verificationToken.deleteMany({
        where: {
          expires: {
            lte: date,
          },
        },
      });
      //6.1 -- check delete outdated token went fine 
      if (deleteOutdatedOTP === null) {
        const available = "An error occured";
        return res.status(500).end(available);
      }

      //7 -- check an invite exist 
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
      //8 -- check the invite ccheck went fine  
      if (data === null && uEmail.length !== 0 && uToken.length !== 0) {
        const available = "unknown";
        return res.status(200).json(available);
      } else if (data !== null) {
        //9 -- if there is a token for this email ccheck if new user of already exist 
        const dataUser = await prisma.user.findUnique({
          where: {
            email: uEmail,
          },
          select: {
            password: true,
            firstname: true,
            lastname: true,
            marketingAccept: true,
          },
        });

        if (dataUser !== null) {
          let passwordSet: boolean = false,
          firstnameSet: boolean = false,
          lastnameSet: boolean = false,
          marketingAccept: boolean | null;
          if (dataUser.password !== null) {
            passwordSet = true;
          }
          if (dataUser.firstname !== null) {
            firstnameSet = true;
          }
          if (dataUser.lastname !== null) {
            lastnameSet = true;
          }
          marketingAccept = dataUser.marketingAccept;
          const available = {
            passwordSet,
            firstnameSet,
            lastnameSet,
            marketingAccept,
          };
          return res.status(200).json(available);
        }else{
          const available = "noUserFound";
          return res.status(200).json(available);
        }        
      } else {
        const available = "error";
        return res.status(200).json(available);
      }
    }else {
      const available = "error";
      return res.status(200).json(available);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
