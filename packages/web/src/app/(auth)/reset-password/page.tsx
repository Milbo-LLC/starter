import { ResetPasswordForm } from "@/app/(auth)/_components/reset-password-form"
import { redirectIfAuthenticated } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  // If user is already authenticated, they will be redirected to /dashboard
  await redirectIfAuthenticated();

  const { token } = await searchParams;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
} 