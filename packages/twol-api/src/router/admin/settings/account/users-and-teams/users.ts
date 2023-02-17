import {
  protectedProcedure,
  publicProcedure,
  createTRPCRouter,
} from '../../../../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const adminSettingsAccountUsersAndTeamsUsersRouter = createTRPCRouter({
  /**
   * 1 - getUsersSettings :
   * Get Users Settings
   * Fetches & returns all users from an account available dependin
   * on a `userId` for fetching ong and the following filter query parameter.
   * - userId
   * - toSkip
   * - toTake
   * - searchTerm
   * - toOrderBy
   * - toOrderByStartWith
   * - Status
   * - Permission
   * - Partner
   *
   *
   */
  getUsersSettings: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        toSkip: z.string(),
        toTake: z.string(),
        searchTerm: z.string(),
        toOrderBy: z.string(),
        toOrderByStartWith: z.string(),
        Status: z.string(),
        Permission: z.string(),
        Partner: z.string(),
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
              const take: number = +input.toTake
              const skip: number = +input.toSkip

              const searchTermFilter =
                input.searchTerm !== '' && input.searchTerm !== null
                  ? {
                      OR: [
                        {
                          user: {
                            firstname: { contains: input.searchTerm as string },
                          },
                        },
                        {
                          user: {
                            lastname: { contains: input.searchTerm as string },
                          },
                        },
                        {
                          user: {
                            email: { contains: input.searchTerm as string },
                          },
                        },
                      ],
                    }
                  : {}

              // Filters
              // TO DO add permission and Partner
              const FiltersSet =
                input.Status !== undefined &&
                input.Status !== '' &&
                input.Status !== null &&
                input.Permission !== '' &&
                input.Permission !== undefined &&
                input.Permission !== null &&
                input.Partner !== '' &&
                input.Partner !== undefined &&
                input.Partner !== null
                  ? {
                      status:
                        input.Status === 'Active'
                          ? 2
                          : input.Status === 'Pending'
                          ? 1
                          : input.Status === 'Uninvited'
                          ? 3
                          : 4,
                      permission: input.Permission,
                      partner: input.Partner,
                    }
                  : input.Status !== undefined &&
                    input.Status !== '' &&
                    input.Status !== null &&
                    (input.Permission === '' ||
                      input.Permission === undefined ||
                      input.Permission === null) &&
                    (input.Partner === '' ||
                      input.Partner === undefined ||
                      input.Partner === null)
                  ? {
                      status:
                        input.Status === 'Active'
                          ? 2
                          : input.Status === 'Pending'
                          ? 1
                          : input.Status === 'Uninvited'
                          ? 3
                          : 4,
                    }
                  : input.Status !== '' &&
                    input.Status !== undefined &&
                    input.Status !== null &&
                    input.Permission !== '' &&
                    input.Permission !== undefined &&
                    input.Permission !== null &&
                    (input.Partner === '' ||
                      input.Partner === undefined ||
                      input.Partner === null)
                  ? {
                      status:
                        input.Status === 'Active'
                          ? 2
                          : input.Status === 'Pending'
                          ? 1
                          : input.Status === 'Uninvited'
                          ? 3
                          : 4,
                      permission: input.Permission,
                    }
                  : input.Status !== '' &&
                    input.Status !== undefined &&
                    input.Status !== null &&
                    (input.Permission === '' ||
                      input.Permission === undefined ||
                      input.Permission === null) &&
                    input.Partner !== '' &&
                    input.Partner !== undefined &&
                    input.Partner !== null
                  ? {
                      status:
                        input.Status === 'Active'
                          ? 2
                          : input.Status === 'Pending'
                          ? 1
                          : input.Status === 'Uninvited'
                          ? 3
                          : 4,
                      partner: input.Partner,
                    }
                  : (input.Status === '' ||
                      input.Status === undefined ||
                      input.Status === null) &&
                    input.Permission !== '' &&
                    input.Permission !== undefined &&
                    input.Permission !== null &&
                    input.Partner !== '' &&
                    input.Partner !== undefined &&
                    input.Partner !== null
                  ? {
                      permission: input.Permission,
                      partner: input.Partner,
                    }
                  : (input.Status === '' ||
                      input.Status === undefined ||
                      input.Status === null) &&
                    input.Permission !== '' &&
                    input.Permission !== undefined &&
                    input.Permission !== null &&
                    (input.Partner === '' ||
                      input.Partner === undefined ||
                      input.Partner === null)
                  ? {
                      permission: input.Permission,
                    }
                  : (input.Status === '' ||
                      input.Status === undefined ||
                      input.Status === null) &&
                    (input.Permission === '' ||
                      input.Permission === undefined ||
                      input.Permission === null) &&
                    input.Partner !== '' &&
                    input.Partner !== undefined &&
                    input.Partner !== null
                  ? {
                      partner: input.Partner,
                    }
                  : {}

              // Count Team Mates
              const teammatesCount = await ctx.prisma.b2E.count({
                where: {
                  ongId: fetchOngId.B2E[0].ongId,
                  ...searchTermFilter,
                  ...FiltersSet,
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
                  ? input.toOrderBy === 'firstname'
                    ? {
                        orderBy: {
                          user: {
                            [input.toOrderBy as string]:
                              input.toOrderByStartWith as string,
                          },
                        },
                      }
                    : input.toOrderBy === 'teams'
                    ? {
                        orderBy: {
                          teams: {
                            ['name' as string]:
                              input.toOrderByStartWith as string,
                          },
                        },
                      }
                    : input.toOrderBy === 'access'
                    ? {
                        orderBy: {
                          user: {
                            [input.toOrderBy as string]:
                              input.toOrderByStartWith as string,
                          },
                        },
                      }
                    : input.toOrderBy === 'lastActive'
                    ? {
                        orderBy: {
                          user: {
                            [input.toOrderBy as string]:
                              input.toOrderByStartWith as string,
                          },
                        },
                      }
                    : undefined
                  : undefined

              const teammates = await ctx.prisma.b2E.findMany({
                where: {
                  ongId: fetchOngId.B2E[0].ongId,
                  ...searchTermFilter,
                  ...FiltersSet,
                },
                select: {
                  user: {
                    select: {
                      firstname: true,
                      lastname: true,
                      email: true,
                      image: true,
                    },
                  },
                  role: true,
                  status: true,
                  teams: {
                    select: {
                      name: true,
                    },
                  },
                  PermissionSets: {
                    select: {
                      name: true,
                      accountOwner: true,
                      super_admin: true,
                      sales_sales_professional: true,
                      marketing_marketing_access: true,
                      sales_sales_access: true,
                      service_service_access: true,
                      reports_reports_access: true,
                      account_account_access: true,
                    },
                  },
                },
                skip: take * (skip - 1),
                take: take,
                ...OrderBySet,
              })

              let dataToSend: {
                user: {
                  firstname: string
                  lastname: string
                  email: string
                  image: string
                }
                role: number
                status: number
                teams: string
                PermissionSets: {
                  name: string | null | undefined
                  access: {
                    AccountOwner: boolean
                    SuperAdmin: boolean
                    SalesProfessional: boolean
                    Marketing: boolean
                    Sales: boolean
                    Service: boolean
                    Reports: boolean
                    Account: boolean
                  }
                }
              }[] = []

              if (teammates.length > 0) {
                teammates.map((teammate) => {
                  dataToSend.push({
                    user: {
                      firstname: teammate.user?.firstname!,
                      lastname: teammate.user?.lastname!,
                      email: teammate.user?.email!,
                      image: teammate.user?.image!,
                    },
                    role: teammate.role,
                    status: teammate.status,
                    teams: teammate.teams?.name!,
                    PermissionSets: {
                      name: teammate.PermissionSets?.name,
                      access: {
                        AccountOwner: teammate.PermissionSets?.accountOwner!,
                        SuperAdmin: teammate.PermissionSets?.super_admin
                          ? teammate.PermissionSets?.super_admin
                          : false,
                        SalesProfessional:
                          teammate.PermissionSets?.sales_sales_professional!,
                        Marketing:
                          teammate.PermissionSets?.marketing_marketing_access!,
                        Sales: teammate.PermissionSets?.sales_sales_access!,
                        Service:
                          teammate.PermissionSets?.service_service_access!,
                        Reports:
                          teammate.PermissionSets?.reports_reports_access!,
                        Account:
                          teammate.PermissionSets?.account_account_access!,
                      },
                    },
                  })
                })
              }

              const response = {
                data: dataToSend,
                pagination: {
                  total: teammatesCount,
                  pageCount: Math.ceil(teammatesCount / take),
                  currentPage: skip,
                  perPage: take,
                  from: (skip - 1) * take + 1,
                  to: (skip - 1) * take + teammates.length,
                },
              }

              return response
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
   * 2 - updateUsersSettings :
   * Update Account Settings
   *
   * Updates an Account settings using a collection of provided
   * query parameters. These include the following:
   *  - account_name
   *  - dateFormat
   *  - fiscalYear
   *
   *
   */
  updateUsersSettings: protectedProcedure
    .input(
      z.object({
        account_name: z.string(),
        dateFormat: z.string(),
        fiscalYear: z.string(),
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
      //  - account_name
      //  - dateFormat
      //  - fiscalYear
      try {
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
            const response = await ctx.prisma.oNG.update({
              where: {
                id: fetchOngId.B2E[0].ongId,
              },
              data: {
                account_name: input.account_name,
                dateFormat: input.dateFormat,
                fiscalYear: input.fiscalYear,
              },
            })
            return response
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
   * 3 - updateUsersExtraSettings :
   * Update Account Settings
   *
   * Updates an Account settings using a collection of provided
   * query parameters. These include the following:
   *  - account_name
   *  - dateFormat
   *  - fiscalYear
   *
   *
   */
  updateUsersExtraSettings: protectedProcedure
    .input(
      z.object({
        account_name: z.string(),
        dateFormat: z.string(),
        fiscalYear: z.string(),
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
      //  - account_name
      //  - dateFormat
      //  - fiscalYear
      try {
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
            const response = await ctx.prisma.oNG.update({
              where: {
                id: fetchOngId.B2E[0].ongId,
              },
              data: {
                account_name: input.account_name,
                dateFormat: input.dateFormat,
                fiscalYear: input.fiscalYear,
              },
            })
            return response
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
   * 4 - createUsersExtraSettings :
   * Create Users
   *
   * Creates a new user or multiple user from a set of provided query parameters.
   * These include:
   *  - emails : <Array>
   *  - userId : string
   *  - team : string
   *
   * Once created, the new Users `email` and `link` will be returned.
   *
   */
  createUsersExtraSettings: protectedProcedure
    .input(
      z.object({
        emails: z.array(z.string()),
        team: z.object({value: z.string()}),
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
      if (!Array.isArray(input.emails)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre emails doit être un tableau.',
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
          // firstname | lastname | B2E.ongId
          const fetchOngId = await ctx.prisma.user.findFirst({
            where: {
              id: ctx.session.user.id,
            },
            select: {
              firstname: true,
              lastname: true,
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
              // pour chaque email :
              // check if exist or not
              // add team

              //1 - for each email :
              function proccessEmails() {
                return new Promise((resolve, reject) => {
                  // var proccessEmails = new Promise((resolve, reject) => {
                  input.emails.forEach(
                    async (id: string, key: number, array: string | any[]) => {
                      // 2- check if exist or not
                      const existOrNot = await ctx.prisma.b2E.findFirst({
                        where: {
                          id: id,
                          ongId: fetchOngId?.B2E[0]?.ongId as string,
                        },
                      })

                      if (existOrNot) {
                        if (input.team) {
                          // if user exist on this account add extra settings
                          const updateUser = await ctx.prisma.b2E.update({
                            where: {
                              id: id,
                            },
                            data: {
                              teams: {
                                connect: {
                                  id: input.team.value,
                                },
                              },
                            },
                          })
                          if (updateUser) {
                            if (key === array.length - 1) {
                              resolve(true)
                            }
                          } else {
                            // error to return
                            if (key === array.length - 1) {
                              resolve(true)
                            }
                          }
                        } else {
                          // if no extra settings to add
                          if (key === array.length - 1) {
                            resolve(true)
                          }
                        }
                      } else {
                        // if user does not exist
                        if (key === array.length - 1) {
                          resolve(true)
                        }
                      }
                    }
                  )
                })
              }
              // add extra for each email and get response
              let respProccessEmails = await proccessEmails()
              if (respProccessEmails) {
                return
              } else {
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message: 'Server failed to save extra users data',
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
})
