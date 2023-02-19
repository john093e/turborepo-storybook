import { appRouter, createTRPCContext } from "@twol/api";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import toast from 'react-hot-toast'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError({ error, type, path, input, ctx, req }) {
    console.error('Error:', error);
    
    if (error.cause) {
      // show full message
      toast.error(error.message + "The Following was return from server: " + error.cause);
    }else{
      toast.error(error.message);
    }
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
    }
  },
});

// If you need to enable cors, you can do so like this:
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   // Enable cors
//   await cors(req, res);

//   // Let the tRPC handler do its magic
//   return createNextApiHandler({
//     router: appRouter,
//     createContext,
//   })(req, res);
// };

// export default handler;