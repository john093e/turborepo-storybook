// import type {
//     GetServerSidePropsContext,
//     NextApiRequest,
//     NextApiResponse,
//   } from "next";
//   import { getServerSession } from "next-auth";
  
//   import { authOptions } from "./auth-options";
  
//   export const getServerSessionAuth = async (
//     ctx:
//       | {
//           req: GetServerSidePropsContext["req"];
//           res: GetServerSidePropsContext["res"];
//         }
//       | { req: NextApiRequest; res: NextApiResponse },
//   ) => {
//     return await getServerSession(ctx.req, ctx.res, authOptions);
//   };


import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
  } from "next";
  import { getServerSession } from "next-auth";
  
  import { requestWrapper } from "./auth-options";

  export const getServerSessionAuth = async (
    ctx: { req: NextApiRequest; res: NextApiResponse },
  ) => {
    const opts = requestWrapper(ctx.req, ctx.res);

    return await getServerSession(ctx.req, ctx.res,  opts[2]);
  };