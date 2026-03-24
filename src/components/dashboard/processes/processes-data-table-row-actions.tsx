"use client";

import { Edit, Eye, MoreHorizontal, RotateCcw, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ProcessItem } from "@/actions/processes/get-processes";
import { DeleteProcessDialog } from "@/components/dashboard/processes/delete-process-dialog";
import { ProcessDialog } from "@/components/dashboard/processes/process-dialog";
import { ReopenProcessDialog } from "@/components/dashboard/processes/reopen-process-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import type { RoleKey } from "@/lib/auth/permissions";

interface ProcessesDataTableRowActionsProps {
  processData: ProcessItem;
}

export function ProcessesDataTableRowActions({
  processData,
}: ProcessesDataTableRowActionsProps) {
  const { data: session } = authClient.useSession();
  const userRole = (session?.user.role as RoleKey) ?? "user";

  const canEdit = authClient.admin.checkRolePermission({
    permissions: { process: ["update"] },
    role: userRole,
  });

  const canDelete = authClient.admin.checkRolePermission({
    permissions: { process: ["delete"] },
    role: userRole,
  });

  const isFinished = processData.status === "FINISHED";
  const isOpen = processData.status === "OPEN";
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);

  const canReopen = authClient.admin.checkRolePermission({
    permissions: { process: ["reopen"] },
    role: userRole,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/processes/${processData.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalhes
            </Link>
          </DropdownMenuItem>

          {canReopen && isFinished && (
            <DropdownMenuItem onClick={() => setShowReopenDialog(true)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reabrir Processo
            </DropdownMenuItem>
          )}

          {canEdit && (
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Processo
            </DropdownMenuItem>
          )}

          {canDelete && isOpen && (
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canEdit && (
        <ProcessDialog
          process={processData}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      {canDelete && isOpen && (
        <DeleteProcessDialog
          process={processData}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        />
      )}

      {canReopen && (
        <ReopenProcessDialog
          process={processData}
          open={showReopenDialog}
          onOpenChange={setShowReopenDialog}
        />
      )}
    </>
  );
}
