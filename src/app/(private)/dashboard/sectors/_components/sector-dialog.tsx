"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { createSector } from "../_actions/create-sector";
import { updateSector } from "../_actions/update-sector";
import {
  type CreateSectorData,
  createSectorSchema,
} from "../_schemas/sector-schemas";
import type { SectorColumn } from "./sectors-data-table-columns";

interface SectorDialogProps {
  sector?: SectorColumn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SectorDialog({
  sector,
  open,
  onOpenChange,
}: SectorDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEdit = !!sector;

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateSectorData>({
    resolver: zodResolver(createSectorSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Atualiza os valores do formulário quando o modal abre
  useEffect(() => {
    if (open) {
      if (isEdit && sector) {
        reset({
          name: sector.name,
          description: sector.description || "",
        });
      } else {
        reset({ name: "", description: "" });
      }
    }
  }, [open, isEdit, sector, reset]);

  const onSubmit = (data: CreateSectorData) => {
    startTransition(async () => {
      let response: ActionResponse<void>;

      // Decide dinamicamente a Action a ser chamada
      if (isEdit && sector) {
        response = await updateSector({ ...data, id: sector.id });
      } else {
        response = await createSector(data);
      }

      if (response.success) {
        toast.success(isEdit ? "Setor atualizado" : "Setor criado", {
          description: isEdit
            ? `Os dados de "${data.name}" foram salvos com sucesso.`
            : `O setor "${data.name}" foi criado com sucesso.`,
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(isEdit ? "Falha ao salvar setor" : "Falha ao criar setor", {
          description: response.error?.message,
        });

        if (response.error?.field) {
          setError(response.error.field as keyof CreateSectorData, {
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
            {isEdit ? "Editar Setor" : "Criar Setor"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize as informações de cadastro e detalhes desta área."
              : "Adicione uma nova área ou departamento para onde os processos tramitarão."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-2">
          <FieldGroup className="gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="sector-name">Nome do Setor</FieldLabel>
                  <Input
                    {...field}
                    id="sector-name"
                    placeholder="Ex: Recursos Humanos"
                    disabled={isPending}
                  />
                  {errors.name?.message && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.description}>
                  <FieldLabel htmlFor="sector-description">
                    Descrição
                  </FieldLabel>
                  <Input
                    {...field}
                    id="sector-description"
                    placeholder="Ex: Responsável pelas contratações"
                    disabled={isPending}
                    value={field.value || ""}
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
              {isEdit ? "Salvar Alterações" : "Criar Setor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
