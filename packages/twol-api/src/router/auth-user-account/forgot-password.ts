import { protectedProcedure, publicProcedure, createTRPCRouter } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import { hashPassword, cyrb53 } from '@twol/utils/auth/passwords'
import { decrypt } from '@twol/utils/auth/crypto'
import nodemailer from 'nodemailer'

export const forgotPasswordRouter = createTRPCRouter({
  /**
   * 1 - requestReset :
   * Request Reset
   *
   * This endpoint is to create a password change request if the email exist from the user.
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
  requestReset: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (Array.isArray(input.email)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre email ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      try {
        if (input.email && input.email.length !== 0) {
          //- validate Email
          if (
            !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(input.email)
          ) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Mauvaise requête. Le paramêtre email est invalid.',
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }
          const uEmail = input.email as string

          //2- Hash the email for identifier in db
          const hashEmail = (await cyrb53(uEmail)) as string

          //3- Get Date to delete outdated token
          const date = new Date()
          date.setDate(date.getDate())

          //4- Function to add minutes to time
          function addMinutes(numOfMinutes: number, date = new Date()) {
            date.setMinutes(date.getMinutes() + numOfMinutes)
            return date
          }
          function minusMinutes(numOfMinutes: number, date = new Date()) {
            date.setMinutes(date.getMinutes() - numOfMinutes)
            return date
          }

          //5- Check user exist
          const data = await ctx.prisma.user.findFirst({
            where: {
              email: uEmail,
            },
          })
          if (data === null) {
            // Stop the process the User does not exist
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: "Mauvaise requête. l'utilisateur n'existe pas.",
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          }
          //6 -- check the invite-check went fine
          if (data === null && uEmail.length !== 0) {
            // Stop the process the User does not exist
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: "Mauvaise requête. l'utilisateur n'existe pas.",
              // optional: pass the original error to retain stack trace
              // cause: theError,
            })
          } else if (data !== null) {
            //7-  check if already request in the last 5min.
            async function wrappedCheckAlredyRequest() {
              const checkAlreadyRequest =
                await ctx.prisma.verificationToken.findFirst({
                  where: {
                    identifier: hashEmail,
                  },
                  select: {
                    expires: true,
                    token: true,
                  },
                })
              if (checkAlreadyRequest) {
                // There is a token, is it a forget token ?
                if (checkAlreadyRequest.token.length === 15) {
                  //  token is the right size, is it more than 5 min old ?
                  if (minusMinutes(10, checkAlreadyRequest.expires) > date) {
                    // Stop the process the User does not exist
                    return 'wait5min'
                  } else {
                    //delete old token
                    // all good we can delete the OTP
                    const deleteUsedOTP =
                      await ctx.prisma.verificationToken.deleteMany({
                        where: {
                          identifier: hashEmail,
                        },
                      })
                    if (deleteUsedOTP === null) {
                      return 'An error occured'
                    }
                    return true
                  }
                } else {
                  return true
                }
              } else {
                return true
              }
            }

            let respWrappedCheckAlredyRequest =
              await wrappedCheckAlredyRequest()
            if (respWrappedCheckAlredyRequest === 'An error occured') {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: "Mauvaise requête. l'utilisateur n'existe pas.",
                // optional: pass the original error to retain stack trace
                // cause: theError,
              })
            } else if (respWrappedCheckAlredyRequest === 'wait5min') {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message:
                  "Trop de demande attend 5min ou tente à nouveau avec le dernier otp que nous t'avons envoyé",
                // optional: pass the original error to retain stack trace
                // cause: theError,
              })
            } else if (respWrappedCheckAlredyRequest === true) {
              //8- create request and send email

              // generate token
              const randomNumber = Math.floor(Math.random() * 1000000000000000)
              function LeftPadWithZeros(number: number, length: number) {
                var str = '' + number
                while (str.length < length) {
                  str = '0' + str
                }
                return str
              }
              const randomNumberToSend = LeftPadWithZeros(randomNumber, 15)

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
                  const link = `https://${process.env.VERCEL_URL}/auth/forgot-password/${randomNumberToSend}/${uEmail}`

                  const mailData = {
                    from: process.env.EMAIL_NAME,
                    to: uEmail,
                    subject: `T-WOL.com | Mot de passe oublié ?`,
                    text:
                      'Nous avons reçu une demande de reset ton mot de passe,' +
                      "si tu n'es pas à l'origine de la demande ne clique pas sur le lien et tout sera en sécurité :)" +
                      'Dans le cas contraire, voici ton lien magic :' +
                      link +
                      'For added security, this link will only work for 15 min after it was sent.' +
                      'If the link expires, you can reach out to your teammate, John Emmerechts, and ask them to send a new invite.' +
                      "You can't unsubscribe from important emails about your account like this one." +
                      'T-WOL,' +
                      'Ma Future adresse' +
                      'Belgique, 1000',
                    html:
                      '<div>' +
                      `<h1>Alors comme ça on oublie son mot de passe ?</h1>` +
                      '<p>Nous avons reçu une demande de reset ton mot de passe,</br>' +
                      "si tu n'es pas à l'origine de la demande ne clique pas sur le lien et tout sera en sécurité :)</p>" +
                      '<p>Dans le cas contraire, voici ton lien magic :</p>' +
                      "<p><a href='" +
                      link +
                      "'>Reset mon mot de passe</a></p>" +
                      '<p>For added security, this link will only work for <b>15 min</b> after it was sent.</br>' +
                      'If the link expires, you can do the process again.</p>' +
                      "<p>You can't unsubscribe from important emails about your account like this one.</p>" +
                      '<p>T-WOL,</br>' +
                      'Ma Future adresse</br>' +
                      'Belgique, 1000</p>' +
                      '</div>',
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
                      'An unexpected error occurred while saving the otp, please try again later.',
                    // optional: pass the original error to retain stack trace
                    // cause: error,
                  })
                }
              } else {
                throw new TRPCError({
                  code: 'INTERNAL_SERVER_ERROR',
                  message:
                    'An unexpected error occurred, email has not been send, please try again later.',
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
   *  2 - resetPassword :
   * Reset Password
   *
   * Updates the password of a user using a collection of provided
   * query parameters. These include the following:
   *  - email
   *  - password
   *  - token
   *
   *
   * Will return one of the following :
   * - unknown
   * - given_inviteToken
   * - email invalid
   * - Password format invalid
   * - An error occured
   * - unknownOTP
   * - OTPExpired
   * - unknownUser
   * or the result "ok"
   *
   * @param req - Next.js API Request
   * @param res - Next.js API Response
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string(),
        passwordIv: z.string(),
        passwordContent: z.string(),
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (Array.isArray(input.email)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre email ne peut pas être un tableau.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      //1- Validate data before processing them
      const given_inviteToken: string = input.token.replace(/\D/g, '')

      //2- validate Token
      if (!/^[0-9]{15}$/i.test(given_inviteToken)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le paramètre token est invalide.',
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
            'Mauvaise requête. Le paramètre email est invalide.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      if (
        input.passwordIv === '' ||
        input.passwordIv === undefined ||
        input.passwordContent === undefined ||
        input.passwordContent === ''
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Mauvaise requête. Le format du paramêtre mot de passe est invalide.',
          // optional: pass the original error to retain stack trace
          //cause: theError,
        })
      }

      const hashPasswordReceived = {
        iv: input.passwordIv as string,
        content: input.passwordContent as string,
      }
      const password = decrypt(hashPasswordReceived) as string
      const hashedPassword = await hashPassword(password)

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

        //2 -- check the request exist
        const checkOTP = await ctx.prisma.verificationToken.findFirst({
          where: {
            identifier: hashEmail,
            token: given_inviteToken,
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
            message:
              'Mauvaise requête. Cet OTP est invalide.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }
        if (checkOTP.expires === null || checkOTP.expires < date) {
          // Stop the process the OTP is expired
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Mauvaise requête. Cet OTP est expiré.',
            // optional: pass the original error to retain stack trace
            //cause: theError,
          })
        }

        if (checkOTP.token !== null) {
          // all good we can delete the OTP
          const deleteUsedOTP = await ctx.prisma.verificationToken.deleteMany({
            where: {
              identifier: hashEmail,
              token: given_inviteToken,
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

        // Good we can continue
        // 1 - Check if User exist
        const userCheck = await ctx.prisma.user.findFirst({
          where: {
            email: input.email,
          },
        })
        if (userCheck !== null) {
          // User Exist
          // change password
          const response = await ctx.prisma.user.update({
            where: {
              id: userCheck.id,
            },
            data: {
              password: hashedPassword,
            },
          })
          return 'allGood'
        } else {
          // If user doesn't exist we throw error
          const available = 'unknownUser'
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Mauvaise requête l\'utilisateur n\'existe pas, please try again later.',
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
