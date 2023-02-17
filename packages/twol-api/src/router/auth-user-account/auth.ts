import { protectedProcedure, publicProcedure, createTRPCRouter } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import { verifyPassword, cyrb53 } from '@twol/utils/auth/passwords'
import { decrypt } from '@twol/utils/auth/crypto'
import nodemailer from 'nodemailer'

export const authRouter = createTRPCRouter({
  /**
   * 1 - getSession :
   * Get User Session
   *
   * This endpoint is to fetch session data if a user is connected (or not)
   *
   * Will return one of the following :
   * - session
   * - unknown
   *
   */
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  /**
   * 0 - getSecretMessage :
   * Get Secret Message
   *
   * This endpoint is to fetch a secret message if connected
   * !!!!!! THIS IS FOR TESTING PURPOSE !!!!!
   * Can be deleted
   *
   * Will return one of the following :
   * - session
   * - unknown
   *
   */
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @twol/auth package
    return 'you can see this secret message!'
  }),
  /**
   * 2 - validateLoginUser :
   * Validate Login User
   *
   * This endpoint is to validate the possession of the email address before login in
   * User exist or not ? send an otp, using a collection of provided query parameters.
   * These include the following:
   *  - userEmail
   *  - userPassIv
   *  - userPassContent
   *
   * Will return one of the following :
   * - An error occured
   * - unknown
   * - alreadyActivated
   *
   */
  validateLoginUser: publicProcedure
    .input(
      z.object({
        userEmail: z.string(),
        userPassIv: z.string(),
        userPassContent: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (Array.isArray(input.userEmail)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre email ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      try {
        if (input.userEmail && input.userEmail.length !== 0) {
          //validate Email
          if (
            !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(
              input.userEmail
            )
          ) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Mauvaise requête. Le paramètre email est incorrect.',
              // optional: pass the original error to retain stack trace
              //cause: theError,
            })
          }
          const uEmail = input.userEmail as string

          if (input.userPassIv === '' || input.userPassContent === '') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message:
                'Mauvaise requête. Le format du paramètre mot de passe est incorrect.',
              // optional: pass the original error to retain stack trace
              //cause: theError,
            })
          }
          const hash = {
            iv: input.userPassIv as string,
            content: input.userPassContent as string,
          }
          const uPass = decrypt(hash) as string

          // Check if user exist and if password match
          const userCheck = await ctx.prisma.b2E.findFirst({
            where: {
              status: 2,
              inUse: true,
              user: {
                email: uEmail,
              },
            },
            select: {
              user: {
                select: {
                  password: true,
                },
              },
            },
          })

          if (userCheck !== null) {
            // LET'S CHECK IF PASSWORD IS SIMILAR
            const passwordRef: string =
              userCheck.user?.password || 'no_password_found'
            const isValid = await verifyPassword(uPass, passwordRef)
            if (!isValid) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Mauvaise requête. Le mot de passe est incorrect.',
                // optional: pass the original error to retain stack trace
                //cause: theError,
              })
            }
            // generate token
            const randomNumber = Math.floor(Math.random() * 1000000000)
            function LeftPadWithZeros(number: number, length: number) {
              var str = '' + number
              while (str.length < length) {
                str = '0' + str
              }
              return str
            }
            const randomNumberToSend = LeftPadWithZeros(randomNumber, 9)

            async function wrapedSendMail() {
              return new Promise((resolve, reject) => {
                // send email
                const transporter = nodemailer.createTransport({
                  port: process.env.EMAIL_PORT as unknown as number,
                  host: process.env.EMAIL_HOST,
                  auth: {
                    user: process.env.EMAIL_NAME,
                    pass: process.env.EMAIL_PASS,
                  },
                  secure: true,
                })

                const mailData = {
                  from: process.env.EMAIL_NAME,
                  to: uEmail,
                  subject: `T-WOL.com | Votre code d'activation`,
                  text:
                    "Voici votre code d'activation : " +
                    randomNumberToSend +
                    ' (ne dure que 15min)',
                  html:
                    "<div>Voici votre code d'activation : " +
                    randomNumberToSend +
                    ' (ne dure que 15min)</div>',
                }

                transporter.sendMail(mailData, async function (err, info) {
                  if (err) {
                    resolve(false)
                  } else {
                    resolve(true)
                  }
                })
              })
            }

            let resp = await wrapedSendMail()
            if (resp) {
              //Hash the email
              const hashEmail = await cyrb53(uEmail)

              function addMinutes(numOfMinutes: number, date = new Date()) {
                date.setMinutes(date.getMinutes() + numOfMinutes)
                return date
              }

              // Add 15 minutes to current Date
              const date = addMinutes(15)

              //Insert token dans la database
              const response = await ctx.prisma.verificationToken.create({
                data: {
                  identifier: hashEmail,
                  token: randomNumberToSend,
                  expires: date,
                },
              })
              if (response) {
                const result = 'allGood'
                return result
              } else {
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message:
                    'An unexpected error occurred, otp is not saved,please try again later.',
                  // optional: pass the original error to retain stack trace
                  // cause: theError,
                })
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message:
                  'An unexpected error occurred, the email has not been send, please try again later.',
                // optional: pass the original error to retain stack trace
                // cause: theError,
              })
            }
          } else {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Mauvaise requête. User unknown.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }
        } else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Mauvaise requête. Le paramêtre email est invalid.',
            // optional: pass the original error to retain stack trace
            // cause: theError,
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
   * 3 - accessAndRole :
   * Access And Role
   *
   * This endpoint is to fetch permission sets if connected using a collection
   * of provided query parameters. These include the following:
   *  - userEmail
   *  - userPassIv
   *  - userPassContent
   *
   * Will return one of the following :
   * - session
   * - unknown
   *
   */
  accessAndRole: protectedProcedure
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

      try {
        if (input.userId && input.userId.length !== 0) {
          //validate userId format
          if (!/^[a-z0-9]*$/i.test(input.userId)) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Mauvaise requête. Le paramêtre userId est invalid.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }
          if (input.userId !== ctx.session.user.id) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message:
                'Mauvaise requête. Le paramêtre userId ne correspond pas à la session en cours.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }

          const uId = input.userId as string

          const dataUser = await ctx.prisma.user.findFirst({
            where: {
              id: uId,
            },
            select: {
              dateFormat: true,
              email: true,
              firstname: true,
              image: true,
              lastname: true,
              language: true,
              B2E: {
                where: {
                  inUse: true,
                },
                select: {
                  defaultHomepage: true,
                  role: true,
                  ongId: true,
                  PermissionSets: {
                    select: {
                      name: true,
                      accountOwner: true,
                      super_admin: true,
                      crm_contacts_delete: true,
                      crm_contacts_edit: true,
                      crm_contacts_view: true,
                      crm_companies_delete: true,
                      crm_companies_edit: true,
                      crm_companies_view: true,
                      crm_deals_delete: true,
                      crm_deals_edit: true,
                      crm_deals_view: true,
                      crm_tickets_delte: true,
                      crm_tickets_edit: true,
                      crm_tickets_view: true,
                      crm_tasks_edit: true,
                      crm_tasks_view: true,
                      crm_notes_view: true,
                      crm_custom_objects_delete: true,
                      crm_custom_objects_edit: true,
                      crm_custom_objects_view: true,
                      crm_workflows_delete: true,
                      crm_workflows_edit: true,
                      crm_workflows_view: true,
                      crm_communicate: true,
                      crm_bulk_delete: true,
                      crm_import: true,
                      crm_export: true,
                      crm_edit_property_settings: true,
                      crm_chatflows: true,
                      crm_customs_views: true,
                      marketing_lists_edit: true,
                      marketing_lists_view: true,
                      marketing_forms: true,
                      marketing_files: true,
                      marketing_marketing_access: true,
                      marketing_ads_publish: true,
                      marketing_ads_view: true,
                      marketing_campaigns_edit: true,
                      marketing_campaigns_view: true,
                      marketing_email_edit: true,
                      marketing_email_publish: true,
                      marketing_email_view: true,
                      marketing_social: true,
                      marketing_content_staging: true,
                      marketing_blog_edit: true,
                      marketing_blog_publish: true,
                      marketing_blog_view: true,
                      marketing_landing_pages_edit: true,
                      marketing_landing_pages_publish: true,
                      marketing_landing_pages_view: true,
                      marketing_website_pages_edit: true,
                      marketing_website_pages_publish: true,
                      marketing_website_pages_view: true,
                      marketing_hubdb_edit: true,
                      marketing_hubdb_publish: true,
                      marketing_hubdb_view: true,
                      marketing_url_redirects_edit: true,
                      marketing_url_redirects_view: true,
                      marketing_design_tools: true,
                      sales_manage_product_library: true,
                      sales_create_custom_line_items: true,
                      sales_sales_access: true,
                      sales_templates: true,
                      sales_create_scheduling_pages_for_others: true,
                      sales_sales_professional: true,
                      sales_forecast_edit: true,
                      sales_forecast_view: true,
                      sales_playbooks_edit: true,
                      sales_playbooks_publish: true,
                      sales_playbooks_view: true,
                      sales_sequences: true,
                      sales_bulk_enroll_sequences: true,
                      sales_manage_payment_links: true,
                      sales_manage_payments_and_subscriptions: true,
                      service_service_access: true,
                      service_templates: true,
                      service_create_scheduling_pages_for_others: true,
                      reports_data_quality_tools_access: true,
                      reports_reports_access: true,
                      reports_dashboard_reports_and_analytics_create: true,
                      reports_dashboard_reports_and_analytics_edit: true,
                      reports_dashboard_reports_and_analytics_view: true,
                      reports_marketing_reports: true,
                      account_marketing_contacts_access: true,
                      account_app_marketplace_access: true,
                      account_asset_marketplace_access: true,
                      account_gdpr_delete_contacts: true,
                      account_hubdb_table_settings: true,
                      account_global_content_settings: true,
                      account_website_settings: true,
                      account_reports_and_dashboards: true,
                      account_domain_settings: true,
                      account_account_access: true,
                      account_add_and_edit_users: true,
                      account_add_and_edit_teams: true,
                      account_partition_by_teams: true,
                      account_presets: true,
                      account_edit_account_defaults: true,
                      account_modify_billing_and_change_name_on_contract: true,
                      account_add_and_edit_developer_apps_and_test_accounts:
                        true,
                      account_user_table_access: true,
                      account_availability_management: true,
                    },
                  },
                },
              },
            },
          })

          if (dataUser === null && uId.length !== 0) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: "Mauvaise requête. l'utilisateur n'existe pas.",
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          } else if (dataUser !== null && dataUser.B2E[0] !== undefined) {
            const oId = dataUser.B2E[0].ongId as string
            const dataONG = await ctx.prisma.oNG.findUnique({
              where: {
                id: oId,
              },
              select: {
                registered_name: true,
                account_name: true,
                id: true,
              },
            })

            if (dataONG === null && oId.length !== 0) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message:
                  "Mauvaise requête. l'utilisateur n'est lié a aucun compte.",
                // optional: pass the original error to retain stack trace
                // cause: theError,
              })
            } else if (dataONG !== null) {
              const dataOngConnected = await ctx.prisma.b2E.findMany({
                where: {
                  userId: uId,
                  status: 2,
                },
                select: {
                  inUse: true,
                  ong: {
                    select: {
                      registered_name: true,
                      account_name: true,
                    },
                  },
                  ongId: true,
                  role: true,
                },
              })

              if (dataOngConnected === null && uId.length !== 0) {
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  message:
                    "Mauvaise requête. l'utilisateur n'a pas de compte lié.",
                  // optional: pass the original error to retain stack trace
                  // cause: theError,
                })
              } else if (dataOngConnected !== null) {
                let ongName: string
                if (dataONG.account_name !== null) {
                  ongName = dataONG.account_name
                } else {
                  ongName = dataONG.registered_name
                }

                const available = {
                  dateFormat: dataUser.dateFormat,
                  defaultHomepage: dataUser.B2E[0].defaultHomepage,
                  email: dataUser.email,
                  firstname: dataUser.firstname,
                  fullName: dataUser.firstname + ' ' + dataUser.lastname,
                  image: dataUser.image,
                  inUseOngId: dataONG.id,
                  inUseOngName: ongName,
                  language: dataUser.language,
                  lastname: dataUser.lastname,
                  ongConnected: dataOngConnected,
                  role: dataUser.B2E[0].role,
                  permissionSet: dataUser.B2E[0].PermissionSets,
                }
                return available
              } else {
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message:
                    'An unexpected error occurred, please try again later.',
                  // optional: pass the original error to retain stack trace
                  // cause: error,
                })
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message:
                  'An unexpected error occurred, please try again later.',
                // optional: pass the original error to retain stack trace
                // cause: error,
              })
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An unexpected error occurred, please try again later.',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
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
   * 4 - changeAccount :
   * Change Account
   *
   * This endpoint is to switch from an account to another using a collection of provided
   * query parameters. These include the following:
   *  - userEmail
   *  - userPassIv
   *  - userPassContent
   *
   * Will return one of the following :
   * - An error occured
   * - unknown
   * - alreadyActivated
   *
   */
  changeAccount: protectedProcedure
    .input(
      z.object({
        ongId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (Array.isArray(input.ongId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre email ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      try {
        if (input.ongId && input.ongId.length !== 0) {
          //validate userId format
          if (!/^[a-z0-9]*$/i.test(input.ongId)) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Mauvaise requête. Le paramêtre ongId est invalid.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }

          if (ctx.session.user.id?.length === 0) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: "Mauvaise requête. Il n'y a pas de session.",
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }

          const oId = input.ongId as string

          const stopAccount = await ctx.prisma.b2E.updateMany({
            where: {
              userId: ctx.session.user.id,
              inUse: true,
            },
            data: {
              inUse: false,
            },
          })

          if (!stopAccount) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An unexpected error occurred while switching account.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }

          const activateAccount = await ctx.prisma.b2E.updateMany({
            where: {
              ongId: oId,
              userId: ctx.session.user.id,
            },
            data: {
              inUse: true,
            },
          })

          if (!activateAccount) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An unexpected error occurred while switching account.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }

          const dataONG = await ctx.prisma.oNG.findUnique({
            where: {
              id: oId,
            },
            select: {
              registered_name: true,
              name_set: true,
              id: true,
              B2E: {
                where: {
                  userId: ctx.session.user.id,
                  inUse: true,
                },
                select: {
                  role: true,
                  defaultHomepage: true,
                  PermissionSets: {
                    select: {
                      name: true,
                      accountOwner: true,
                      super_admin: true,
                      crm_contacts_delete: true,
                      crm_contacts_edit: true,
                      crm_contacts_view: true,
                      crm_companies_delete: true,
                      crm_companies_edit: true,
                      crm_companies_view: true,
                      crm_deals_delete: true,
                      crm_deals_edit: true,
                      crm_deals_view: true,
                      crm_tickets_delte: true,
                      crm_tickets_edit: true,
                      crm_tickets_view: true,
                      crm_tasks_edit: true,
                      crm_tasks_view: true,
                      crm_notes_view: true,
                      crm_custom_objects_delete: true,
                      crm_custom_objects_edit: true,
                      crm_custom_objects_view: true,
                      crm_workflows_delete: true,
                      crm_workflows_edit: true,
                      crm_workflows_view: true,
                      crm_communicate: true,
                      crm_bulk_delete: true,
                      crm_import: true,
                      crm_export: true,
                      crm_edit_property_settings: true,
                      crm_chatflows: true,
                      crm_customs_views: true,
                      marketing_lists_edit: true,
                      marketing_lists_view: true,
                      marketing_forms: true,
                      marketing_files: true,
                      marketing_marketing_access: true,
                      marketing_ads_publish: true,
                      marketing_ads_view: true,
                      marketing_campaigns_edit: true,
                      marketing_campaigns_view: true,
                      marketing_email_edit: true,
                      marketing_email_publish: true,
                      marketing_email_view: true,
                      marketing_social: true,
                      marketing_content_staging: true,
                      marketing_blog_edit: true,
                      marketing_blog_publish: true,
                      marketing_blog_view: true,
                      marketing_landing_pages_edit: true,
                      marketing_landing_pages_publish: true,
                      marketing_landing_pages_view: true,
                      marketing_website_pages_edit: true,
                      marketing_website_pages_publish: true,
                      marketing_website_pages_view: true,
                      marketing_hubdb_edit: true,
                      marketing_hubdb_publish: true,
                      marketing_hubdb_view: true,
                      marketing_url_redirects_edit: true,
                      marketing_url_redirects_view: true,
                      marketing_design_tools: true,
                      sales_manage_product_library: true,
                      sales_create_custom_line_items: true,
                      sales_sales_access: true,
                      sales_templates: true,
                      sales_create_scheduling_pages_for_others: true,
                      sales_sales_professional: true,
                      sales_forecast_edit: true,
                      sales_forecast_view: true,
                      sales_playbooks_edit: true,
                      sales_playbooks_publish: true,
                      sales_playbooks_view: true,
                      sales_sequences: true,
                      sales_bulk_enroll_sequences: true,
                      sales_manage_payment_links: true,
                      sales_manage_payments_and_subscriptions: true,
                      service_service_access: true,
                      service_templates: true,
                      service_create_scheduling_pages_for_others: true,
                      reports_data_quality_tools_access: true,
                      reports_reports_access: true,
                      reports_dashboard_reports_and_analytics_create: true,
                      reports_dashboard_reports_and_analytics_edit: true,
                      reports_dashboard_reports_and_analytics_view: true,
                      reports_marketing_reports: true,
                      account_marketing_contacts_access: true,
                      account_app_marketplace_access: true,
                      account_asset_marketplace_access: true,
                      account_gdpr_delete_contacts: true,
                      account_hubdb_table_settings: true,
                      account_global_content_settings: true,
                      account_website_settings: true,
                      account_reports_and_dashboards: true,
                      account_domain_settings: true,
                      account_account_access: true,
                      account_add_and_edit_users: true,
                      account_add_and_edit_teams: true,
                      account_partition_by_teams: true,
                      account_presets: true,
                      account_edit_account_defaults: true,
                      account_modify_billing_and_change_name_on_contract: true,
                      account_add_and_edit_developer_apps_and_test_accounts:
                        true,
                      account_user_table_access: true,
                      account_availability_management: true,
                    },
                  },
                },
              },
            },
          })

          if (!dataONG) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message:
                'An unexpected error occurred while fetching user data for new NGO, please try again later.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }

          const dataOngConnected = await ctx.prisma.b2E.findMany({
            where: {
              userId: ctx.session.user.id,
            },
            select: {
              role: true,
              ongId: true,
              inUse: true,
              ong: {
                select: {
                  registered_name: true,
                  name_set: true,
                },
              },
            },
          })

          if (dataOngConnected === null && ctx.session.user.id!.length !== 0) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message:
                "An unexpected error occurred while fetching user's connected NGO data, please try again later.",
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }
          let ongName: string
          if (dataONG.name_set !== null) {
            ongName = dataONG.name_set
          } else {
            ongName = dataONG.registered_name
          }
          if (dataONG.B2E[0] !== undefined) {
            const available = {
              defaultHomepage: dataONG.B2E[0].defaultHomepage,
              inUseOngId: dataONG.id,
              inUseOngName: ongName,
              role: dataONG.B2E[0].role,
              ongConnected: dataOngConnected,
              permissionSet: dataONG.B2E[0].PermissionSets,
            }
            return available
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message:
                "An unexpected error occurred while fetching user's connected NGO data, please try again later.",
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            "An unexpected error occurred, please try again later.",
          // optional: pass the original error to retain stack trace
          cause: error,
        })
      }
    })
})
