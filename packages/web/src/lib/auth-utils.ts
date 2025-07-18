"use server"

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "./auth-client";

/**
 * Get the current session, throwing redirect if authentication requirements aren't met
 */
export async function requireSession() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    redirect("/login");
  }

  return session.data.user;
}

/**
 * Redirect to dashboard if user is already authenticated
 */
export async function redirectIfAuthenticated() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.data?.user) {
    redirect("/dashboard");
  }
} 