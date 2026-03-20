import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
  role: z.enum(["user", "admin"]),
  sectorId: z.string().cuid("Selecione um setor válido.").optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
