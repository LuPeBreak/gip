import { z } from "zod";

export const createProcessSchema = z.object({
  number: z.string().min(1, "Número é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

export type CreateProcessData = z.infer<typeof createProcessSchema>;

export const updateProcessSchema = z.object({
  id: z.string(),
  number: z.string().min(1, "Número é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

export type UpdateProcessData = z.infer<typeof updateProcessSchema>;
