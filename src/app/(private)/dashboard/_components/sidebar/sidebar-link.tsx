"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

interface SidebarLinkProps {
  url: string;
  title: string;
  icon: ReactNode;
}

export function SidebarLink({ url, title, icon }: SidebarLinkProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === url;

  return (
    <div className="relative">
      {isActive && (
        <motion.div
          layoutId="active-sidebar-link"
          className="absolute inset-0 rounded-md bg-sidebar-accent"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={title}
        onClick={() => isMobile && setOpenMobile(false)}
        className="relative z-10 hover:bg-transparent data-[active=true]:bg-transparent"
      >
        <Link href={url}>
          <span className="[&>svg]:size-4">{icon}</span>
          <span className="text-sm font-normal">{title}</span>
        </Link>
      </SidebarMenuButton>
    </div>
  );
}
