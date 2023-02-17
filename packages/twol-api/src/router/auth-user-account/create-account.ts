import { protectedProcedure, publicProcedure, createTRPCRouter } from '../../trpc'
import { hashPassword, cyrb53 } from '@twol/utils/auth/passwords'
import { decrypt } from '@twol/utils/auth/crypto'
import { compare } from 'bcryptjs'
import nodemailer from 'nodemailer'

import { z } from 'zod'
import { TRPCError } from '@trpc/server'

/**
 * Bellow are creation of Charity Account
 */
export const createAccountRouter = createTRPCRouter({
  /**
   * 1 - checkCharityIsAvailable :
   * Check charity is available
   *
   * This endpoint is to check if a charity still has its activate parameter
   * configured correctly. Is this charity already actcivated or not ? using a collection of
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
  checkCharityIsAvailable: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (Array.isArray(input)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            "Mauvaise requête. Le paramètre numéro d'organisme caritatif ne peut pas être un tableau.",
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      try {
        if (input && input.length !== 0) {
          const cNumber = (input as string).replace(/\D/g, '')

          const data = await ctx.prisma.oNG.findUnique({
            where: {
              registered_charity_number: cNumber,
            },
            select: {
              registered_name: true,
              activated: true,
            },
          })

          if (data === null && cNumber.length !== 0) {
            return {
              checkCharityIsAvailable: 'unknown',
            }
          } else if (data !== null) {
            return {
              checkCharityIsAvailable: data,
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An unexpected error occurred, please try again later.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
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
   * 2 - checkUserAlreadyExist :
   * Check User Already Exist
   *
   * This endpoint is to check if the user who create the account
   * already exist in the database our not using a collection of
   * provided query parameters. These include the following:
   *  - email
   *
   *
   * Will return one of the following :
   * - An error occured
   * - unknown
   * - alreadyActivated
   * -
   */
  checkUserAlreadyExist: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (Array.isArray(input)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre email ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      try {
        if (input && input.length !== 0) {
          //validate Email
          if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(input)) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Mauvaise requête. Le paramètre email est invalid.',
              // optional: pass the original error to retain stack trace
              //cause: theError,
            })
          }
          const uEmail = input as string

          const data = await ctx.prisma.user.findUnique({
            where: {
              email: uEmail,
            },
            select: {
              password: true,
              firstname: true,
              lastname: true,
              marketingAccept: true,
            },
          })

          if (data === null && uEmail.length !== 0) {
            return {
              checkUserAlreadyExist: 'unknown',
            }
          } else if (data !== null) {
            let passwordSet: boolean = false,
              firstnameSet: boolean = false,
              lastnameSet: boolean = false,
              marketingAccept: boolean | null
            if (data.password !== null) {
              passwordSet = true
            }
            if (data.firstname !== null) {
              firstnameSet = true
            }
            if (data.lastname !== null) {
              lastnameSet = true
            }
            marketingAccept = data.marketingAccept
            const available: {} = {
              passwordSet,
              firstnameSet,
              lastnameSet,
              marketingAccept,
            }
            return {
              checkUserAlreadyExist: available,
            }
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An unexpected error occurred, please try again later.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
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
   * 3 - verifyUserExist :
   * Verify User Exist
   *
   * This endpoint is to send an email to user to validate the possession using
   * a collection of provided query parameters. These include the following:
   *  - email
   *  - password
   *  - passwordConfirmation
   *
   *
   * Will return one of the following :
   * - An error occured
   * - unknown
   * - alreadyActivated
   * -
   */
  verifyUserExist: publicProcedure
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
              message: 'Mauvaise requête. Le paramètre email est inccorect.',
              // optional: pass the original error to retain stack trace
              //cause: theError,
            })
          }
          const uEmail = input.userEmail as string

          if (input.userPassIv === '' || input.userPassContent === '') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message:
                'Mauvaise requête. Le format du paramètre mot de passe est inccorect.',
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
          const userCheck = await ctx.prisma.user.findFirst({
            where: {
              email: uEmail,
            },
            select: {
              password: true,
            },
          })

          if (userCheck !== null) {
            if (userCheck.password !== null) {
              const isValid = await compare(uPass, userCheck.password)
              if (isValid) {
              } else {
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  message: 'Mauvaise requête. Le mot de passe est inccorect.',
                  // optional: pass the original error to retain stack trace
                  //cause: theError,
                })
              }
            }
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
            //Hash the password
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
                  'An unexpected error occurred, otp is not saved, please try again later.',
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
   * 4 - activateONG :
   * Activate ONG
   *
   * This endpoint is to create a new NGO account using a collection of provided
   * query parameters. These include the following:
   *  - charityNumber
   *  - firstName
   *  - lastName
   *  - email
   *  - password
   *  - passwordConfirmation
   *  - marketingAccept
   *  - activated
   *  - verificationNumber
   *
   *
   * Will return one of the following :
   * - An error occured
   * - unknown
   * - alreadyActivated
   * -
   */
  activateONG: publicProcedure
    .input(
      z.object({
        charityNumber: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        language: z.string(),
        email: z.string(),
        passwordIv: z.string(),
        passwordContent: z.string(),
        passwordConfirmationIv: z.string(),
        passwordConfirmationContent: z.string(),
        marketingAccept: z.boolean(),
        activated: z.boolean(),
        verificationNumber: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 0- Validate data before processing them
      const given_charity_number_set: string = input.charityNumber.replace(
        /\D/g,
        ''
      )
      const given_verificationNumber: string = input.verificationNumber.replace(
        /\D/g,
        ''
      )
      if (given_charity_number_set.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            "Mauvaise requête. Le paramètre numéro d'organisme caritatif est incorrect.",
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      if (given_verificationNumber.length !== 9) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre numéro de vérification est incorrect.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      //validate Email
      if (
        !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(input.email)
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Mauvaise requête. Le paramètre email est incorrect.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      //validate First and last name
      if (!input.firstName || !input.lastName) {
      } else {
        if (
          !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(
            input.firstName
          )
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Mauvaise requête. Le paramètre prénom est incorrect.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (
          !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(
            input.lastName
          )
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Le paramètre nom de famille est incorrect.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
      }
      /* TODO - MANAGE LANGUAGE  */
      if (input.language !== 'fr') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Mauvaise requête. Le paramètre langue est incorrect.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      if (
        input.passwordIv === '' ||
        input.passwordContent === '' ||
        input.passwordConfirmationIv === '' ||
        input.passwordConfirmationContent === ''
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le format du paramètre mot de passe est incorrect.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      const hashPasswordReceived = {
        iv: input.passwordIv as string,
        content: input.passwordContent as string,
      }
      const password = decrypt(hashPasswordReceived) as string

      const hashPasswordConfirmationReceived = {
        iv: input.passwordConfirmationIv as string,
        content: input.passwordConfirmationContent as string,
      }
      const passwordConfirmation = decrypt(
        hashPasswordConfirmationReceived
      ) as string

      if (password !== passwordConfirmation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. La comfirmation du mot de passe ne correspond pas avec le mot de passe',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      const hashedPassword = await hashPassword(password)
      if (
        input.marketingAccept !== true &&
        input.marketingAccept !== null &&
        input.marketingAccept !== false
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre Marketing optin est incorrect.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      try {
        //0- First Check the OTP
        //Hash the email
        const hashEmail = await cyrb53(input.email)
        const date = new Date()
        date.setDate(date.getDate())

        //0.1 -- delete outdated token
        const deleteOutdatedOTP = await ctx.prisma.verificationToken.deleteMany(
          {
            where: {
              expires: {
                lte: date,
              },
            },
          }
        )
        if (deleteOutdatedOTP === null) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
            // optional: pass the original error to retain stack trace
            // cause: error,
          })
        }

        const checkOTP = await ctx.prisma.verificationToken.findFirst({
          where: {
            identifier: hashEmail,
            token: given_verificationNumber,
          },
          select: {
            expires: true,
            token: true,
          },
        })
        if (checkOTP === null) {
          // Stop the process the OTP does not exist
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'unknown OTP, please try again later.',
            // optional: pass the original error to retain stack trace
            // cause: error,
          })
        }
        if (checkOTP.expires === null || checkOTP.expires < date) {
          // Stop the process the OTP is expired
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'OTP expired, please try again later.',
            // optional: pass the original error to retain stack trace
            // cause: error,
          })
        }

        if (checkOTP.token !== null) {
          // all good we can delete the OTP
          const deleteUsedOTP = await ctx.prisma.verificationToken.deleteMany({
            where: {
              identifier: hashEmail,
              token: given_verificationNumber,
              expires: checkOTP.expires,
            },
          })
          if (deleteUsedOTP === null) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An unexpected error occurred, please try again later.',
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
        // 1- Check ONG is existing in DB
        const check = await ctx.prisma.oNG.findFirst({
          where: {
            registered_charity_number: given_charity_number_set,
          },
          select: {
            registered_name: true,
            activated: true,
          },
        })
        if (check === null) {
          // Stop the process the charity does not exist
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'charity does not exist, please try again later.',
            // optional: pass the original error to retain stack trace
            // cause: error,
          })
        } else if (check !== null) {
          // Good we can continue
          // 2 - Check if charity is activate
          if (check.activated === false) {
            // Good we can continue
            // 3 - Check if User exist
            const userCheck = await ctx.prisma.user.findFirst({
              where: {
                email: input.email,
              },
              select: {
                id: true,
                firstname: true,
                lastname: true,
                password: true,
              },
            })
            if (userCheck !== null) {
              // User Exist
              // 4- We can update the charity in order to activate it and pass the user

              // 4.1- check if password exist and if it exist check if it match
              if (userCheck.password !== null) {
                const isValid = await compare(password, userCheck.password)
                if (isValid) {
                } else {
                  throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Wrong password, please try again later.',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              }
              // 4.2- we can process the relation and updates
              // 4.2.2- Create the relation in User
              const response = await ctx.prisma.user.update({
                where: {
                  id: userCheck.id,
                },
                data: {
                  firstname:
                    userCheck.firstname === null
                      ? input.firstName
                      : userCheck.firstname,
                  lastname:
                    userCheck.password === null
                      ? input.lastName
                      : userCheck.password,
                  marketingAccept: input.marketingAccept,
                  password:
                    userCheck.password === null
                      ? hashedPassword
                      : userCheck.password,
                  ONG: {
                    connect: {
                      registered_charity_number: given_charity_number_set,
                    },
                  },
                  B2E: {
                    updateMany: {
                      where: {
                        inUse: true,
                      },
                      data: {
                        inUse: false,
                      },
                    },
                    create: {
                      role: 2,
                      status: 2,
                      ong: {
                        connect: {
                          registered_charity_number: given_charity_number_set,
                        },
                      },
                      PermissionSets: {
                        create: {
                          name: 'Account Owner',
                          accountOwner: true,
                          editable: false,
                          predefined: false,
                          super_admin: true,
                          crm_contacts_delete: 1,
                          crm_contacts_edit: 1,
                          crm_contacts_view: 1,
                          crm_companies_delete: 1,
                          crm_companies_edit: 1,
                          crm_companies_view: 1,
                          crm_deals_delete: 1,
                          crm_deals_edit: 1,
                          crm_deals_view: 1,
                          crm_tickets_delte: 1,
                          crm_tickets_edit: 1,
                          crm_tickets_view: 1,
                          crm_tasks_edit: 1,
                          crm_tasks_view: 1,
                          crm_notes_view: 1,
                          crm_custom_objects_delete: 1,
                          crm_custom_objects_edit: 1,
                          crm_custom_objects_view: 1,
                          crm_workflows_delete: true,
                          crm_workflows_edit: true,
                          crm_workflows_view: true,
                          crm_communicate: 1,
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
                          marketing_social: 1,
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
                          sales_forecast_edit: 1,
                          sales_forecast_view: 1,
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
                          account_modify_billing_and_change_name_on_contract:
                            true,
                          account_add_and_edit_developer_apps_and_test_accounts:
                            true,
                          account_user_table_access: true,
                          account_availability_management: true,
                          ong: {
                            connect: {
                              registered_charity_number:
                                given_charity_number_set,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              })
              if (response) {
                // 4.2.3- Create the relation in ONG
                const response_2 = await ctx.prisma.oNG.update({
                  where: {
                    registered_charity_number: given_charity_number_set,
                  },
                  data: {
                    activated: input.activated,
                    charity_number_set: given_charity_number_set,
                    PermissionSets: {
                      createMany: {
                        data: [
                          {
                            name: 'Super Admin',
                            accountOwner: false,
                            editable: false,
                            predefined: true,
                            super_admin: true,
                            crm_contacts_delete: 1,
                            crm_contacts_edit: 1,
                            crm_contacts_view: 1,
                            crm_companies_delete: 1,
                            crm_companies_edit: 1,
                            crm_companies_view: 1,
                            crm_deals_delete: 1,
                            crm_deals_edit: 1,
                            crm_deals_view: 1,
                            crm_tickets_delte: 1,
                            crm_tickets_edit: 1,
                            crm_tickets_view: 1,
                            crm_tasks_edit: 1,
                            crm_tasks_view: 1,
                            crm_notes_view: 1,
                            crm_custom_objects_delete: 1,
                            crm_custom_objects_edit: 1,
                            crm_custom_objects_view: 1,
                            crm_workflows_delete: true,
                            crm_workflows_edit: true,
                            crm_workflows_view: true,
                            crm_communicate: 1,
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
                            marketing_social: 1,
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
                            sales_sales_professional: false,
                            sales_forecast_edit: 4,
                            sales_forecast_view: 3,
                            sales_playbooks_edit: false,
                            sales_playbooks_publish: false,
                            sales_playbooks_view: false,
                            sales_sequences: false,
                            sales_bulk_enroll_sequences: false,
                            sales_manage_payment_links: true,
                            sales_manage_payments_and_subscriptions: true,
                            service_service_access: true,
                            service_templates: true,
                            service_create_scheduling_pages_for_others: true,
                            reports_data_quality_tools_access: true,
                            reports_reports_access: true,
                            reports_dashboard_reports_and_analytics_create:
                              true,
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
                            account_modify_billing_and_change_name_on_contract:
                              true,
                            account_add_and_edit_developer_apps_and_test_accounts:
                              true,
                            account_user_table_access: true,
                            account_availability_management: true,
                          },
                          {
                            name: 'Super Admin with Sales Pro',
                            accountOwner: false,
                            editable: false,
                            predefined: true,
                            super_admin: true,
                            crm_contacts_delete: 1,
                            crm_contacts_edit: 1,
                            crm_contacts_view: 1,
                            crm_companies_delete: 1,
                            crm_companies_edit: 1,
                            crm_companies_view: 1,
                            crm_deals_delete: 1,
                            crm_deals_edit: 1,
                            crm_deals_view: 1,
                            crm_tickets_delte: 1,
                            crm_tickets_edit: 1,
                            crm_tickets_view: 1,
                            crm_tasks_edit: 1,
                            crm_tasks_view: 1,
                            crm_notes_view: 1,
                            crm_custom_objects_delete: 1,
                            crm_custom_objects_edit: 1,
                            crm_custom_objects_view: 1,
                            crm_workflows_delete: true,
                            crm_workflows_edit: true,
                            crm_workflows_view: true,
                            crm_communicate: 1,
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
                            marketing_social: 1,
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
                            sales_forecast_edit: 1,
                            sales_forecast_view: 1,
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
                            reports_dashboard_reports_and_analytics_create:
                              true,
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
                            account_modify_billing_and_change_name_on_contract:
                              true,
                            account_add_and_edit_developer_apps_and_test_accounts:
                              true,
                            account_user_table_access: true,
                            account_availability_management: true,
                          },
                        ],
                      },
                    },
                  },
                })
                return response_2
              } else {
                // Stop the process the user creation had an issue
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message:
                    'An unexpected error occurred while creating the account, please try again later.',
                  // optional: pass the original error to retain stack trace
                  // cause: error,
                })
              }
            } else {
              // We need to create a user first
              // 4.1 - Create a User
              const responseUser = await ctx.prisma.user.create({
                data: {
                  firstname: input.firstName,
                  lastname: input.lastName,
                  language: input.language,
                  email: input.email,
                  password: hashedPassword,
                  marketingAccept: input.marketingAccept,
                  ONG: {
                    connect: {
                      registered_charity_number: given_charity_number_set,
                    },
                  },
                  B2E: {
                    create: {
                      role: 2,
                      status: 2,
                      ong: {
                        connect: {
                          registered_charity_number: given_charity_number_set,
                        },
                      },
                      PermissionSets: {
                        create: {
                          name: 'Account Owner',
                          accountOwner: true,
                          editable: false,
                          predefined: false,
                          super_admin: true,
                          crm_contacts_delete: 1,
                          crm_contacts_edit: 1,
                          crm_contacts_view: 1,
                          crm_companies_delete: 1,
                          crm_companies_edit: 1,
                          crm_companies_view: 1,
                          crm_deals_delete: 1,
                          crm_deals_edit: 1,
                          crm_deals_view: 1,
                          crm_tickets_delte: 1,
                          crm_tickets_edit: 1,
                          crm_tickets_view: 1,
                          crm_tasks_edit: 1,
                          crm_tasks_view: 1,
                          crm_notes_view: 1,
                          crm_custom_objects_delete: 1,
                          crm_custom_objects_edit: 1,
                          crm_custom_objects_view: 1,
                          crm_workflows_delete: true,
                          crm_workflows_edit: true,
                          crm_workflows_view: true,
                          crm_communicate: 1,
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
                          marketing_social: 1,
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
                          sales_forecast_edit: 1,
                          sales_forecast_view: 1,
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
                          account_modify_billing_and_change_name_on_contract:
                            true,
                          account_add_and_edit_developer_apps_and_test_accounts:
                            true,
                          account_user_table_access: true,
                          account_availability_management: true,
                          ong: {
                            connect: {
                              registered_charity_number:
                                given_charity_number_set,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              })
              if (responseUser) {
                const account = await ctx.prisma.account.create({
                  data: {
                    userId: responseUser.id,
                    type: 'credentials',
                    provider: 'admin-login',
                    providerAccountId: responseUser.id,
                  },
                })
                // 5 - We can update the charity in order to activate it and pass the user
                const responseONG = await ctx.prisma.oNG.update({
                  where: {
                    registered_charity_number: given_charity_number_set,
                  },
                  data: {
                    activated: input.activated,
                    charity_number_set: given_charity_number_set,
                    PermissionSets: {
                      createMany: {
                        data: [
                          {
                            name: 'Super Admin',
                            accountOwner: false,
                            predefined: true,
                            editable: false,
                            super_admin: true,
                            crm_contacts_delete: 1,
                            crm_contacts_edit: 1,
                            crm_contacts_view: 1,
                            crm_companies_delete: 1,
                            crm_companies_edit: 1,
                            crm_companies_view: 1,
                            crm_deals_delete: 1,
                            crm_deals_edit: 1,
                            crm_deals_view: 1,
                            crm_tickets_delte: 1,
                            crm_tickets_edit: 1,
                            crm_tickets_view: 1,
                            crm_tasks_edit: 1,
                            crm_tasks_view: 1,
                            crm_notes_view: 1,
                            crm_custom_objects_delete: 1,
                            crm_custom_objects_edit: 1,
                            crm_custom_objects_view: 1,
                            crm_workflows_delete: true,
                            crm_workflows_edit: true,
                            crm_workflows_view: true,
                            crm_communicate: 1,
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
                            marketing_social: 1,
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
                            sales_sales_professional: false,
                            sales_forecast_edit: 4,
                            sales_forecast_view: 3,
                            sales_playbooks_edit: false,
                            sales_playbooks_publish: false,
                            sales_playbooks_view: false,
                            sales_sequences: false,
                            sales_bulk_enroll_sequences: false,
                            sales_manage_payment_links: true,
                            sales_manage_payments_and_subscriptions: true,
                            service_service_access: true,
                            service_templates: true,
                            service_create_scheduling_pages_for_others: true,
                            reports_data_quality_tools_access: true,
                            reports_reports_access: true,
                            reports_dashboard_reports_and_analytics_create:
                              true,
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
                            account_modify_billing_and_change_name_on_contract:
                              true,
                            account_add_and_edit_developer_apps_and_test_accounts:
                              true,
                            account_user_table_access: true,
                            account_availability_management: true,
                          },
                          {
                            name: 'Super Admin with Sales Pro',
                            accountOwner: false,
                            editable: false,
                            predefined: true,
                            super_admin: true,
                            crm_contacts_delete: 1,
                            crm_contacts_edit: 1,
                            crm_contacts_view: 1,
                            crm_companies_delete: 1,
                            crm_companies_edit: 1,
                            crm_companies_view: 1,
                            crm_deals_delete: 1,
                            crm_deals_edit: 1,
                            crm_deals_view: 1,
                            crm_tickets_delte: 1,
                            crm_tickets_edit: 1,
                            crm_tickets_view: 1,
                            crm_tasks_edit: 1,
                            crm_tasks_view: 1,
                            crm_notes_view: 1,
                            crm_custom_objects_delete: 1,
                            crm_custom_objects_edit: 1,
                            crm_custom_objects_view: 1,
                            crm_workflows_delete: true,
                            crm_workflows_edit: true,
                            crm_workflows_view: true,
                            crm_communicate: 1,
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
                            marketing_social: 1,
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
                            sales_forecast_edit: 1,
                            sales_forecast_view: 1,
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
                            reports_dashboard_reports_and_analytics_create:
                              true,
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
                            account_modify_billing_and_change_name_on_contract:
                              true,
                            account_add_and_edit_developer_apps_and_test_accounts:
                              true,
                            account_user_table_access: true,
                            account_availability_management: true,
                          },
                        ],
                      },
                    },
                  },
                })
                return responseONG
              } else {
                // Stop the process the user creation had an issue
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message:
                    'An unexpected error occurred while creating the account, please try again later.',
                  // optional: pass the original error to retain stack trace
                  //cause: error,
                })
              }
            }
          } else {
            // Stop the process the charity is already activated
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'This account is already activated.',
              // optional: pass the original error to retain stack trace
              //cause: error,
            })
          }
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
            // optional: pass the original error to retain stack trace
            //cause: error,
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
