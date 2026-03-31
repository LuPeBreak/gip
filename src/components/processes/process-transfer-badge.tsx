"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ProcessTransferBadgeProps {
  userName: string;
  className?: string;
}

function getDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 2) return name;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export function ProcessTransferBadge({
  userName,
  className,
}: ProcessTransferBadgeProps) {
  const displayName = getDisplayName(userName);
  const baseClass =
    "w-24 justify-center border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400";

  const badge = (
    <Badge variant="outline" className={cn(baseClass, className)}>
      <span className="block truncate">{displayName}</span>
    </Badge>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top">
          <p>{userName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
