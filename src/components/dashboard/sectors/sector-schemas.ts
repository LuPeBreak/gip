import { z } from "zod";

export const createSectorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome do setor deve ter no mínimo 2 caracteres.")
    .max(50, "O nome do setor deve ter no máximo 50 caracteres."),
  description: z
    .string()
    .trim()
    .max(200, "A descrição não pode ultrapassar 200 caracteres.")
    .optional(),
});

export type CreateSectorData = z.infer<typeof createSectorSchema>;
export type CreateSectorFormValues = z.input<typeof createSectorSchema>;

// -- Update Sector -- //
export const updateSectorSchema = createSectorSchema.extend({
  id: z.string().cuid("ID de setor inválido."),
});

export type UpdateSectorData = z.infer<typeof updateSectorSchema>;
export type UpdateSectorFormValues = z.input<typeof updateSectorSchema>;

// -- Delete Sector -- //
export const deleteSectorSchema = z.object({
  id: z.string().cuid("ID de setor inválido."),
});

export type DeleteSectorData = z.infer<typeof deleteSectorSchema>;
