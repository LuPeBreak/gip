"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function CustomTrigger() {
  const { state } = useSidebar();
  return (
    <SidebarTrigger className="absolute -right-3 top-1/2 z-20 hidden h-6 w-6 -translate-y-1/2 rounded-full border bg-sidebar shadow-md md:flex items-center justify-center">
      {state === "expanded" ? (
        <ChevronLeft className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </SidebarTrigger>
  );
}
