// import { DefaultSession, DefaultUser } from 'next-auth'

// /**
//  * Module augmentation for `next-auth` types
//  * Allows us to add custom properties to the `session` object
//  * and keep type safety
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */

// declare module 'next-auth' {
//   interface Session extends DefaultSession {
//     user: {
//       id: string
//       role?: string
//     } & DefaultSession['user']
//   }

//   interface User extends DefaultUser {
//     role?: string
//   }
// }


import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /**
       * The user's email address
       */
      email?: string | null;

      /**
       * The user's unique id number
       */
      id?: string | null;

      /**
       * The users preferred avatar.
       * Usually provided by the user's OAuth provider of choice
       */
      image?: string | null;

      /**
       * The user's full name
       */
      name?: string | null;

      /**
       * The user's custom & public username viewable to others
       */
      username?: string | null;

      /**
       * The user's Firstname
       */
      firstname?: string | null;

      /**
       * The user's Lastname
       */
      lastname?: string | null;
    };
  }

  interface User {
    /**
     * The user's email address
     */
    email?: string | null;

    /**
     * The user's unique id number
     */
    id: string;

    /**
     * The users preferred avatar.
     * Usually provided by the user's OAuth provider of choice
     */
    image?: string | null;

    /**
     * The user's full name
     */
    name?: string | null;

    /**
     * The user's custom & public username viewable to others
     */
    username?: string | null;

    /**
     * The user's Firstname
     */
    firstname?: string | null;

    /**
     * The user's Lastname
     */
    lastname?: string | null;
  }
}
