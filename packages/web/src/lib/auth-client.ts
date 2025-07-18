import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3042"

export const authClient = createAuthClient({
  baseURL,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  basePath: "/api/auth",
  callbackURL: `${baseURL}/api/auth/callback`,
  plugins: [
    organizationClient()
  ]
})