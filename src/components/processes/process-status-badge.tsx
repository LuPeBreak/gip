"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ProcessStatusBadgeProps {
  status: "OPEN" | "FINISHED" | "EXTERNAL";
  className?: string;
  tooltip?: string;
}

export function ProcessStatusBadge({
  status,
  className,
  tooltip,
}: ProcessStatusBadgeProps) {
  const baseClass = "w-24 justify-center";

  if (status === "FINISHED") {
    return (
      <Badge variant="secondary" className={cn(baseClass, className)}>
        Arquivado
      </Badge>
    );
  }

  if (status === "EXTERNAL") {
    const badge = (
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

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{badge}</TooltipTrigger>
            <TooltipContent side="top">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return badge;
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
