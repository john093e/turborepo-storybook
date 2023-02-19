import { createTRPCRouter } from './trpc'
// Auth - User - Account
import { authRouter } from './router/auth-user-account/auth'
import { forgotPasswordRouter } from './router/auth-user-account/forgot-password'
import { inviteUserRouter } from './router/auth-user-account/invite-user'
import { createAccountRouter } from './router/auth-user-account/create-account'

// Admin
// Admin - Settings
// Admin - Settings - Account
// Admin - Settings - Account - Defaults
import { adminSettingsAccountDefaultsAccountDefaultsRouter } from './router/admin/'
// Admin - Settings - Account - Users And Teams
import { adminSettingsAccountUsersAndTeamsUsersRouter } from './router/admin/'
import { adminSettingsAccountUsersAndTeamsTeamsRouter } from './router/admin/'
import { adminSettingsAccountUsersAndTeamsPermissionSetsRouter } from './router/admin/'
// Admin - Settings - User
// Admin - Settings - User - Defaults
import { adminSettingsUserDefaultsUserRouter } from './router/admin/'

import { userRouter } from './router/user'

export const appRouter = createTRPCRouter({
  // tag: tagRouter,
  user: userRouter,
  auth: authRouter,
  forgotPassword: forgotPasswordRouter,
  inviteUser: inviteUserRouter,
  createAccount: createAccountRouter,
  // Admin
  // Admin - Settings - Account - Defaults
  adminSettingsAccountDefaultsAccountDefaults:
    adminSettingsAccountDefaultsAccountDefaultsRouter,
  // Admin - Settings - Account - Users And Teams
  adminSettingsAccountUsersAndTeamsUsers:
    adminSettingsAccountUsersAndTeamsUsersRouter,
  adminSettingsAccountUsersAndTeamsTeams:
    adminSettingsAccountUsersAndTeamsTeamsRouter,
  adminSettingsAccountUsersAndTeamsPermissionSets:
    adminSettingsAccountUsersAndTeamsPermissionSetsRouter,
  // Admin - Settings - User
  adminSettingsUserDefaultsUser: adminSettingsUserDefaultsUserRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
