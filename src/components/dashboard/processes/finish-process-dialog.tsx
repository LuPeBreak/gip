"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { finishProcess } from "@/actions/processes/finish-process";
import type { ProcessItem } from "@/actions/processes/get-processes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FinishProcessDialogProps {
  process: ProcessItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinishProcessDialog({
  process,
  open,
  onOpenChange,
}: FinishProcessDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleFinish = () => {
    startTransition(async () => {
      const response = await finishProcess({ id: process.id });

      if (response.success) {
        toast.success("Processo finalizado", {
          description: `O processo ${process.number} foi finalizado com sucesso.`,
        });
        onOpenChange(false);
      } else {
        toast.error("Ação bloqueada", {
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
            <CheckCircle2 className="h-5 w-5" />
            Finalizar Processo
          </DialogTitle>
          <DialogDescription className="pt-2">
            Tem certeza que deseja finalizar o processo{" "}
            <span className="font-semibold text-foreground">
              {process.number}
            </span>
            ? O processo será arquivado e você perderá a posse dele.
          </DialogDescription>
        </DialogHeader>

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
            onClick={handleFinish}
            disabled={isPending}
            className="h-9 min-w-[120px]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
