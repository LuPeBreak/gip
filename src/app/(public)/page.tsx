import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1>Home</h1>
      <Link href="/login">
        <Button>Login</Button>
      </Link>
    </div>
  );
}
