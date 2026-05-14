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

const acceptTransferSchema = z.object({
  processId: z.string(),
});

export const acceptTransfer = withPermissions(
  [{ resource: "process", action: ["transfer"] }],
  async (
    session,
    data: z.infer<typeof acceptTransferSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId } = acceptTransferSchema.parse(data);

      const process = await prisma.process.findUnique({
        where: { id: processId },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.pendingTransferToUserId !== session.user.id) {
        return createErrorResponse(
          "Você não possui transferência pendente para este processo.",
        );
      }

      await prisma.$transaction([
        prisma.process.update({
          where: { id: processId },
          data: {
            ownerId: session.user.id,
            pendingTransferToUserId: null,
            pendingTransferObservation: null,
            pendingTransferCreatedAt: null,
            observation: null,
          },
        }),
        prisma.processEvent.create({
          data: {
            processId,
            type: "TRANSFER_ACCEPTED",
            actorId: session.user.id,
            fromUserId: process.ownerId,
            toUserId: session.user.id,
          },
        }),
      ]);

      revalidatePath("/dashboard/my-processes");
      revalidatePath("/dashboard/inbox");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao aceitar transferência:", error);
      return createErrorResponse("Erro interno ao aceitar transferência.");
    }
  },
);
