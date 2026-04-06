import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/(public)/login/_components/login-form";
import { auth } from "@/lib/auth/auth";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
