"use client";

import { ArrowRightLeft, Edit, Shield, Trash } from "lucide-react";
import { useState } from "react";
import type { ProcessItem } from "@/actions/processes/get-processes";
import { AdminForceTransferDialog } from "@/components/dashboard/processes/admin-force-transfer-dialog";
import { DeleteProcessDialog } from "@/components/dashboard/processes/delete-process-dialog";
import { ProcessDialog } from "@/components/dashboard/processes/process-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";
import type { RoleKey } from "@/lib/auth/permissions";

interface ProcessDetailAdminActionsProps {
  process: ProcessItem;
}

export function ProcessDetailAdminActions({
  process,
}: ProcessDetailAdminActionsProps) {
  const [showForceTransfer, setShowForceTransfer] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const isOpen = process.status === "OPEN";
  const isFinished = process.status === "FINISHED";

  return (
    <>
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-base">
              Intervenção Administrativa
            </CardTitle>
          </div>
          <CardDescription>
            Ações exclusivas para administradores sobre este processo.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-2">
          <Button
            variant="outline"
            className="w-full"
            disabled={isFinished}
            onClick={() => setShowForceTransfer(true)}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transferência Forçada
          </Button>
          {canEdit && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Processo
            </Button>
          )}
          {canDelete && isOpen && (
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Excluir Processo
            </Button>
          )}
        </CardContent>
      </Card>

      <AdminForceTransferDialog
        process={process}
        open={showForceTransfer}
        onOpenChange={setShowForceTransfer}
      />

      {canEdit && (
        <ProcessDialog
          process={process}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      {canDelete && isOpen && (
        <DeleteProcessDialog
          process={process}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        />
      )}
    </>
  );
}
