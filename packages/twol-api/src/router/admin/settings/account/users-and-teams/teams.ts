import {
  protectedProcedure,
  publicProcedure,
  createTRPCRouter,
} from '../../../../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const adminSettingsAccountUsersAndTeamsTeamsRouter = createTRPCRouter({
  /**
   * 1 - getTeamsSettings :
   * Get Teams Settings
   *
   * Fetches & returns all users from an account available depending
   * on a `userId` for fetching ong and the following filter query parameter.
   * - userId
   * - toSkip
   * - toTake
   * - searchTerm
   * - toOrderBy
   * - toOrderByStartWith
   *
   *
   */
  getTeamsSettings: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        toSkip: z.number(),
        toTake: z.number(),
        searchTerm: z.string(),
        toOrderBy: z.string(),
        toOrderByStartWith: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO validate data
      // userId | take | skip
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

      if (
        input.toTake === null ||
        input.toTake === undefined ||
        input.toSkip === null ||
        input.toSkip === undefined
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Server failed to get pagination',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      if (
        input.toOrderBy === null ||
        input.toOrderBy === undefined ||
        input.toOrderByStartWith === null ||
        input.toOrderByStartWith === undefined
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Server failed to get OrderBy data',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      if (Array.isArray(input.searchTerm)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre searchTerm ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      try {
        if (input.userId) {
          const fetchOngId = await ctx.prisma.user.findFirst({
            where: {
              id: input.userId,
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
              const take: number = +input.toTake
              const skip: number = +input.toSkip

              const searchTermFilter =
                input.searchTerm !== '' && input.searchTerm !== null
                  ? { name: { contains: input.searchTerm as string } }
                  : {}

              // Count Teams
              const teamsCount = await ctx.prisma.teams.count({
                where: {
                  ongId: fetchOngId.B2E[0].ongId,
                  ...searchTermFilter,
                },
              })
              //TODO
              // order by :
              // - teams
              // - access
              // - lastActive
              const OrderBySet =
                input.toOrderBy !== '' &&
                input.toOrderBy !== null &&
                input.toOrderByStartWith !== '' &&
                input.toOrderByStartWith !== null
                  ? input.toOrderBy === 'name'
                    ? {
                        orderBy: {
                          [input.toOrderBy as string]:
                            input.toOrderByStartWith as string,
                        },
                      }
                    : input.toOrderBy === 'child-teams'
                    ? {
                        orderBy: {
                          childTeam: {
                            _count: input.toOrderByStartWith as string,
                          },
                        },
                      }
                    : input.toOrderBy === 'users'
                    ? {
                        orderBy: {
                          B2E: {
                            _count: input.toOrderByStartWith as string,
                          },
                        },
                      }
                    : undefined
                  : undefined

              const teams = await ctx.prisma.teams.findMany({
                where: {
                  ongId: fetchOngId.B2E[0].ongId,
                  ...searchTermFilter,
                },
                select: {
                  id: true,
                  name: true,
                  _count: {
                    select: {
                      childTeam: true,
                      B2E: true,
                    },
                  },
                },
                skip: take * (skip - 1),
                take: take,
                ...OrderBySet,
              })

              const responses = {
                data: teams,
                pagination: {
                  total: teamsCount,
                  pageCount: Math.ceil(teamsCount / take),
                  currentPage: skip,
                  perPage: take,
                  from: (skip - 1) * take + 1,
                  to: (skip - 1) * take + teams.length,
                },
              }

              return responses
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
   * 2 - deleteTeamsSettings :
   * Delete Team
   *
   * Deletes a team from the database using a provided `userId` & the team "id" query
   * parameter.
   * - userId
   * - id
   *
   */
  deleteTeamsSettings: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (Array.isArray(input.userId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      if (Array.isArray(input.id)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre id ne doit pas être un tableau.',
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
        // fetch the user NGO
        const fetchOngId = await ctx.prisma.user.findFirst({
          where: {
            id: input.userId,
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
            // delete the team and remove or delete all relation
            // await prisma.$transaction([
            //   prisma.post.deleteMany({
            //     where: {
            //       site: {
            //         id: siteId,
            //       },
            //     },
            //   }),
            //   prisma.site.delete({
            //     where: {
            //       id: siteId,
            //     },
            //   }),
            // ]);
            // fetch the user NGO
            const removeRelation = await ctx.prisma.teams.update({
              where: {
                id: input.id,
              },
              data: {
                parentTeam: {
                  disconnect: true,
                },
                B2E: {
                  set: [],
                },
                childTeam: {
                  set: [],
                },
              },
            })
            await ctx.prisma.teams.delete({
              where: {
                id: input.id,
              },
            })
            return
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Server failed to get Account ID',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "You don't have an account connected.",
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
   * 3 - getTeamsDrawerSettings :
   * Get TeamsDrawer Settings
   *
   * Fetches & returns all users from an account available depending
   * on a `userId` for fetching ong and the following filter query parameter.
   * - userId
   * - id
   *
   *
   */
  getTeamsDrawerSettings: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        id: z.string().nullable(),
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
      if (Array.isArray(input.id)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre id ne doit pas être un tableau.',
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
              // if update get the selected teams settings
              if (input.id !== null) {
                const team = await ctx.prisma.teams.findMany({
                  where: {
                    ongId: fetchOngId.B2E[0].ongId,
                    id: input.id,
                  },
                  select: {
                    name: true,
                    parentTeam: {
                      select: {
                        name: true,
                        id: true,
                      },
                    },
                    B2E: {
                      select: {
                        id: true,
                        user: {
                          select: {
                            firstname: true,
                            lastname: true,
                            email: true,
                          },
                        },
                      },
                    },
                  },
                })

                // get Teams from this account
                const teams = await ctx.prisma.teams.findMany({
                  where: {
                    ongId: fetchOngId.B2E[0].ongId,
                    NOT: {
                      id: input.id,
                    },
                  },
                  select: {
                    id: true,
                    name: true,
                    parentTeamId: true,
                  },
                })

                // get Users from this account
                const users = await ctx.prisma.b2E.findMany({
                  where: {
                    ongId: fetchOngId.B2E[0].ongId,
                  },
                  select: {
                    id: true,
                    teamsId: true,
                    user: {
                      select: {
                        firstname: true,
                        lastname: true,
                        email: true,
                      },
                    },
                  },
                })
                // constuct response
                const response = {
                  team: team,
                  teams: teams,
                  users: users,
                }
                return response
              } else {


                // get Teams from this account
                const teams = await ctx.prisma.teams.findMany({
                  where: {
                    ongId: fetchOngId.B2E[0].ongId,
                  },
                  select: {
                    id: true,
                    name: true,
                    parentTeamId: true,
                  },
                })

                // get Users from this account
                const users = await ctx.prisma.b2E.findMany({
                  where: {
                    ongId: fetchOngId.B2E[0].ongId,
                  },
                  select: {
                    id: true,
                    teamsId: true,
                    user: {
                      select: {
                        firstname: true,
                        lastname: true,
                        email: true,
                      },
                    },
                  },
                })
                // constuct response
                const response = {
                  team: null,
                  teams: teams,
                  users: users,
                }

                return response
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Server failed to get Account ID',
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
            message: 'Server failed to get user ID',
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
   * 4 - createTeamsDrawerSettings :
   * Create TeamsDrawer
   *
   * Creates a new Team from a set of provided query parameters.
   * These include:
   *  - name
   *  - parentTeamId
   *  - users <Array>
   *  - userId
   *
   * Once created, the new TeamsDrawer `email` and `link` will be returned.
   *
   *
   */
  createTeamsDrawerSettings: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        parentTeamId: z.string(),
        users: z.array(z.object({ id: z.string() })),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (Array.isArray(input.userId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      if (Array.isArray(input.name)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre name ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      if (Array.isArray(input.parentTeamId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre parentTeamId ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      if (!Array.isArray(input.users)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Mauvaise requête. Le paramètre users doit être un tableau.',
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
        // check if we got user id
        if (input.userId) {
          //check if userId exist and fetch his data :
          // B2E.ongId
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
          // Check if we fetch something
          if (fetchOngId && fetchOngId.B2E[0] !== undefined) {
            // check if we fetch an NGO related to the userId
            if (fetchOngId.B2E[0].ongId) {
              // Add team in db
              // We can create the team
              if (
                input.parentTeamId &&
                input.parentTeamId !== '' &&
                input.users &&
                input.users.length > 0
              ) {
                const responseTeam = await ctx.prisma.oNG.update({
                  where: {
                    id: fetchOngId.B2E[0].ongId,
                  },
                  data: {
                    Teams: {
                      create: {
                        name: input.name,
                        B2E: {
                          connect:
                            input.users.map((user) => ({ id: user.id })) || [],
                        },
                        parentTeam: {
                          connect: {
                            id: input.parentTeamId,
                          },
                        },
                      },
                    },
                  },
                })
                if (responseTeam) {
                  return 'allGood'
                } else {
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Server failed to create the team',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              } else if (
                input.users &&
                input.users.length > 0 &&
                (!input.parentTeamId || input.parentTeamId === '')
              ) {
                const responseTeam = await ctx.prisma.oNG.update({
                  where: {
                    id: fetchOngId.B2E[0].ongId,
                  },
                  data: {
                    Teams: {
                      create: {
                        name: input.name,
                        B2E: {
                          connect:
                            input.users.map((user) => ({ id: user.id })) || [],
                        },
                      },
                    },
                  },
                })
                if (responseTeam) {
                  return 'allGood'
                } else {
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Server failed to create the team',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              } else if (
                (!input.users || input.users.length === 0) &&
                input.parentTeamId &&
                input.parentTeamId !== ''
              ) {
                const responseTeam = await ctx.prisma.oNG.update({
                  where: {
                    id: fetchOngId.B2E[0].ongId,
                  },
                  data: {
                    Teams: {
                      create: {
                        name: input.name,
                        parentTeam: {
                          connect: {
                            id: input.parentTeamId,
                          },
                        },
                      },
                    },
                  },
                })
                if (responseTeam) {
                  return 'allGood'
                } else {
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Server failed to create the team',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              } else {
                const responseTeam = await ctx.prisma.oNG.update({
                  where: {
                    id: fetchOngId.B2E[0].ongId,
                  },
                  data: {
                    Teams: {
                      create: {
                        name: input.name,
                      },
                    },
                  },
                })

                if (responseTeam) {
                  return 'allGood'
                } else {
                  throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Server failed to create the team',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Server failed to get Account ID',
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
            message: 'Server failed to get user ID',
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
   * 5 - updateTeamsDrawerSettings :
   * Update Team Settings
   *
   * Updates a Team settings using a collection of provided
   * query parameters. These include the following:
   *  - id
   *  - name
   *  - parentTeamId
   *  - users <Array>
   *  - userId
   *
   *
   */
  updateTeamsDrawerSettings: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        parentTeamId: z.string(),
        users: z.array(z.object({ id: z.string() })),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (Array.isArray(input.id)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre id ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      if (Array.isArray(input.userId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre user id ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      if (Array.isArray(input.name)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre name ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      if (Array.isArray(input.parentTeamId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre parentTeamId ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      if (!Array.isArray(input.users)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Mauvaise requête. Le paramètre users doit être un tableau.',
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
        const fetchOngId = await ctx.prisma.user.findFirst({
          where: {
            id: input.userId,
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
            if (input.parentTeamId && input.users.length > 0) {
              await ctx.prisma.$transaction([
                ctx.prisma.teams.update({
                  where: {
                    id: input.id,
                  },
                  data: {
                    B2E: {
                      set: [],
                    },
                  },
                }),
                ctx.prisma.teams.update({
                  where: {
                    id: input.id,
                  },
                  data: {
                    name: input.name,
                    parentTeam: {
                      connect: {
                        id: input.parentTeamId,
                      },
                    },
                    B2E: {
                      connect: input.users.map((user) => ({ id: user.id })),
                    },
                  },
                }),
              ])
              return
            } else if (!input.parentTeamId && input.users.length > 0) {
              await ctx.prisma.$transaction([
                ctx.prisma.teams.update({
                  where: {
                    id: input.id,
                  },
                  data: {
                    B2E: {
                      set: [],
                    },
                  },
                }),
                ctx.prisma.teams.update({
                  where: {
                    id: input.id,
                  },
                  data: {
                    name: input.name,
                    parentTeam: {
                      disconnect: true,
                    },
                    B2E: {
                      connect: input.users.map((user) => ({ id: user.id })),
                    },
                  },
                }),
              ])

              return
            } else if (!input.parentTeamId && input.users.length === 0) {
              const response = await ctx.prisma.teams.update({
                where: {
                  id: input.id,
                },
                data: {
                  name: input.name,
                  parentTeam: {
                    disconnect: true,
                  },
                  B2E: {
                    set: [],
                  },
                },
              })
              return
            } else if (input.parentTeamId && input.users.length === 0) {
              const response = await ctx.prisma.teams.update({
                where: {
                  id: input.id,
                },
                data: {
                  name: input.name,
                  parentTeam: {
                    connect: {
                      id: input.parentTeamId,
                    },
                  },
                  B2E: {
                    set: [],
                  },
                },
              })
              return
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Server failed to update the team',
                // optional: pass the original error to retain stack trace
                // cause: error,
              })
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Server failed to get Account ID',
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
