"use client";

import { Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { InboxTransferItem } from "@/actions/processes/get-inbox-transfers";
import { rejectTransfer } from "@/actions/processes/reject-transfer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface RejectTransferDialogProps {
  transfer: InboxTransferItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RejectTransferDialog({
  transfer,
  open,
  onOpenChange,
}: RejectTransferDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [reason, setReason] = useState("");

  const handleReject = () => {
    startTransition(async () => {
      const response = await rejectTransfer({
        processId: transfer.processId,
        reason: reason.trim(),
      });

      if (response.success) {
        toast.success("Transferência rejeitada", {
          description: `O processo ${transfer.processNumber} foi devolvido ao remetente.`,
        });
        setReason("");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error("Erro ao rejeitar transferência", {
          description: response.error?.message,
        });
      }
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReason("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Rejeitar Transferência
          </DialogTitle>
          <DialogDescription className="pt-2">
            Rejeite a transferência do processo{" "}
            <span className="font-semibold text-foreground">
              {transfer.processNumber}
            </span>
            . O processo será devolvido ao remetente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reject-reason" className="text-sm font-medium">
              Motivo da rejeição <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="reject-reason"
              placeholder="Informe o motivo da rejeição..."
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReason(e.target.value)
              }
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-row justify-end gap-3 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
            className="h-9 min-w-[120px]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            disabled={isPending || !reason.trim()}
            className="h-9 min-w-[120px]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
