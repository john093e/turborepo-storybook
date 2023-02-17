import {
  protectedProcedure,
  publicProcedure,
  createTRPCRouter,
} from '../../../../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const adminSettingsAccountDefaultsAccountNGODefaultsRouter =
  createTRPCRouter({
    /**
     * 1 - getAccountNGOSettings :
     * Get Account NGO Settings
     *
     * Fetches & returns a single user available depending
     * on a `userId` query parameter.
     *
     */
    getAccountNGOSettings: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        // TODO validate data
        // userId
        if (Array.isArray(input.userId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (!ctx.session.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Server failed to get session user ID',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (ctx.session.user.id !== input.userId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You don't have access to this user data",
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        try {
          if (input.userId) {
            const fetchOngId = await ctx.prisma.user.findFirst({
              where: {
                id: ctx.session.user.id,
              },
              select: {
                B2E: {
                  where: {
                    inUse: true,
                  },
                  select: {
                    ongId: true,
                  },
                },
              },
            })
            if (fetchOngId && fetchOngId.B2E[0] !== undefined) {
              if (fetchOngId.B2E[0].ongId) {
                const settingsNGOAccount = await ctx.prisma.oNG.findFirst({
                  where: {
                    id: fetchOngId.B2E[0].ongId,
                  },
                  select: {
                    name_set: true,
                    domain_name: true,
                    address_set: true,
                    address_line_2_set: true,
                    address_city_set: true,
                    address_state_set: true,
                    address_postcode_set: true,
                    address_country_set: true,
                  },
                })
                return settingsNGOAccount
              } else {
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message: 'Server failed to get Account ID.',
                  // optional: pass the original error to retain stack trace
                  // cause: error,
                })
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "You don't have an account connected",
                // optional: pass the original error to retain stack trace
                // cause: error,
              })
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Server failed to get user ID.',
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
     * 2 - updateAccountNGOSettings :
     * Update Account NGO Settings
     *
     * Updates a ONG & its users settings using a collection of provided
     * query parameters. These include the following:
     *  - name_set
     *  - domain_name
     *  - address_set
     *  - address_line_2_set
     *  - address_city_set
     *  - address_state_set
     *  - address_postcode_set
     *  - address_country_set
     *
     */
    updateAccountNGOSettings: protectedProcedure
      .input(
        z.object({
          name_set: z.string(),
          domain_name: z.string(),
          address_set: z.string(),
          address_line_2_set: z.string(),
          address_city_set: z.string(),
          address_state_set: z.string(),
          address_postcode_set: z.string(),
          address_country_set: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (!ctx.session.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Server failed to get session user ID',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        //TODO : validate data
        //  - name_set
        //  - domain_name
        //  - address_set
        //  - address_line_2_set
        //  - address_city_set
        //  - address_state_set
        //  - address_postcode_set
        //  - address_country_set
        try {
          const fetchOngIds = await ctx.prisma.user.findFirst({
            where: {
              id: ctx.session.user.id,
            },
            select: {
              B2E: {
                where: {
                  inUse: true,
                },
                select: {
                  ongId: true,
                },
              },
            },
          })

          if (fetchOngIds && fetchOngIds.B2E[0] !== undefined) {
            if (fetchOngIds.B2E[0].ongId) {
              const responses = await ctx.prisma.oNG.update({
                where: {
                  id: fetchOngIds.B2E[0].ongId,
                },
                data: {
                  name_set: input.name_set,
                  domain_name: input.domain_name,
                  address_set: input.address_set,
                  address_line_2_set: input.address_line_2_set,
                  address_city_set: input.address_city_set,
                  address_state_set: input.address_state_set,
                  address_postcode_set: Number(input.address_postcode_set),
                  address_country_set: input.address_country_set,
                },
              })
              return responses
            } else {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Server failed to get session Account ID',
                // optional: pass the original error to retain stack trace
                //cause: theError,
              })
            }
          } else {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: "You don't have an account connected",
              // optional: pass the original error to retain stack trace
              //cause: theError,
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
  })
