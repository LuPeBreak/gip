"use client";

import { CheckCircle2, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { MyProcessItem } from "@/actions/processes/get-my-processes";
import { DeleteProcessDialog } from "@/components/dashboard/processes/delete-process-dialog";
import { FinishProcessDialog } from "@/components/dashboard/processes/finish-process-dialog";
import { ProcessDialog } from "@/components/dashboard/processes/process-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import type { RoleKey } from "@/lib/auth/permissions";

interface MyProcessesDataTableRowActionsProps {
  processData: MyProcessItem;
}

export function MyProcessesDataTableRowActions({
  processData,
}: MyProcessesDataTableRowActionsProps) {
  const { data: session } = authClient.useSession();
  const userRole = (session?.user.role as RoleKey) ?? "user";

  const canFinish = authClient.admin.checkRolePermission({
    permissions: { process: ["finish"] },
    role: userRole,
  });

  const canEdit = authClient.admin.checkRolePermission({
    permissions: { process: ["update"] },
    role: userRole,
  });

  const [canDeleteOwn, setCanDeleteOwn] = useState(false);

  useEffect(() => {
    async function checkDeletePermission() {
      const result = await authClient.admin.hasPermission({
        permissions: { process: ["delete_own"] },
      });
      setCanDeleteOwn(result.data?.success ?? false);
    }
    if (session) {
      checkDeletePermission();
    }
  }, [session]);

  const isOpen = processData.status === "OPEN";

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

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

          {canFinish && isOpen && (
            <DropdownMenuItem onClick={() => setShowFinishDialog(true)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Finalizar Processo
            </DropdownMenuItem>
          )}

          {canEdit && (
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          )}

          {canDeleteOwn && isOpen && (
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

      {canDeleteOwn && isOpen && (
        <DeleteProcessDialog
          process={processData}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        />
      )}

      {canFinish && isOpen && (
        <FinishProcessDialog
          process={processData}
          open={showFinishDialog}
          onOpenChange={setShowFinishDialog}
        />
      )}
    </>
  );
}
