"use client";

import { Loader2, Unlock } from "lucide-react";
import { useTransition } from "react";
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
import { authClient } from "@/lib/auth/auth-client";

interface UnbanUserDialogProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UnbanUserDialog({
  userId,
  userName,
  open,
  onOpenChange,
  onSuccess,
}: UnbanUserDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleUnban = () => {
    startTransition(async () => {
      const { data, error } = await authClient.admin.unbanUser({
        userId,
      });

      if (data) {
        toast.success("Usuário Desbanido", {
          description: `${userName} pode acessar o sistema novamente.`,
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error("Erro ao desbanir usuário", {
          description: error?.message || "Erro desconhecido",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Unlock className="h-5 w-5" />
            Desbanir Usuário
          </DialogTitle>
          <DialogDescription>
            Deseja desbanir <strong>{userName}</strong>? O usuário poderá
            acessar o sistema novamente.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="min-w-[110px]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleUnban}
            disabled={isPending}
            className="min-w-[110px]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
