import { initTRPC } from "@trpc/server";
import { Resend } from "resend";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;
const router = t.router;

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface AuthEmailProps {
  to: string;
  token: string;
  url: string;
}

interface OrganizationInviteEmailProps {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}

// Direct function for auth system
export async function sendVerificationEmail({ to, token, url }: AuthEmailProps) {
  try {
    const data = await resend.emails.send({
      from: process.env.DEFAULT_FROM_EMAIL || "noah@milbo.co",
      to,
      subject: "Verify your email address",
      html: `
        <h1>Welcome to Starter!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href=${url}>
          Verify Email
        </a>
      `,
    });
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Failed to send verification email. Full error:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendResetPasswordEmail({ to, token, url }: AuthEmailProps) {
  try {
    const data = await resend.emails.send({
      from: process.env.DEFAULT_FROM_EMAIL || "noah@milbo.co",
      to,
      subject: "Reset your password",
      html: `
        <h1>Reset your password</h1>
        <p>Please click the link below to reset your password:</p>
        <a href=${url}>
          Reset Password
        </a>
      `,
    });
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Failed to send reset password email. Full error:", error);
    throw new Error("Failed to send reset password email");
  }
}

export async function sendOrganizationInvitation({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: OrganizationInviteEmailProps) {
  try {
    const data = await resend.emails.send({
      from: process.env.DEFAULT_FROM_EMAIL || "noah@milbo.co",
      to: email,
      subject: `You've been invited to join ${teamName}`,
      html: `
        <h1>You've been invited to join ${teamName}!</h1>
        <p>${invitedByUsername} (${invitedByEmail}) has invited you to join their team on Starter.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${inviteLink}">
          Accept Invitation
        </a>
      `,
    });
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Failed to send organization invitation email. Full error:", error);
    throw new Error("Failed to send organization invitation email");
  }
}

export const emailRouter = router({
  send: publicProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string(),
        html: z.string(),
        from: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { to, subject, html, from } = input;

      try {
        const data = await resend.emails.send({
          from: from || process.env.DEFAULT_FROM_EMAIL || "noah@milbo.co",
          to,
          subject,
          html,
        });

        return {
          success: true,
          data,
        };
      } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error("Failed to send email");
      }
    }),

  sendVerification: publicProcedure
    .input(
      z.object({
        to: z.string().email(),
        token: z.string(),
        url: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      return sendVerificationEmail(input);
    }),

  sendResetPassword: publicProcedure
    .input(
      z.object({
        to: z.string().email(),
        token: z.string(),
        url: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      return sendResetPasswordEmail(input);
    }),
});