import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins"
import { db, authSchema } from "@workspace/db";
import { afterCreateUser } from "../hooks/user/after-create";
import { beforeCreateSession } from "../hooks/session/before-create";
import { sendOrganizationInvitation, sendResetPasswordEmail, sendVerificationEmail } from "../routers/email.router";

export const auth = betterAuth({
  baseURL: process.env.API_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      await sendResetPasswordEmail({
        to: user.email,
        token,
        url,
      });
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      await sendVerificationEmail({
        to: user.email,
        token,
        url,
      });
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account",
      redirectURI: `${process.env.API_BASE_URL}/api/auth/callback/google`,
    },
  },
  debug: true, // Enable debug mode to see what's happening
  basePath: "/api/auth",
  trustedOrigins: [process.env.WEB_APP_BASE_URL as string],
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.WEB_APP_BASE_URL}/organization/accept-invitation/${data.id}`
        await sendOrganizationInvitation({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
          inviteLink
        })
      },
    })
  ],
  databaseHooks: {
    user: {
      create: {
        after: afterCreateUser
      }
    },
    session: {
      create: {
        before: beforeCreateSession
      }
    }
  }
});