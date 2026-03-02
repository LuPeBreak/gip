"use client";

import {
  Ban,
  KeyRound,
  Loader2,
  MoreHorizontal,
  PenLine,
  Unlock,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleUserBan } from "@/app/(private)/dashboard/users/_actions/toggle-ban";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserColumn } from "./data-table-columns";
import { EditUserDialog } from "./edit-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";

interface DataTableRowActionsProps {
  user: UserColumn;
}

export function DataTableRowActions({ user }: DataTableRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const isBanned = !!user.banned;

  const handleToggleBan = () => {
    startTransition(async () => {
      const result = await toggleUserBan({
        userId: user.id,
        banned: !isBanned,
        // Optional: you can pass reason here later if we add a Ban Dialog
        banReason: !isBanned ? "Violação dos Termos" : null,
      });

      if (result.success) {
        toast.success(isBanned ? "Usuário Desbanido" : "Usuário Banido", {
          description: `O status de ${user.name} foi atualizado com sucesso.`,
        });
      } else {
        toast.error("Erro ao atualizar status", {
          description: result.error?.message || "Erro desconhecido",
        });
      }
    });
  };

  const handleResetPassword = () => {
    setShowResetDialog(true);
  };

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleEdit} disabled={isPending}>
          <PenLine className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleResetPassword} disabled={isPending}>
          <KeyRound className="mr-2 h-4 w-4" />
          Redefinir Senha
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleToggleBan}
          disabled={isPending}
          className={
            isBanned ? "text-green-600 dark:text-green-400" : "text-destructive"
          }
        >
          {isBanned ? (
            <>
              <Unlock className="mr-2 h-4 w-4" />
              Desbanir
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Banir
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>

      <EditUserDialog
        user={user}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <ResetPasswordDialog
        user={user}
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
      />
    </DropdownMenu>
  );
}
