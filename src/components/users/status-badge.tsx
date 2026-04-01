"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  isBanned: boolean | null | undefined;
  className?: string;
}

export function StatusBadge({ isBanned, className }: StatusBadgeProps) {
  const isBannedBoolean = !!isBanned;
  const label = isBannedBoolean ? "Banido" : "Ativo";

  return (
    <Badge
      variant={isBannedBoolean ? "destructive" : "outline"}
      className={cn("w-20 justify-center", className)}
    >
      {label}
    </Badge>
  );
}
