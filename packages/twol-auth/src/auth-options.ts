import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

import NextAuth, { type NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { decode, encode } from 'next-auth/jwt'

import { prisma } from '@twol/database'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import { verifyPassword, cyrb53 } from '@twol/utils/auth/passwords'
import { decrypt } from '@twol/utils/auth/crypto'

import { randomBytes, randomUUID } from 'crypto'
import Cookies from 'cookies'

// export const authOptions: NextAuthOptions = {
//   // Configure one or more authentication providers
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//     }),
//     // ...add more providers here
//   ],
//   callbacks: {
//     session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id
//         session.user.role = user.role
//       }
//       return session
//     },
//   },
// }







// TESTER 3

// if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET)
//   throw new Error('Failed to initialize Google authentication')

// if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET)
//   throw new Error('Failed to initialize GitHub authentication')

// const generateSessionToken = () => {
//   return randomUUID?.() ?? randomBytes(32).toString('hex')
// }

// const fromDate = (time: number, date = Date.now()) => {
//   new Date(date + time * 1000)
// }

// export const authOptions: NextAuthOptions = {
//   // Configure one or more authentication providers
//   adapter: PrismaAdapter(prisma),
//   session: {
//     // Choose how you want to save the user session.
//     // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
//     // If you use an `adapter` however, we default it to `"database"` instead.
//     // You can still force a JWT session by explicitly defining `"jwt"`.
//     // When using `"database"`, the session cookie will only contain a `sessionToken` value,
//     // which is used to look up the session in the database.
//     // strategy: "database",

//     // Seconds - How long until an idle session expires and is no longer valid.
//     maxAge: 60 * 10, // 10min

//     // Seconds - Throttle how frequently to write to database to extend a session.
//     // Use it to limit write operations. Set to 0 to always update the database.
//     // Note: This option is ignored if using JSON Web Tokens
//     updateAge: 60 * 8, // 8min
//   },
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//     }),
//     // ...add more providers here
//   ],
//   callbacks: {
//     session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id
//         session.user.username = user.username
//         session.user.name = user.firstname + ' ' + user.lastname
//         session.user.image = user.image
//         session.user.email = user.email
//       }
//       return session
//     },
//     async signIn({ user, account, profile, email, credentials }) {
//       // console.log("signin --- user", user);
//       // console.log("signin --- account", account);
//       // console.log("signin --- profile", profile);
//       // console.log("signin --- credentials", credentials);
//       // console.log("signin --- req", req.body);
//       // console.log("signin --- req.query", req.query);
//       // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).

//       if (account !== null) {
//         if (
//           req.query.nextauth?.includes('callback') &&
//           req.body.passwordIV.length !== 0 &&
//           req.body.passwordContent.length !== 0 &&
//           req.body.email.length !== 0 &&
//           req.method === 'POST'
//         ) {
//           if (account.provider == 'admin-login') {
//             if (user) {
//               const sessionToken = generateSessionToken()
//               const sessionMaxAge = 60 * 10 //set to 1minute - 30Daysconst sessionMaxAge = 60 * 60 * 24 * 30; //30Days
//               const sessionExpiry = fromDate(sessionMaxAge)

//               await adapter.createSession({
//                 sessionToken: sessionToken,
//                 userId: user.id,
//                 expires: sessionExpiry,
//               })

//               const cookies = new Cookies(req, res)
//               cookies.set('next-auth.session-token', sessionToken, {
//                 expires: sessionExpiry,
//               })
//               return true
//             } else {
//               return false
//             }
//           } else {
//             return false
//           }
//         }
//         if (profile !== null) {
//           if (account.provider === 'google') {
//             return true
//           }
//           return false
//         }
//         return false
//       }
//       return false
//     },
//   },
// }









if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET)
  throw new Error('Failed to initialize Google authentication')

