import { SignUpForm } from "@/app/(auth)/_components/signup-form";
import { redirectIfAuthenticated } from "@/lib/auth-utils";

export default async function SignUpPage() {
  // If user is already authenticated, they will be redirected to /dashboard
  await redirectIfAuthenticated();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
} 