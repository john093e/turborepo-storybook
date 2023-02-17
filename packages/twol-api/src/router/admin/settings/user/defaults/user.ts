import {
  protectedProcedure,
  publicProcedure,
  createTRPCRouter,
} from '../../../../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const adminSettingsUserDefaultsUserRouter = createTRPCRouter({
  /**
   * 1 - getUserSettings :
   * Get User Settings
   *
   * Fetches & returns a single user available depending
   * on a `userId` query parameter. using a collection of
   * provided query parameters. These include the following:
   *  - charity number
   *
   *
   * Will return one of the following :
   * - An error occured
   * - unknown
   * - alreadyActivated
   * -
   */
  getUserSettings: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (Array.isArray(input.userId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      // TODO validate data

      if (!ctx.session.user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            "Mauvaise requête. La session n'a pas été trouvé. Tu es sûr que tu es connecté ?",
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      if (ctx.session.user.id !== input.userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "Mauvaise requête. You don't have access to this user data",
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      try {
        if (input.userId) {
          const settings = await ctx.prisma.user.findFirst({
            where: {
              id: ctx.session.user.id,
            },
            select: {
              dateFormat: true,
              firstname: true,
              image: true,
              lastname: true,
              language: true,
              phone: true,
              phonePrefix: true,
              B2E: {
                where: {
                  inUse: true,
                },
                select: {
                  defaultHomepage: true,
                },
              },
            },
          })

          return settings
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              'An unexpected error occurred, server failed to get user ID, please try again later.',
            // optional: pass the original error to retain stack trace
            // cause: error,
          })
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          // optional: pass the original error to retain stack trace
          cause: error,
        })
      }
    }),
  /**
   * 2 - updateUserSettings :
   * Update User Settings
   *
   * Updates a User & its users settings using a collection of provided
   * query parameters. These include the following:
   *  - dateFormat
   *  - defaultHomepage
   *  - firstname
   *  - image
   *  - language
   *  - lastname
   *  - phone
   *  - phonePrefix
   *
   */
  updateUserSettings: protectedProcedure
    .input(
      z.object({
        dateFormat: z.string(),
        defaultHomepage: z.string(),
        firstname: z.string(),
        image: z.string(),
        language: z.string(),
        lastname: z.string(),
        phone: z.string(),
        phonePrefix: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            "Mauvaise requête. La session n'a pas été trouvé. Tu es sûr que tu es connecté ?",
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      //TODO : validate data
      //  - dateFormat
      //  - defaultHomepage
      //  - firstname
      //  - image
      //  - language
      //  - lastname
      //  - phone
      //  - phonePrefix

      try {
        const response = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            dateFormat: input.dateFormat,
            firstname: input.firstname,
            image: input.image,
            language: input.language,
            lastname: input.lastname,
            phone: input.phone,
            phonePrefix: input.phonePrefix,
            B2E: {
              updateMany: {
                where: {
                  userId: ctx.session.user.id,
                  inUse: true,
                },
                data: {
                  defaultHomepage: input.defaultHomepage,
                },
              },
            },
          },
        })
        return response
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          // optional: pass the original error to retain stack trace
          cause: error,
        })
      }
    }),
})
