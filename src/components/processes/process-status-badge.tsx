"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProcessStatusBadgeProps {
  status: "OPEN" | "FINISHED" | "EXTERNAL";
  className?: string;
}

export function ProcessStatusBadge({
  status,
  className,
}: ProcessStatusBadgeProps) {
  const baseClass = "w-24 justify-center pointer-events-none";

  if (status === "FINISHED") {
    return (
      <Badge variant="secondary" className={cn(baseClass, className)}>
        Arquivado
      </Badge>
    );
  }

  if (status === "EXTERNAL") {
    return (
      <Badge
        variant="outline"
        className={cn(
          baseClass,
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400",
          className,
        )}
      >
        Externo
      </Badge>
    );
  }

  // Default: OPEN
  return (
    <Badge
      className={cn(
        baseClass,
        "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
        className,
      )}
    >
      Aberto
    </Badge>
  );
}
