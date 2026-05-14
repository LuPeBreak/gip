"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, NotepadText } from "lucide-react";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { editObservation } from "@/actions/processes/edit-observation";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const editObservationSchema = z.object({
  observation: z
    .string()
    .max(500, "Observação deve ter no máximo 500 caracteres")
    .optional(),
});

interface EditObservationDialogProps {
  process: ProcessItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditObservationDialog({
  process,
  open,
  onOpenChange,
}: EditObservationDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof editObservationSchema>>({
    resolver: zodResolver(editObservationSchema),
    defaultValues: {
      observation: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        observation: process.observation ?? "",
      });
    }
  }, [open, process, reset]);

  const onSubmit = (data: z.infer<typeof editObservationSchema>) => {
    startTransition(async () => {
      const response = await editObservation({
        id: process.id,
        observation: data.observation,
      });

      if (response.success) {
        toast.success("Observação atualizada", {
          description: `A observação do processo ${process.number} foi atualizada.`,
        });
        onOpenChange(false);
      } else {
        toast.error("Falha ao atualizar", {
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
            <NotepadText className="h-5 w-5" />
            Editar Observação
          </DialogTitle>
          <DialogDescription>
            Atualize a observação do processo{" "}
            <span className="font-semibold text-foreground">
              {process.number}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-2">
          <FieldGroup className="gap-4">
            <Controller
              name="observation"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.observation}>
                  <FieldLabel htmlFor="edit-observation">Observação</FieldLabel>
                  <Input
                    {...field}
                    id="edit-observation"
                    placeholder="Ex: Informações adicionais sobre o processo"
                    disabled={isPending}
                    value={field.value ?? ""}
                  />
                  {errors.observation?.message && (
                    <FieldError>{errors.observation.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

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
              type="submit"
              disabled={isPending || !isDirty}
              className="h-9 min-w-[120px]"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
