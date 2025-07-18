import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/login");
  }

  try {
    await authClient.verifyEmail({
      query: {
        token,
        callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      }
    });

    // If verification is successful, the user will be redirected to the dashboard
    // If we reach here, something went wrong but didn't throw an error
    redirect("/login");
  } catch {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Verification Failed</CardTitle>
              <CardDescription>
                The verification link is invalid or has expired. Please request a new verification email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <a
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-4"
                >
                  Return to login
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
} 