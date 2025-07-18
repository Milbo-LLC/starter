
import { redirectIfAuthenticated } from "@/lib/auth-utils";
import { ForgotPasswordForm } from "../_components/forgot-password-form";

export default async function ForgotPasswordPage() {
  // If user is already authenticated, they will be redirected to /dashboard
  await redirectIfAuthenticated();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
} 