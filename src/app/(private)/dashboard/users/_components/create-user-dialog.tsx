"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { generatePasswordFromName } from "@/lib/utils/password";
import { createUser } from "../_actions/create-user";
import {
  type CreateUserFormValues,
  createUserSchema,
} from "./create-user-schema";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const nameValue = watch("name");
  const passwordValue = watch("password");

  const generatePassword = () => {
    const pwd = generatePasswordFromName(nameValue);
    if (pwd) {
      setValue("password", pwd, { shouldValidate: true });
    }
  };

  const handleAutoGenerateToggle = (checked: boolean) => {
    setAutoGeneratePassword(checked);
    if (checked) {
      if (!nameValue) {
        toast.info("Digite o nome primeiro para gerar a senha.");
        setAutoGeneratePassword(false);
        return;
      }
      generatePassword();
      setShowPassword(true); // Automatically show generated passwords
    } else {
      setValue("password", "");
    }
  };

  const copyPasswordToClipboard = () => {
    if (!passwordValue) return;
    navigator.clipboard.writeText(passwordValue);
    toast.success("Senha copiada", {
      description: "Senha copiada para a área de transferência.",
    });
  };

  const onSubmit = (data: CreateUserFormValues) => {
    startTransition(async () => {
      const response = await createUser(data);

      if (response.success) {
        toast.success("Usuário criado", {
          description: `O usuário ${data.name} foi criado com sucesso.`,
        });
        reset();
        setAutoGeneratePassword(false);
        setShowPassword(false);
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Falha ao criar usuário", {
          description: response.error?.message,
        });

        // Handle specialized field errors if returned from server
        if (response.error?.field) {
          setError(response.error.field as keyof CreateUserFormValues, {
            type: "server",
            message: response.error.message,
          });
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 px-4">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Usuário</DialogTitle>
          <DialogDescription>
            Adicione um novo usuário ao sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-2">
          <FieldGroup className="gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Ex: João da Silva"
                    disabled={isPending}
                    onChange={(e) => {
                      field.onChange(e);
                      if (autoGeneratePassword) {
                        const newName = e.target.value;
                        if (!newName) {
                          setValue("password", "");
                          setAutoGeneratePassword(false);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      field.onBlur();
                      if (autoGeneratePassword && e.target.value) {
                        generatePassword();
                      }
                    }}
                  />
                  {errors.name?.message && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="joao@exemplo.com"
                    disabled={isPending}
                    data-1p-ignore="true" // prevent password managers injection styling bugs
                  />
                  {errors.email?.message && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="password">Senha Inicial</FieldLabel>
                  <div className="flex items-center space-x-2 -mt-1 mb-1">
                    <Checkbox
                      id="auto-password"
                      checked={autoGeneratePassword}
                      onCheckedChange={handleAutoGenerateToggle}
                      disabled={isPending}
                    />
                    <FieldLabel
                      htmlFor="auto-password"
                      className="font-normal text-muted-foreground text-sm cursor-pointer"
                    >
                      Gerar senha automaticamente
                    </FieldLabel>
                  </div>
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      disabled={isPending || autoGeneratePassword}
                      data-1p-ignore="true"
                      className="pr-20" // space for both icons
                    />
                    <div className="absolute right-0 top-0 flex h-full items-center space-x-2 pr-3">
                      <button
                        type="button"
                        onClick={copyPasswordToClipboard}
                        disabled={!passwordValue}
                        className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                        title="Copiar senha"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copiar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          Toggle Password Visibility
                        </span>
                      </button>
                    </div>
                  </div>
                  {errors.password?.message && (
                    <FieldError>{errors.password.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.role}>
                  <FieldLabel htmlFor="role">Cargo</FieldLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="role" className="w-full">
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
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="h-9 min-w-[120px]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 min-w-[120px]"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
