// import NextAuth from "next-auth";

// import { authOptions } from "@twol/auth";

// export default NextAuth(authOptions);


import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
  } from 'next'
  
import NextAuth, { type NextAuthOptions } from 'next-auth'

import { requestWrapper } from "@twol/auth";

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET)
  throw new Error('Failed to initialize Google authentication')

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = requestWrapper(req, res)
  return await NextAuth(...data)
}

export default handler
