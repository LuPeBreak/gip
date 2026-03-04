"use client";

import { Edit, FolderOpen, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import type { ProcessItem } from "../_actions/get-processes";

interface ProcessesDataTableRowActionsProps {
  processData: ProcessItem;
}

export function ProcessesDataTableRowActions({
  processData,
}: ProcessesDataTableRowActionsProps) {
  const { data: session } = authClient.useSession();
  const userRole = session?.user.role;

  const isAdmin = authClient.admin.checkRolePermission({
    permissions: { process: ["update"] },
    role: (userRole ?? "user") as "admin" | "user",
  });

  const isFinished = processData.status === "FINISHED";

  // In "All Processes", we only want to allow:
  // 1. Reopening archived processes
  // 2. Editing if the user is an admin

  const canReopen = isFinished;
  const canEdit = isAdmin;

  if (!canReopen && !canEdit) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {canReopen && (
          <DropdownMenuItem>
            <FolderOpen className="mr-2 h-4 w-4" />
            Reabrir Processo
          </DropdownMenuItem>
        )}

        {canEdit && (
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Editar Processo
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
