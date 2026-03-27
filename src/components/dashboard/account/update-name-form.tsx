"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

const updateNameSchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome deve ter no mínimo 3 caracteres")
      .max(100, "O nome deve ter no máximo 100 caracteres"),
  })
  .transform((data) => ({
    name: data.name.trim().replace(/\s+/g, " "),
  }))
  .pipe(
    z.object({
      name: z
        .string()
        .regex(
          /^[A-Za-zÀ-ÖØ-öø-ÿ]+\s+[A-Za-zÀ-ÖØ-öø-ÿ]+/,
          "Informe o nome e sobrenome",
        ),
    }),
  );

type UpdateNameFormValues = z.infer<typeof updateNameSchema>;

interface UpdateNameFormProps {
  defaultName: string;
}

export function UpdateNameForm({ defaultName }: UpdateNameFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateNameFormValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: defaultName,
    },
  });

  const onSubmit = async (data: UpdateNameFormValues) => {
    setIsPending(true);
    try {
      const { error } = await authClient.updateUser({
        name: data.name,
      });
      if (error) {
        toast.error(error.message || "Erro ao atualizar nome");
      } else {
        toast.success("Nome atualizado com sucesso!");
        router.refresh();
      }
    } catch {
      toast.error("Erro ao atualizar nome");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Nome</CardTitle>
        <CardDescription>
          Atualize seu nome de exibição no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="flex flex-col gap-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input id="name" {...register("name")} />
              {errors.name?.message && (
                <FieldError>{errors.name.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Salvar Nome
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
