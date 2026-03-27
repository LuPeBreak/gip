"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
} from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { generatePasswordFromName } from "@/lib/utils/password";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "./reset-password-schema";
import type { UserColumn } from "./users-data-table-columns";

interface ResetPasswordDialogProps {
  user: UserColumn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetPasswordDialog({
  user,
  open,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(false);
  const [successfulPassword, setSuccessfulPassword] = useState<string | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const passwordValue = watch("password");

  const handleAutoGenerateToggle = (checked: boolean) => {
    setAutoGeneratePassword(checked);
    if (checked) {
      const pwd = generatePasswordFromName(user.name);
      if (pwd) {
        setValue("password", pwd, { shouldValidate: true });
        setShowPassword(true);
      }
    } else {
      setValue("password", "");
    }
  };

  const copyPasswordToClipboard = (pwdToCopy: string) => {
    if (!pwdToCopy) return;
    navigator.clipboard.writeText(pwdToCopy);
    toast.success("Senha copiada", {
      description: "Logo, você poderá enviá-la com segurança.",
    });
  };

  const onSubmit = (data: ResetPasswordFormValues) => {
    startTransition(async () => {
      const passwordToSet =
        data.password || Math.random().toString(36).slice(-8);

      const { data: result, error } = await authClient.admin.setUserPassword({
        userId: user.id,
        newPassword: passwordToSet,
      });

      if (result) {
        setSuccessfulPassword(passwordToSet);
        toast.success("Senha atualizada");
        router.refresh();
      } else {
        toast.error("Erro ao redefinir a senha", {
          description: error?.message || "Erro desconhecido",
        });
      }
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Add small delay to reset state after animation closes
    setTimeout(() => {
      reset();
      setAutoGeneratePassword(false);
      setShowPassword(false);
      setSuccessfulPassword(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Redefinir Senha
          </DialogTitle>
          <DialogDescription>
            {successfulPassword
              ? "A senha foi alterada com sucesso."
              : `Defina a nova senha para o usuário ${user.name}.`}
          </DialogDescription>
        </DialogHeader>

        {successfulPassword ? (
          <div className="py-4 space-y-3">
            <div className="py-3 px-4 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg flex gap-3 text-sm items-center mb-6 border border-green-500/20">
              <p>
                O usuário teve todas as sessões revogadas e precisará logar
                novamente.
              </p>
            </div>
            <FieldLabel>Nova Senha</FieldLabel>
            <div className="flex gap-2">
              <Input
                readOnly
                value={successfulPassword}
                className="font-mono bg-muted/50"
              />
              <Button
                onClick={() => copyPasswordToClipboard(successfulPassword)}
                size="icon"
                variant="secondary"
                className="shrink-0 rounded-md"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="py-2">
            <FieldGroup>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.password}>
                    <div className="flex items-center space-x-2 mb-2 mt-1">
                      <Checkbox
                        id="auto-reset-password"
                        checked={autoGeneratePassword}
                        onCheckedChange={handleAutoGenerateToggle}
                        disabled={isPending}
                      />
                      <FieldLabel
                        htmlFor="auto-reset-password"
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
                        placeholder="Nova senha..."
                        disabled={isPending || autoGeneratePassword}
                        data-1p-ignore="true"
                        className="pr-20"
                      />
                      <div className="absolute right-0 top-0 flex h-full items-center space-x-2 pr-3">
                        <button
                          type="button"
                          onClick={() => copyPasswordToClipboard(passwordValue)}
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
                          title={
                            showPassword ? "Ocultar senha" : "Mostrar senha"
                          }
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
            </FieldGroup>

            <div className="py-3 px-4 bg-muted/50 rounded-lg flex gap-3 text-sm text-muted-foreground items-start mt-6">
              <AlertCircle className="h-4 w-4 mt-0.5 text-orange-500 shrink-0" />
              <p>
                O usuário será desconectado de todas as sessões ativas
                imediatamente.
              </p>
            </div>

            <DialogFooter className="mt-6 flex flex-row justify-end gap-3 sm:space-x-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                className="h-9 min-w-[110px]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending || !passwordValue}
                className="h-9 min-w-[110px]"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        )}

        {successfulPassword && (
          <DialogFooter className="mt-2 flex flex-row justify-end gap-3 sm:space-x-0">
            <Button
              type="button"
              onClick={handleClose}
              className="h-9 min-w-[110px]"
            >
              Concluir
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
