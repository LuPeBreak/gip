"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { notifyTransferSent } from "@/lib/email/notifications";
import { prisma } from "@/lib/prisma";

const sendTransferSchema = z.object({
  processId: z.string(),
  toUserId: z.string(),
  observation: z.string().optional(),
});

export const sendTransfer = withPermissions(
  [{ resource: "process", action: ["transfer"] }],
  async (
    session,
    data: z.infer<typeof sendTransferSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId, toUserId, observation } =
        sendTransferSchema.parse(data);

      if (session.user.id === toUserId) {
        return createErrorResponse(
          "Você não pode enviar um processo para si mesmo.",
        );
      }

      const process = await prisma.process.findUnique({
        where: { id: processId },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.status !== "OPEN") {
        return createErrorResponse(
          "Apenas processos abertos podem ser tramitados.",
        );
      }

      if (process.ownerId !== session.user.id) {
        return createErrorResponse(
          "Você só pode tramitir processos que estão sob sua posse.",
        );
      }

      if (process.pendingTransferToUserId) {
        return createErrorResponse(
          "Este processo já possui uma transferência pendente.",
        );
      }

      const toUser = await prisma.user.findUnique({
        where: { id: toUserId },
      });

      if (!toUser) {
        return createErrorResponse("Usuário destinatário não encontrado.");
      }

      if (toUser.banned) {
        return createErrorResponse("Não é possível enviar para este usuário.");
      }

      await prisma.$transaction([
        prisma.process.update({
          where: { id: processId },
          data: {
            pendingTransferToUserId: toUserId,
            pendingTransferObservation: observation,
            pendingTransferCreatedAt: new Date(),
          },
        }),
        prisma.processEvent.create({
          data: {
            processId,
            type: "TRANSFER_SENT",
            actorId: session.user.id,
            fromUserId: session.user.id,
            toUserId,
            observation: observation || null,
          },
        }),
      ]);

      try {
        await notifyTransferSent(
          {
            id: process.id,
            number: process.number,
            description: process.description,
          },
          session.user.name,
          toUser.email,
          toUser.name,
          observation,
        );
      } catch (error) {
        console.error("Falha ao enviar email de tramitação:", error);
      }

      revalidatePath("/dashboard/my-processes");
      revalidatePath("/dashboard/inbox");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao enviar transferência:", error);
      return createErrorResponse("Erro interno ao enviar transferência.");
    }
  },
);
