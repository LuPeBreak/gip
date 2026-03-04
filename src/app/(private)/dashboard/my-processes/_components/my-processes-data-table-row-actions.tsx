"use client";

import { Archive, Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import type { MyProcessItem } from "../_actions/get-my-processes";

interface MyProcessesDataTableRowActionsProps {
  processData: MyProcessItem;
}

export function MyProcessesDataTableRowActions({
  processData,
}: MyProcessesDataTableRowActionsProps) {
  const { data: session } = authClient.useSession();
  const userRole = session?.user.role;

  const isAdmin = authClient.admin.checkRolePermission({
    permissions: { process: ["delete"] }, // Checking delete perm as proxy for admin power here
    role: (userRole ?? "user") as "admin" | "user",
  });

  const isOpen = processData.status === "OPEN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {isOpen && (
          <DropdownMenuItem>
            <Archive className="mr-2 h-4 w-4" />
            Finalizar
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
        )}

        {isAdmin && isOpen && (
          <DropdownMenuItem className="text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
