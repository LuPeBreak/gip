import { z } from "zod";

const processNumberRegex = /^\d+\/\d{4}$/;
const processNumberMessage =
  "Formato inválido. Use o padrão: número/ano (ex: 1/2026)";

export const createProcessSchema = z.object({
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .regex(processNumberRegex, processNumberMessage),
  description: z.string().min(1, "Descrição é obrigatória"),
});

export type CreateProcessData = z.infer<typeof createProcessSchema>;

export const updateProcessSchema = createProcessSchema.extend({
  id: z.string(),
});

export type UpdateProcessData = z.infer<typeof updateProcessSchema>;
