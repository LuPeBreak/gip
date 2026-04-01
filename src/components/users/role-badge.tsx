"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: string | null;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const displayRole = role || "user";
  const isAdmin = displayRole === "admin";

  return (
    <Badge
      variant={isAdmin ? "default" : "secondary"}
      className={cn("w-20 justify-center truncate", className)}
    >
      {displayRole}
    </Badge>
  );
}
