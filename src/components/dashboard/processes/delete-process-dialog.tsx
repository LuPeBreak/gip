"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteProcess } from "@/actions/processes/delete-process";
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

interface DeleteProcessDialogProps {
  process: ProcessItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProcessDialog({
  process,
  open,
  onOpenChange,
}: DeleteProcessDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const response = await deleteProcess({ id: process.id });

      if (response.success) {
        toast.success("Processo excluído", {
          description: `O processo ${process.number} foi excluído com sucesso.`,
        });
        onOpenChange(false);
      } else {
        toast.error("Ação bloqueada", {
          description: response.error?.message,
          icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Excluir Processo
          </DialogTitle>
          <DialogDescription className="pt-2">
            Tem certeza que deseja excluir o processo{" "}
            <span className="font-semibold text-foreground">
              {process.number}
            </span>
            ? Esta ação não pode ser desfeita.
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
            variant="destructive"
            onClick={handleDelete}
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
