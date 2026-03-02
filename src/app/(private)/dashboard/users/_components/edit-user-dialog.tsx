"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PenLine } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { editUser } from "@/app/(private)/dashboard/users/_actions/edit-user";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserColumn } from "./data-table-columns";
import { type EditUserFormValues, editUserSchema } from "./edit-user-schema";

interface EditUserDialogProps {
  user: UserColumn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    values: {
      name: user.name,
      role: (user.role as "admin" | "user") || "user",
    },
  });

  const onSubmit = (data: EditUserFormValues) => {
    startTransition(async () => {
      const response = await editUser({ ...data, userId: user.id });

      if (response.success) {
        toast.success("Usuário atualizado", {
          description: `Os dados de ${data.name} foram salvos com sucesso.`,
        });
        onOpenChange(false);
      } else {
        toast.error("Falha ao salvar usuário", {
          description: response.error?.message,
        });

        if (response.error?.field) {
          setError(response.error.field as keyof EditUserFormValues, {
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
            <PenLine className="h-5 w-5" />
            Editar Usuário
          </DialogTitle>
          <DialogDescription>
            Atualize as informações de cadastro do usuário.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-2">
          <FieldGroup className="gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="edit-name">Nome Completo</FieldLabel>
                  <Input
                    {...field}
                    id="edit-name"
                    placeholder="Ex: João da Silva"
                    disabled={isPending}
                  />
                  {errors.name?.message && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="edit-email">E-mail</FieldLabel>
              <Input
                id="edit-email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted text-muted-foreground"
                readOnly
              />
              <p className="text-[0.8rem] text-muted-foreground mt-1">
                O e-mail não pode ser alterado.
              </p>
            </Field>

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.role}>
                  <FieldLabel htmlFor="edit-role">Cargo</FieldLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="edit-role" className="w-full">
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Padrão</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role?.message && (
                    <FieldError>{errors.role.message}</FieldError>
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
