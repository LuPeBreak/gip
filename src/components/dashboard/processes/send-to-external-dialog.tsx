"use client";

import { Loader2, MapPin } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { MyProcessItem } from "@/actions/processes/get-my-processes";
import { sendToExternal } from "@/actions/processes/send-to-external";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SendToExternalDialogProps {
  process: MyProcessItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendToExternalDialog({
  process,
  open,
  onOpenChange,
}: SendToExternalDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [location, setLocation] = useState("");

  const handleSend = () => {
    if (!location.trim()) {
      toast.error("Informe a localização");
      return;
    }

    startTransition(async () => {
      const response = await sendToExternal({
        processId: process.id,
        location: location.trim(),
      });

      if (response.success) {
        toast.success("Enviado para externo", {
          description: `O processo ${process.number} foi enviado para ${location}.`,
        });
        setLocation("");
        onOpenChange(false);
      } else {
        toast.error("Erro ao enviar para externo", {
          description: response.error?.message,
        });
      }
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setLocation("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Enviar para Externo
          </DialogTitle>
          <DialogDescription className="pt-2">
            Envie o processo{" "}
            <span className="font-semibold text-foreground">
              {process.number}
            </span>{" "}
            para um setor externo (ex: Jurídico, Arquivo).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="location-input" className="text-sm font-medium">
              Localização
            </label>
            <Input
              id="location-input"
              placeholder="Ex: Jurídico, Arquivo..."
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
            />
            <p className="text-xs text-muted-foreground">
              Informe o nome do setor ou local para onde o processo está indo.
            </p>
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
            onClick={handleSend}
            disabled={isPending || !location.trim()}
            className="h-9 min-w-[120px]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
