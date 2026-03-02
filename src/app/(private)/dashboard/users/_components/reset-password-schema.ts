import { z } from "zod";

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .max(32, "A senha deve ter no máximo 32 caracteres"),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
