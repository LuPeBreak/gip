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

const sendToExternalSchema = z.object({
  processId: z.string(),
  location: z.string().min(1, "Localização é obrigatória"),
});

export const sendToExternal = withPermissions(
  [{ resource: "process", action: ["transfer"] }],
  async (
    session,
    data: z.infer<typeof sendToExternalSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId, location } = sendToExternalSchema.parse(data);

      const process = await prisma.process.findUnique({
        where: { id: processId },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.status !== "OPEN") {
        return createErrorResponse(
          "Apenas processos abertos podem ser enviados para externo.",
        );
      }

      if (process.ownerId !== session.user.id) {
        return createErrorResponse(
          "Você só pode enviar processos que estão sob sua posse.",
        );
      }

      if (process.location) {
        return createErrorResponse(
          "Este processo já está em localização externa.",
        );
      }

      if (process.pendingTransferToUserId) {
        return createErrorResponse(
          "Este processo possui uma transferência pendente.",
        );
      }

      await prisma.$transaction([
        prisma.process.update({
          where: { id: processId },
          data: {
            location,
            ownerId: null,
          },
        }),
        prisma.processEvent.create({
          data: {
            processId,
            type: "EXTERNAL_SENT",
            actorId: session.user.id,
            observation: location,
          },
        }),
      ]);

      revalidatePath("/dashboard/my-processes");
      revalidatePath("/dashboard/processes");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao enviar para externo:", error);
      return createErrorResponse("Erro interno ao enviar para externo.");
    }
  },
);
