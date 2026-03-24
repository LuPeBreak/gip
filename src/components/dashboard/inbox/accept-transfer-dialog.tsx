"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { acceptTransfer } from "@/actions/processes/accept-transfer";
import type { InboxTransferItem } from "@/actions/processes/get-inbox-transfers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AcceptTransferDialogProps {
  transfer: InboxTransferItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AcceptTransferDialog({
  transfer,
  open,
  onOpenChange,
}: AcceptTransferDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccept = () => {
    startTransition(async () => {
      const response = await acceptTransfer({ processId: transfer.processId });

      if (response.success) {
        toast.success("Transferência aceita", {
          description: `Você agora é o responsável pelo processo ${transfer.processNumber}.`,
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error("Erro ao aceitar transferência", {
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
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Aceitar Transferência
          </DialogTitle>
          <DialogDescription className="pt-2">
            Você está prestes a aceitar a transferência do processo{" "}
            <span className="font-semibold text-foreground">
              {transfer.processNumber}
            </span>
            . Ao aceitar, você se tornará o responsável por este processo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">
              <span className="font-medium">De:</span> {transfer.fromUserName}
            </p>
            {transfer.observation && (
              <p className="mt-2 text-sm">
                <span className="font-medium">Observação:</span>{" "}
                {transfer.observation}
              </p>
            )}
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
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleAccept}
            disabled={isPending}
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
