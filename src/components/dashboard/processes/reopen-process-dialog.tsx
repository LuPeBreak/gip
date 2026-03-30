"use client";

import { Loader2, RotateCcw } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import type { ProcessItem } from "@/actions/processes/get-processes";
import { reopenProcess } from "@/actions/processes/reopen-process";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReopenProcessDialogProps {
  process: ProcessItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReopenProcessDialog({
  process,
  open,
  onOpenChange,
}: ReopenProcessDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleReopen = () => {
    startTransition(async () => {
      const response = await reopenProcess({ id: process.id });

      if (response.success) {
        toast.success("Processo reaberto", {
          description: `O processo ${process.number} foi reaberto e está sob sua posse.`,
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
            <RotateCcw className="h-5 w-5" />
            Reabrir Processo
          </DialogTitle>
          <DialogDescription className="pt-2">
            Tem certeza que deseja reabrir o processo{" "}
            <span className="font-semibold text-foreground">
              {process.number}
            </span>
            ? Você assumirá a posse do processo.
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
            onClick={handleReopen}
            disabled={isPending}
            className="h-9 min-w-[120px]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reabrir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
