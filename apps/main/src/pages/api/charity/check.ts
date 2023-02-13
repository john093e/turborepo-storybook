import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

/*
 * Note: This endpoint is to check if a charity still has its activate configured correctly.
 */

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { charityNumber = false } = req.query;

  if (Array.isArray(charityNumber))
    return res
      .status(400)
      .end("Mauvaise requête. Le paramètre numéro d'organisme caritatif ne peut pas être un tableau.");

  try {
    if (charityNumber && charityNumber.length !== 0) {
      const cNumber = (charityNumber as string).replace(/\D/g,'');

      const data = await prisma.oNG.findUnique({
        where: {
          registered_charity_number: cNumber,
        },
        select: {
          registered_name: true,
          activated: true,
        }
      });

      if ( data === null && cNumber.length !== 0 ) {
        const available = "unknown";
        return res.status(200).json(available);
      }else if(data !== null){
        const available = data;
        return res.status(200).json(available);
      }
      else{
        const available = "error";
        return res.status(200).json(available);
      }
    }

  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
