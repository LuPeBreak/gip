import { z } from "zod";

export const editUserSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
  role: z.enum(["admin", "user"], {
    message: "Selecione um cargo válido",
  }),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
