import type { ReactNode } from "react";

interface DashboardPageWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DashboardPageWrapper({
  title,
  description,
  children,
}: DashboardPageWrapperProps) {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 w-full">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between pb-6 border-b border-border/50">
        <div className="space-y-1.5">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-sm xl:text-base">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="w-full animate-in fade-in duration-500 ease-in-out">
        {children}
      </div>
    </div>
  );
}
