"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

  const form = useForm<FormSchemaType>({
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Entrar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground">
        Desenvolvido pela equipe de TI - PMBM
      </div>
    </div>
  );
}
