import { z } from "zod";

const processNumberRegex = /^\d+\/\d{4}$/;
const processNumberMessage =
  "Formato inválido. Use o padrão: número/ano (ex: 1/2026)";

export const createProcessSchema = z.object({
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .regex(processNumberRegex, processNumberMessage)
    .max(15, "Número deve ter no máximo 15 caracteres"),
  description: z.string()
  .min(1, "Descrição é obrigatória")
  .max(500, "Descrição deve ter no máximo 500 caracteres"),
});

export type CreateProcessData = z.infer<typeof createProcessSchema>;

export const updateProcessSchema = createProcessSchema.extend({
  id: z.string(),
});

export type UpdateProcessData = z.infer<typeof updateProcessSchema>;
