"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      className="w-full"
      variant={"destructive"}
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
            },
          },
        });
      }}
    >
      Sair
    </Button>
  );
}
