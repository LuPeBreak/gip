"use client";

import { Loader2, Send } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { MyProcessItem } from "@/actions/processes/get-my-processes";
import { sendTransfer } from "@/actions/processes/send-transfer";
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

interface SendTransferDialogProps {
  process: MyProcessItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendTransferDialog({
  process,
  open,
  onOpenChange,
}: SendTransferDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [observation, setObservation] = useState("");
  const [usersLoaded, setUsersLoaded] = useState(false);

  useEffect(() => {
    if (open && !usersLoaded) {
      getAllUserOptions()
        .then((response) => {
          if (response.success && response.data) {
            const filteredUsers = response.data.filter(
              (user) => user.id !== process.ownerId,
            );
            setUsers(filteredUsers);
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
  }, [open, usersLoaded, process.ownerId]);

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedUser(null);
      setObservation("");
    }
    onOpenChange(isOpen);
  };

  const handleTransfer = () => {
    if (!selectedUser) {
      toast.error("Selecione um usuário");
      return;
    }

    startTransition(async () => {
      const response = await sendTransfer({
        processId: process.id,
        toUserId: selectedUser.id,
        observation: observation || undefined,
      });

      if (response.success) {
        toast.success("Transferência enviada", {
          description: `O processo ${process.number} foi enviado para ${selectedUser.name}.`,
        });
        handleOpen(false);
      } else {
        toast.error("Erro ao enviar transferência", {
          description: response.error?.message,
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar Transferência
          </DialogTitle>
          <DialogDescription className="pt-2">
            Envie o processo{" "}
            <span className="font-semibold text-foreground">
              {process.number}
            </span>{" "}
            para outro usuário. O processo permanecerá em sua posse até que o
            destinatário aceite.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="user-combobox" className="text-sm font-medium">
              Selecione o usuário
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
            <label htmlFor="observation-input" className="text-sm font-medium">
              Observação (opcional)
            </label>
            <Textarea
              id="observation-input"
              placeholder="Adicione uma observação para o destinatário..."
              value={observation}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setObservation(e.target.value)
              }
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-row justify-end gap-3 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpen(false)}
            disabled={isPending}
            className="h-9 min-w-[120px]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleTransfer}
            disabled={isPending || !selectedUser}
            className="h-9 min-w-[120px]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
