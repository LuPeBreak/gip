"use client";

import { ArrowRightLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { forceTransferProcess } from "@/actions/processes/force-transfer-process";
import type { ProcessBase } from "@/actions/processes/process-types";
import {
  getAllUserOptions,
  type UserOption,
} from "@/actions/users/get-all-user-options";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface AdminForceTransferDialogProps {
  process: ProcessBase;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminForceTransferDialog({
  process,
  open,
  onOpenChange,
}: AdminForceTransferDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [reason, setReason] = useState("");
  const [usersLoaded, setUsersLoaded] = useState(false);

  useEffect(() => {
    if (open && !usersLoaded) {
      getAllUserOptions()
        .then((response) => {
          if (response.success && response.data) {
            setUsers(response.data);
            setUsersLoaded(true);
          } else {
            toast.error("Erro ao carregar usuários", {
              description: response.error?.message,
            });
          }
        })
        .catch((err) => {
          toast.error("Erro ao carregar usuários", {
            description: String(err),
          });
        });
    }
  }, [open, usersLoaded]);

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedUser(null);
      setReason("");
    }
    onOpenChange(isOpen);
  };

  const handleTransfer = () => {
    if (!selectedUser) {
      toast.error("Selecione um usuário");
      return;
    }

    startTransition(async () => {
      const response = await forceTransferProcess({
        processId: process.id,
        targetUserId: selectedUser.id,
        reason: reason,
      });

      if (response.success) {
        toast.success("Transferência realizada", {
          description: `O processo ${process.number} foi transferido para ${selectedUser.name}.`,
        });
        handleOpen(false);
        router.refresh();
      } else {
        toast.error("Erro ao transferir processo", {
          description: response.error?.message,
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Transferência Forçada
          </DialogTitle>
          <DialogDescription className="pt-2">
            Você está prestes a transferir o processo{" "}
            <span className="font-semibold text-foreground">
              {process.number}
            </span>{" "}
            para um usuário. A transferência é imediata e não requer aceite.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="user-combobox" className="text-sm font-medium">
              Selecione o destino
            </label>
            <Combobox
              id="user-combobox"
              items={users}
              itemToStringValue={(user) => user.id}
              itemToLabel={(user) => user.name}
              value={selectedUser}
              onValueChange={(user) => setSelectedUser(user)}
              placeholder="Buscar usuário..."
              searchPlaceholder="Digite para buscar..."
              emptyText="Nenhum usuário encontrado"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="reason-input" className="text-sm font-medium">
              Motivo <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="reason-input"
              placeholder="Descreva o motivo da intervenção..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            {reason.length > 0 && reason.length < 3 && (
              <p className="text-xs text-muted-foreground">
                Mínimo de 3 caracteres ({reason.length}/3)
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-row justify-end gap-3 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpen(false)}
            disabled={isPending}
            className="h-9 min-w-30"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleTransfer}
            disabled={isPending || !selectedUser || reason.length < 3}
            className="h-9 min-w-30"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Transferir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
