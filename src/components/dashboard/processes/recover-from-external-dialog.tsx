"use client";

import { Loader2, MapPinOff } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import type { MyProcessItem } from "@/actions/processes/get-my-processes";
import { recoverFromExternal } from "@/actions/processes/recover-from-external";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecoverFromExternalDialogProps {
  process: MyProcessItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecoverFromExternalDialog({
  process,
  open,
  onOpenChange,
}: RecoverFromExternalDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleRecover = () => {
    startTransition(async () => {
      const response = await recoverFromExternal({
        processId: process.id,
      });

      if (response.success) {
        toast.success("Recuperado com sucesso", {
          description: `O processo ${process.number} voltou a ser interno.`,
        });
        onOpenChange(false);
      } else {
        toast.error("Erro ao recuperar", {
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
            <MapPinOff className="h-5 w-5" />
            Recuperar de Externo
          </DialogTitle>
          <DialogDescription className="pt-2">
            Você está prestes a recuperar o processo{" "}
            <span className="font-semibold text-foreground">
              {process.number}
            </span>{" "}
            de localização externa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">
              <span className="font-medium">Localização atual:</span>{" "}
              {process.location || "-"}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Ao recuperar, o processo voltará a ser interno e você assumirá a
            posse.
          </p>
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
            onClick={handleRecover}
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
