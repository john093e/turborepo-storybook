import { protectedProcedure, publicProcedure, createTRPCRouter } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import { hashPassword, cyrb53 } from '@twol/utils/auth/passwords'
import { decrypt } from '@twol/utils/auth/crypto'
import nodemailer from 'nodemailer'
import { compare } from 'bcryptjs'

export const inviteUserRouter = createTRPCRouter({
  /**
   * 1 - checkInviteUser :
   * Check Invite User
   *
   * This endpoint is to check if a User has been invited using a collection of provided query parameters.
   * These include the following:
   * - userEmail
   * - inviteToken
   *
   * Will return one of the following :
   * - email invalid
   * - token invalid
   * - Password format invalid
   * - unknownOTP
   * - OTPExpired
   * - unknown
   * - wrongPassword
   * - allGood
   * - tokenNotSaved
   * - email not send
   * - error
   * or the result "ok"
   *
   */
  checkInviteUser: publicProcedure
    .input(
      z.object({
        userEmail: z.string(),
        inviteToken: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (Array.isArray(input.userEmail) || Array.isArray(input.inviteToken)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Les paramètres emails et Token ne peuvent pas être des tableaux.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }
      try {
        //1 - check we receive data
        if (
          input.userEmail &&
          input.userEmail.length !== 0 &&
          input.inviteToken &&
          input.inviteToken.length !== 0
        ) {
          //2 - validate Email
          if (
            !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(
              input.userEmail
            )
          ) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'This email is invalid, please try again later.',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
          const uEmail = input.userEmail as string

          //3- validate Token
          if (!/^[0-9]{15}$/i.test(input.inviteToken)) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'This OTP is invalid, please try again later.',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
          const uToken = input.inviteToken as string

          //4- Hash the email for identifier in db
          const hashEmail = (await cyrb53(uEmail)) as string

          //5- get Date to delete outdated token
          const date = new Date()
          date.setDate(date.getDate())

          //6 -- delete outdated token
          const deleteOutdatedOTP =
            await ctx.prisma.verificationToken.deleteMany({
              where: {
                expires: {
                  lte: date,
                },
              },
            })
          //6.1 -- check delete outdated token went fine
          if (deleteOutdatedOTP === null) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An unexpected error occurred, please try again later.',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }

          //7 -- check an invite exist
          const data = await ctx.prisma.verificationToken.findFirst({
            where: {
              identifier: hashEmail,
              token: uToken,
            },
            select: {
              expires: true,
              token: true,
            },
          })
          if (data === null) {
            // Stop the process the OTP does not exist
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: "This OTP doesn't exist, please try again later.",
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
          if (data.expires === null || data.expires < date) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'This OTP is expired, please try again later.',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
          //8 -- check the invite ccheck went fine
          if (data === null && uEmail.length !== 0 && uToken.length !== 0) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: "This invite doesn't exist, please try again later.",
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          } else if (data !== null) {
            //9 -- if there is a token for this email ccheck if new user of already exist
            const dataUser = await ctx.prisma.user.findUnique({
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

            if (dataUser !== null) {
              let passwordSet: boolean = false,
                firstnameSet: boolean = false,
                lastnameSet: boolean = false,
                marketingAccept: boolean | null
              if (dataUser.password !== null) {
                passwordSet = true
              }
              if (dataUser.firstname !== null) {
                firstnameSet = true
              }
              if (dataUser.lastname !== null) {
                lastnameSet = true
              }
              marketingAccept = dataUser.marketingAccept
              const available = {
                passwordSet,
                firstnameSet,
                lastnameSet,
                marketingAccept,
              }
              return available
            } else {
              const available = 'noUserFound'
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'No user found.',
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
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
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
   *  2 - validateUser :
   * validate User
   *
   * This endpoint is to check if the email exist and validate the possession of
   * it from the user using a collection of provided query parameters. These include
   * the following:
   * - userEmail
   * - userPassIv
   * - userPassContent
   * - inviteToken
   *
   *  Will return one of the following :
   * - email invalid
   * - token invalid
   * - Password format invalid
   * - unknownOTP
   * - OTPExpired
   * - unknown
   * - wrongPassword
   * - allGood
   * - tokenNotSaved
   * - email not send
   * - error
   * or the result "ok"
   *
   */
  validateUser: publicProcedure
    .input(
      z.object({
        userEmail: z.string(),
        userPassIv: z.string(),
        userPassContent: z.string(),
        inviteToken: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (Array.isArray(input.userEmail) || Array.isArray(input.inviteToken)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Les paramètres emails et Token ne peuvent pas être des tableaux.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      try {
        if (
          input.userEmail &&
          input.userEmail.length !== 0 &&
          input.inviteToken &&
          input.inviteToken.length !== 0
        ) {
          //validate Email
          if (
            !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(
              input.userEmail
            )
          ) {
            const error = 'email invalid'
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Mauvaise requête. Le paramêtre email est incorrect',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
          const uEmail = input.userEmail as string

          //3- validate Token
          if (!/^[0-9]{15}$/i.test(input.inviteToken)) {
            const available = 'token invalid'
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Mauvaise requête. Le paramêtre token est incorrect',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
          const uToken = input.inviteToken as string

          if (input.userPassIv === '' || input.userPassContent === '') {
            const error = 'Password format invalid'
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message:
                'Mauvaise requête. Le format du mot de passe est incorrect',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
          const hash = {
            iv: input.userPassIv as string,
            content: input.userPassContent as string,
          }
          const uPass = decrypt(hash) as string

          //4- Hash the email for identifier in db
          const hashEmail = (await cyrb53(uEmail)) as string
          //5- get Date to delete outdated token
          const date = new Date()
          date.setDate(date.getDate())

          //6 -- check an invite exist
          const data = await ctx.prisma.verificationToken.findFirst({
            where: {
              identifier: hashEmail,
              token: uToken,
            },
            select: {
              expires: true,
              token: true,
            },
          })
          if (data === null) {
            // Stop the process the OTP does not exist
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: "Mauvaise requête. Cet OTP n'existe pas.",
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
          if (data.expires === null || data.expires < date) {
            // Stop the process the OTP is expired
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: "Mauvaise requête. L'OTP a expiré.",
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          }
          //8 -- check the invite-check went fine
          if (data === null && uEmail.length !== 0 && uToken.length !== 0) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Mauvaise requête. Cette invitation est inconnu.',
              // optional: pass the original error to retain stack trace
              // cause: error,
            })
          } else if (data !== null) {
            //9 -- if there is a token for this email check if new user or already exist

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
                    message: 'Mauvaise requête. Le mot de passe est incorrect',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
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
                    'An unexpected error occurred, the token was not saved, please try again later.',
                  // optional: pass the original error to retain stack trace
                  // cause: error,
                })
              }
            } else {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message:
                  'An unexpected error occurred, the email was not send, please try again later.',
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
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
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
   * 3 - acceptInvite :
   * Accept Invite
   *
   * Updates a site & all of its data using a collection of provided
   * query parameters. These include the following:
   *  - charityNumber
   *  - firstName
   *  - lastName
   *  - email
   *  - password
   *  - passwordConfirmation
   *  - marketingAccept
   *  - verificationNumber
   *
   *
   * Will return one of the following :
   * - unknown
   * - given_inviteToken
   * - given_verificationNumber
   * - email invalid
   * - firstname invalid
   * - lastname invalid
   * - LanguageError
   * - Password format invalid
   * - invalidPassword
   * - invalidMarketingValue
   * - An error occured
   * - unknownCheckInviteOTP
   * - checkInviteOTPExpired
   * - unknownOTP
   * - OTPExpired
   * - wrongPassword
   * - unknownUser
   * or the result "ok"
   *
   */
  acceptInvite: publicProcedure
    .input(
      z.object({
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        language: z.string(),
        email: z.string(),
        passwordIv: z.string(),
        passwordContent: z.string(),
        passwordConfirmationIv: z.string(),
        passwordConfirmationContent: z.string(),
        marketingAccept: z.boolean().nullable(),
        verificationNumber: z.string(),
        inviteToken: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 0- Validate data before processing them
      const given_inviteToken: string = input.inviteToken.replace(/\D/g, '')
      const given_verificationNumber: string = input.verificationNumber.replace(
        /\D/g,
        ''
      )
      //3- validate Token
      if (!/^[0-9]{15}$/i.test(given_inviteToken)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètres OTP d\'invitation est invalid.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      if (given_verificationNumber.length !== 9) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètres OTP est invalid.',
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
          message:
            'Mauvaise requête. Le paramètres email est invalid.',
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
            message:
              'Mauvaise requête. Le paramètres prénom est incorrect.',
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
              'Mauvaise requête. Le paramètres nom de famille est incorrect.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
      }
      /* TODO - MANAGE LANGUAGE  */
      if (input.language !== 'fr') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètres langue est incorrect.',
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
            'Mauvaise requête. Le format du ou des mots de passes est invalid.',
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
          message: 'Mauvaise requête. Les mits de passe ne corresspondent pas.',
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
            'Mauvaise requête. Le paramètres marketing optin est incorrect',
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

        //2 -- check an invite exist
        const checkInviteOTP = await ctx.prisma.verificationToken.findFirst({
          where: {
            identifier: hashEmail,
            token: given_inviteToken,
          },
          select: {
            expires: true,
            token: true,
          },
        })
        if (checkInviteOTP === null) {
          // Stop the process the OTP does not exist
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Mauvaise requête. L'invitation n'existe pas.",
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (checkInviteOTP.expires === null || checkInviteOTP.expires < date) {
          // Stop the process the OTP is expired
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Mauvaise requête. L'invitation a expié",
            // optional: pass the original error to retain stack trace
            //cause: theError,
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
            message: "Mauvaise requête. L'OTP n'existe pas",
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (checkOTP.expires === null || checkOTP.expires < date) {
          // Stop the process the OTP is expired
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Mauvaise requête. l'OTP a expiré",
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        if (checkOTP.token !== null && checkInviteOTP.token !== null) {
          // all good we can delete the OTP
          const deleteUsedOTP = await ctx.prisma.verificationToken.deleteMany({
            where: {
              identifier: hashEmail,
              token: given_verificationNumber,
              expires: checkOTP.expires,
            },
          })
          const deleteUsedCheckInviteOTP =
            await ctx.prisma.verificationToken.deleteMany({
              where: {
                identifier: hashEmail,
                token: given_inviteToken,
                expires: checkInviteOTP.expires,
              },
            })
          if (deleteUsedOTP === null || deleteUsedCheckInviteOTP === null) {
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

        // Good we can continue
        // 1 - Check if User exist
        const userCheck = await ctx.prisma.user.findFirst({
          where: {
            email: input.email,
          },
          select: {
            id: true,
            firstname: true,
            lastname: true,
            password: true,
            B2E: {
              where: {
                status: 1,
              },
              select: {
                id: true,
              },
            },
          },
        })
        if (userCheck !== null && userCheck.B2E[0] !== undefined) {
          // User Exist
          // 2.1- check if password exist and if it exist check if it match
          if (userCheck.password !== null) {
            const isValid = await compare(password, userCheck.password)
            if (isValid) {
            } else {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Mauvaise requête. Le mot de passe est incorrect.',
                // optional: pass the original error to retain stack trace
                //cause: theError,
              })
            }
          }

          // 2.2- activate the B2E relation for User access to Charity
          if (
            (userCheck.firstname === null || userCheck.lastname === null) &&
            userCheck.password === null
          ) {
            const response = await ctx.prisma.user.update({
              where: {
                id: userCheck.id,
              },
              data: {
                firstname: input.firstName,
                lastname: input.lastName,
                marketingAccept: input.marketingAccept,
                password: hashedPassword,
                B2E: {
                  updateMany: {
                    where: {
                      inUse: true,
                    },
                    data: {
                      inUse: false,
                    },
                  },
                  update: {
                    where: {
                      id: userCheck.B2E[0].id,
                    },
                    data: {
                      status: 2,
                      inUse: true,
                    },
                  },
                },
              },
            })
            const account = await ctx.prisma.account.create({
              data: {
                userId: userCheck.id,
                type: 'credentials',
                provider: 'admin-login',
                providerAccountId: userCheck.id,
              },
            })
            return response
          } else if (
            (userCheck.firstname === null || userCheck.lastname === null) &&
            userCheck.password !== null
          ) {
            const response = await ctx.prisma.user.update({
              where: {
                id: userCheck.id,
              },
              data: {
                firstname: input.firstName,
                lastname: input.lastName,
                marketingAccept: input.marketingAccept,
                B2E: {
                  updateMany: {
                    where: {
                      inUse: true,
                    },
                    data: {
                      inUse: false,
                    },
                  },
                  update: {
                    where: {
                      id: userCheck.B2E[0].id,
                    },
                    data: {
                      status: 2,
                      inUse: true,
                    },
                  },
                },
              },
            })
            return response
          } else if (
            userCheck.firstname !== null &&
            userCheck.lastname !== null &&
            userCheck.password === null
          ) {
            const response = await ctx.prisma.user.update({
              where: {
                id: userCheck.id,
              },
              data: {
                marketingAccept: input.marketingAccept,
                password: hashedPassword,
                B2E: {
                  updateMany: {
                    where: {
                      inUse: true,
                    },
                    data: {
                      inUse: false,
                    },
                  },
                  update: {
                    where: {
                      id: userCheck.B2E[0].id,
                    },
                    data: {
                      status: 2,
                      inUse: true,
                    },
                  },
                },
              },
            })

            const account = await ctx.prisma.account.create({
              data: {
                userId: userCheck.id,
                type: 'credentials',
                provider: 'admin-login',
                providerAccountId: userCheck.id,
              },
            })

            return response
          } else {
            const response = await ctx.prisma.user.update({
              where: {
                id: userCheck.id,
              },
              data: {
                marketingAccept: input.marketingAccept,
                B2E: {
                  updateMany: {
                    where: {
                      inUse: true,
                    },
                    data: {
                      inUse: false,
                    },
                  },
                  update: {
                    where: {
                      id: userCheck.B2E[0].id,
                    },
                    data: {
                      status: 2,
                      inUse: true,
                    },
                  },
                },
              },
            })
            return response
          }
          // ^ END If user exist ^
        } else {
          // If user doesn't exist we throw error
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Mauvaise requête, cet utilisateur est inconnu',
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
