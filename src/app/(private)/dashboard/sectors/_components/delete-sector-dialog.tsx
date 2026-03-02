"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteSector } from "@/app/(private)/dashboard/sectors/_actions/delete-sector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SectorColumn } from "./data-table-columns";

interface DeleteSectorDialogProps {
  sector: SectorColumn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSectorDialog({
  sector,
  open,
  onOpenChange,
}: DeleteSectorDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const response = await deleteSector({ id: sector.id });

      if (response.success) {
        toast.success("Setor removido", {
          description: `O setor "${sector.name}" foi excluído com sucesso.`,
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error("Ação Bloqueada", {
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
            Excluir Setor
          </DialogTitle>
          <DialogDescription className="pt-2">
            Tem certeza que deseja excluir o setor{" "}
            <span className="font-semibold text-foreground">{sector.name}</span>
            ? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {sector.usersCount > 0 && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive mt-2">
            <strong>Atenção:</strong> Este setor possui{" "}
            {sector.usersCount === 1
              ? "1 funcionário vinculado"
              : `${sector.usersCount} funcionários vinculados`}
            . O sistema bloqueará a exclusão enquanto o setor não estiver vazio.
          </div>
        )}

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
            disabled={isPending || sector.usersCount > 0}
            className="h-9 min-w-[120px]"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Confirmar Exclusão"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
