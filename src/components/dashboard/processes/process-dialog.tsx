"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PenLine } from "lucide-react";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProcess } from "@/actions/processes/create-process";
import type { ProcessItem } from "@/actions/processes/get-processes";
import { updateProcess } from "@/actions/processes/update-process";
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
import type { ActionResponse } from "@/lib/actions/action-utils";
import { type CreateProcessData, createProcessSchema } from "./process-schemas";

interface ProcessDialogProps {
  process?: ProcessItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessDialog({
  process,
  open,
  onOpenChange,
}: ProcessDialogProps) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!process;

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateProcessData>({
    resolver: zodResolver(createProcessSchema),
    defaultValues: {
      number: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (isEdit && process) {
        reset({
          number: process.number,
          description: process.description,
        });
      } else {
        reset({ number: "", description: "" });
      }
    }
  }, [open, isEdit, process, reset]);

  const onSubmit = (data: CreateProcessData) => {
    startTransition(async () => {
      let response: ActionResponse<void>;

      if (isEdit && process) {
        response = await updateProcess({ ...data, id: process.id });
      } else {
        response = await createProcess(data);
      }

      if (response.success) {
        toast.success(isEdit ? "Processo atualizado" : "Processo criado", {
          description: isEdit
            ? `Os dados foram salvos com sucesso.`
            : `O processo foi criado com sucesso.`,
        });
        onOpenChange(false);
      } else {
        toast.error(isEdit ? "Falha ao salvar" : "Falha ao criar processo", {
          description: response.error?.message,
        });

        if (response.error?.field) {
          setError(response.error.field as keyof CreateProcessData, {
            type: "server",
            message: response.error.message,
          });
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit && <PenLine className="h-5 w-5" />}
            {isEdit ? "Editar Processo" : "Criar Processo"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize os dados do processo."
              : "Cadastre um novo processo licitatório."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-2">
          <FieldGroup className="gap-4">
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.number}>
                  <FieldLabel htmlFor="process-number">Número</FieldLabel>
                  <Input
                    {...field}
                    id="process-number"
                    placeholder="Ex: 1234/2026"
                    disabled={isPending}
                  />
                  {errors.number?.message && (
                    <FieldError>{errors.number.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.description}>
                  <FieldLabel htmlFor="process-description">
                    Descrição
                  </FieldLabel>
                  <Input
                    {...field}
                    id="process-description"
                    placeholder="Ex: Contratação de serviços de limpeza"
                    disabled={isPending}
                  />
                  {errors.description?.message && (
                    <FieldError>{errors.description.message}</FieldError>
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
              disabled={isPending || (isEdit && !isDirty)}
              className="h-9 min-w-[120px]"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
