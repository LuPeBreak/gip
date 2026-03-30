"use client";

import { Loader2, XCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { cancelTransfer } from "@/actions/processes/cancel-transfer";
import type { MyProcessItem } from "@/actions/processes/get-my-processes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CancelTransferDialogProps {
  process: MyProcessItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelTransferDialog({
  process,
  open,
  onOpenChange,
}: CancelTransferDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      const response = await cancelTransfer({ processId: process.id });

      if (response.success) {
        toast.success("Transferência cancelada", {
          description: `O processo ${process.number} voltou para sua posse.`,
        });
        onOpenChange(false);
      } else {
        toast.error("Erro ao cancelar transferência", {
          description: response.error?.message,
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Cancelar Transferência
          </DialogTitle>
          <DialogDescription className="pt-2">
            Você está prestes a cancelar a transferência do processo{" "}
            <span className="font-semibold text-foreground">
              {process.number}
            </span>
            . O processo voltará para sua posse imediata.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">
              Ao cancelar, o destinatário não será notificado e a transferência
              será removida sem registro no histórico.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-row justify-end gap-3 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-9 min-w-[120px]"
          >
            Manter Transferência
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
            className="h-9 min-w-[120px]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
