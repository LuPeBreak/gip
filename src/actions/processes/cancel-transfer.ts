"use server";

import { z } from "zod";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

const cancelTransferSchema = z.object({
  processId: z.string(),
});

export const cancelTransfer = withPermissions(
  [{ resource: "process", action: ["transfer"] }],
  async (
    session,
    data: z.infer<typeof cancelTransferSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId } = cancelTransferSchema.parse(data);

      const process = await prisma.process.findUnique({
        where: { id: processId },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.ownerId !== session.user.id) {
        return createErrorResponse(
          "Você só pode cancelar transferências que você enviou.",
        );
      }

      if (!process.pendingTransferToUserId) {
        return createErrorResponse(
          "Este processo não possui transferência pendente.",
        );
      }

      await prisma.$transaction([
        prisma.process.update({
          where: { id: processId },
          data: {
            pendingTransferToUserId: null,
            pendingTransferObservation: null,
            pendingTransferCreatedAt: null,
          },
        }),
        prisma.processEvent.deleteMany({
          where: {
            processId,
            type: "TRANSFER_SENT",
            actorId: session.user.id,
            toUserId: process.pendingTransferToUserId,
          },
        }),
      ]);

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao cancelar transferência:", error);
      return createErrorResponse("Erro interno ao cancelar transferência.");
    }
  },
);
