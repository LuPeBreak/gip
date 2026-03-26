"use server";

import { z } from "zod";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

const rejectTransferSchema = z.object({
  processId: z.string(),
  reason: z.string().optional(),
});

export const rejectTransfer = withPermissions(
  [{ resource: "process", action: ["transfer"] }],
  async (
    session,
    data: z.infer<typeof rejectTransferSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId, reason } = rejectTransferSchema.parse(data);

      const process = await prisma.process.findUnique({
        where: { id: processId },
        include: {
          owner: true,
        },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.pendingTransferToUserId !== session.user.id) {
        return createErrorResponse(
          "Você só pode recusar transferências enviadas para você.",
        );
      }

      await prisma.$transaction([
        prisma.process.update({
          where: { id: processId },
          data: {
            ownerId: process.ownerId,
            pendingTransferToUserId: null,
            pendingTransferObservation: null,
            pendingTransferCreatedAt: null,
          },
        }),
        prisma.processEvent.create({
          data: {
            processId,
            type: "TRANSFER_REJECTED",
            actorId: session.user.id,
            fromUserId: process.ownerId,
            toUserId: session.user.id,
            observation: reason || null,
          },
        }),
      ]);

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao recusar transferência:", error);
      return createErrorResponse("Erro interno ao recusar transferência.");
    }
  },
);
