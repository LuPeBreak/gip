"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

interface BanUserDialogProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BanUserDialog({
  userId,
  userName,
  open,
  onOpenChange,
  onSuccess,
}: BanUserDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [reason, setReason] = useState("");

  const handleBan = () => {
    startTransition(async () => {
      const { data, error } = await authClient.admin.banUser({
        userId,
        banReason: reason.trim() || "Desativação de conta",
      });

      if (data) {
        toast.success("Usuário Banido", {
          description: `${userName} foi banido com sucesso.`,
        });
        onOpenChange(false);
        setReason("");
        onSuccess();
      } else {
        toast.error("Erro ao banir usuário", {
          description: error?.message || "Erro desconhecido",
        });
      }
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setReason(""), 300);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Banir Usuário</DialogTitle>
          <DialogDescription>
            Você está prestes a banir <strong>{userName}</strong>. O usuário
            será desconectado de todas as sessões.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-2">
          <FieldLabel htmlFor="ban-reason">Motivo (opcional)</FieldLabel>
          <Input
            id="ban-reason"
            placeholder="Desativação de conta"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
          />
          <p className="text-[0.8rem] text-muted-foreground">
            Se vazio, será usado "Desativação de conta".
          </p>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="min-w-[110px]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleBan}
            disabled={isPending}
            className="min-w-[110px]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Banir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
