import { redirectIfAuthenticated } from "@/lib/auth-utils";
import { LoginForm } from "../_components/login-form";

export default async function LoginPage() {
  // If user is already authenticated, they will be redirected to /dashboard
  await redirectIfAuthenticated();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}