"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

const editObservationSchema = z.object({
  id: z.string(),
  observation: z
    .string()
    .max(500, "Observação deve ter no máximo 500 caracteres")
    .optional(),
});

export type EditObservationData = z.infer<typeof editObservationSchema>;

export const editObservation = withPermissions(
  [{ resource: "process", action: ["edit_observation"] }],
  async (session, data: EditObservationData): Promise<ActionResponse<void>> => {
    try {
      const parsedData = editObservationSchema.parse(data);

      const process = await prisma.process.findUnique({
        where: { id: parsedData.id },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.ownerId !== session.user.id) {
        return createErrorResponse(
          "Você só pode editar observação de processos que estão sob sua posse.",
        );
      }

      const oldObservation = process.observation;
      const newObservation = parsedData.observation ?? null;

      if (oldObservation === newObservation) {
        return createErrorResponse(
          "Nenhuma alteração detectada.",
          "NO_CHANGES",
        );
      }

      await prisma.$transaction([
        prisma.process.update({
          where: { id: parsedData.id },
          data: { observation: newObservation },
        }),
        prisma.processEvent.create({
          data: {
            processId: parsedData.id,
            type: "DATA_EDITED",
            actorId: session.user.id,
            metadata: {
              fields: [
                {
                  name: "observation",
                  from: oldObservation ?? "",
                  to: newObservation ?? "",
                },
              ],
            },
          },
        }),
      ]);

      revalidatePath("/dashboard/my-processes");
      revalidatePath("/dashboard/processes");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao editar observação:", error);
      return createErrorResponse("Erro interno ao editar observação.");
    }
  },
);