export function requestWrapper(
  req: NextApiRequest,
  res: NextApiResponse
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
  const generateSessionToken = () => {
    return randomUUID?.() ?? randomBytes(32).toString('hex')
  }

  const fromDate = (time: number, date = Date.now()) =>
    new Date(date + time * 1000)

  const adapter = PrismaAdapter(prisma)

  const opts: NextAuthOptions = {
    // Include user.id on session
    adapter: adapter,
    session: {
      // Choose how you want to save the user session.
      // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
      // If you use an `adapter` however, we default it to `"database"` instead.
      // You can still force a JWT session by explicitly defining `"jwt"`.
      // When using `"database"`, the session cookie will only contain a `sessionToken` value,
      // which is used to look up the session in the database.
      // strategy: "database",

      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 60 * 10, // 10min

      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      updateAge: 60 * 8, // 8min
    },
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id
          session.user.username = user.username
          session.user.name = user.firstname + ' ' + user.lastname
          session.user.image = user.image
          session.user.email = user.email
        }
        return session
      },
      async signIn({ user, account, profile, email, credentials }) {
        // console.log("signin --- user", user);
        // console.log("signin --- account", account);
        // console.log("signin --- profile", profile);
        // console.log("signin --- credentials", credentials);
        // console.log("signin --- req", req.body);
        // console.log("signin --- req.query", req.query);
        // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).

        if (account !== null) {
          if (
            req.query.nextauth?.includes('callback') &&
            req.body.passwordIV.length !== 0 &&
            req.body.passwordContent.length !== 0 &&
            req.body.email.length !== 0 &&
            req.method === 'POST'
          ) {
            if (account.provider == 'admin-login') {
              if (user) {
                const sessionToken = generateSessionToken()
                const sessionMaxAge = 60 * 10 //set to 1minute - 30Daysconst sessionMaxAge = 60 * 60 * 24 * 30; //30Days
                const sessionExpiry = fromDate(sessionMaxAge)

                await adapter.createSession({
                  sessionToken: sessionToken,
                  userId: user.id,
                  expires: sessionExpiry,
                })

                const cookies = new Cookies(req, res)
                cookies.set('next-auth.session-token', sessionToken, {
                  expires: sessionExpiry,
                })
                return true
              } else {
                return false
              }
            } else {
              return false
            }
          }
          if (profile !== null) {
            if (account.provider === 'google') {
              return true
            }
            return false
          }
          return false
        }
        return false
      },
    },
    jwt: {
      maxAge: 60 * 10,
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes('callback') &&
          req.body.passwordIV.length !== 0 &&
          req.body.passwordContent.length !== 0 &&
          req.body.email.length !== 0 &&
          req.method === 'POST'
        ) {
          const cookies = new Cookies(req, res)
          const cookie = cookies.get('next-auth.session-token')
          if (cookie) return cookie
          else return ''
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ token, secret, maxAge })
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes('callback') &&
          req.body.passwordIV.length !== 0 &&
          req.body.passwordContent.length !== 0 &&
          req.body.email.length !== 0 &&
          req.method === 'POST'
        ) {
          return null
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret })
      },
    },
    // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET,
    debug: false,
    pages: {
      signIn: `/auth/login`,
      verifyRequest: `/auth/login`,
      error: '/auth/login', // Error code passed in query string as ?error=
      newUser: '/auth/register',
    },
    cookies: {
      sessionToken: {
        name: 'next-auth.session-token',
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
      }),
      GithubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
      }),
      CredentialsProvider({
        type: 'credentials',
        id: 'admin-login',
        name: 'Admin Login',
        credentials: {},
        async authorize(credentials, req) {
          const { email, passwordIV, passwordContent, verificationNumber } =
            credentials as {
              email: string
              passwordIV: string
              passwordContent: string
              verificationNumber: string
            }
          try {
            if (
              !email ||
              !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(email) ||
              !passwordIV ||
              !passwordContent ||
              !verificationNumber
            ) {
              throw new Error('Invalid Data')
            }
            if (passwordIV === '' || passwordContent === '') {
              throw new Error('Invalid Data')
            }
            const passwordReceived = {
              iv: passwordIV as string,
              content: passwordContent as string,
            }

            const password = decrypt(passwordReceived) as string

            // SEARCH IF USER EXIST
            const maybeUser = await prisma.b2E.findFirst({
              where: {
                status: 2,
                inUse: true,
                user: {
                  email: email,
                },
              },
              select: {
                role: true,
                defaultHomepage: true,
                user: {
                  select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    password: true,
                  },
                },
              },
            })

            if (!maybeUser) {
              // USER DOESN'T EXIST
              if (!password || !email) {
                throw new Error('Invalid Credentials')
              }
              throw new Error("User doesn't exist")
            }

            // USER EXIST - LET'S CHECK IF USER GOT A PASSWORD
            if (maybeUser.user?.password === null) {
              // USER GOT NO PASSWORD - NEED TO BE SET
              throw new Error("User doesn't have password")
            }
            // USER GOT A PASSWORD- LET'S CHECK IF PASSWORD IS SIMILAR
            let passwordRef: string =
              maybeUser.user?.password || 'no_password_found'
            const isValid = await verifyPassword(password, passwordRef)
            if (!isValid) {
              throw new Error('Invalid Credentials')
            }

            //CHECK OTP
            //0- First Check the OTP
            //Hash the password
            const hashEmail = await cyrb53(email)
            const date = new Date()
            date.setDate(date.getDate())

            //0.1 -- delete outdated token
            const deleteOutdatedOTP = await prisma.verificationToken.deleteMany(
              {
                where: {
                  expires: {
                    lte: date,
                  },
                },
              }
            )
            if (deleteOutdatedOTP === null) {
              throw new Error('An error occured')
            }

            const checkOTP = await prisma.verificationToken.findFirst({
              where: {
                identifier: hashEmail,
                token: verificationNumber,
              },
              select: {
                expires: true,
                token: true,
              },
            })
            if (checkOTP === null) {
              // Stop the process the OTP does not exist
              throw new Error('unknownOTP')
            }
            if (checkOTP.expires === null || checkOTP.expires < date) {
              // Stop the process the OTP is expired
              throw new Error('OTPExpired')
            }

            if (checkOTP.token !== null) {
              // all good we can delete the OTP
              const deleteUsedOTP = await prisma.verificationToken.deleteMany({
                where: {
                  identifier: hashEmail,
                  token: verificationNumber,
                  expires: checkOTP.expires,
                },
              })
              if (deleteUsedOTP === null) {
                throw new Error('An error occured')
              }
            } else {
              throw new Error('An error occured')
            }

            //USER EXIST - PASSWORD IS SIMILAR - B2E AT LEAST ONE ENTRY - WE CAN CONNECT - return User
            return {
              id: maybeUser.user?.id as string,
              name: maybeUser.user?.firstname + ' ' + maybeUser.user?.lastname,
              email: maybeUser.user?.email,
              defaultHomepage: maybeUser.defaultHomepage,
            }
          } catch (error) {
            console.log(error)
            throw error
          }
        },
      }),
    ],
  }

  return [req, res, opts]
}
