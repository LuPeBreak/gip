"use client";

import { Ban, KeyRound, MoreHorizontal, PenLine, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BanUserDialog } from "./ban-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { UnbanUserDialog } from "./unban-user-dialog";
import type { UserColumn } from "./users-data-table-columns";

interface UsersDataTableRowActionsProps {
  user: UserColumn;
}

export function UsersDataTableRowActions({
  user,
}: UsersDataTableRowActionsProps) {
  const router = useRouter();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);

  const isBanned = !!user.banned;

  const handleToggleBan = () => {
    if (isBanned) {
      setShowUnbanDialog(true);
    } else {
      // Ban opens dialog for optional reason
      setShowBanDialog(true);
    }
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
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleEdit}>
          <PenLine className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleResetPassword}>
          <KeyRound className="mr-2 h-4 w-4" />
          Redefinir Senha
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleToggleBan}
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

      <BanUserDialog
        userId={user.id}
        userName={user.name}
        open={showBanDialog}
        onOpenChange={setShowBanDialog}
        onSuccess={() => router.refresh()}
      />

      <UnbanUserDialog
        userId={user.id}
        userName={user.name}
        open={showUnbanDialog}
        onOpenChange={setShowUnbanDialog}
        onSuccess={() => router.refresh()}
      />
    </DropdownMenu>
  );
}
