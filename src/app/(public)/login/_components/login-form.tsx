"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
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
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {
    startTransition(async () => {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success("Login realizado com sucesso!");
            router.push("/dashboard");
            router.refresh();
          },
          onError: (ctx) => {
            const errorMessage = ctx.error.message || "Erro desconhecido";
            if (errorMessage === "Invalid email or password") {
              toast.error("E-mail ou senha incorretos.");
            } else if (
              errorMessage.includes(
                "You have been banned from this application",
              )
            ) {
              toast.error(
                "Sua conta foi desativada. Entre em contato com o suporte.",
              );
            } else {
              console.error("Auth Error:", errorMessage);
              toast.error(
                "Ocorreu um erro ao realizar o login. Tente novamente.",
              );
            }
          },
        },
      );
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex justify-center">
        <div className="relative h-16 w-32">
          <Image
            src="/assets/logos/logo-bm-colorful.png"
            alt="Logo Prefeitura de Barra Mansa"
            fill
            className="object-contain block dark:hidden"
            priority
          />
          <Image
            src="/assets/logos/logo-bm-white.png"
            alt="Logo Prefeitura de Barra Mansa"
            fill
            className="object-contain hidden dark:block"
            priority
          />
        </div>
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sistema de Processos</CardTitle>
          <CardDescription>Prefeitura de Barra Mansa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="flex flex-col gap-6">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      {...field}
                      disabled={isPending}
                    />
                    {errors.email?.message && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      {...field}
                      disabled={isPending}
                    />
                    {errors.password?.message && (
                      <FieldError>{errors.password.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground">
        Desenvolvido pela equipe de TI - PMBM
      </div>
    </div>
  );
}
