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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}
