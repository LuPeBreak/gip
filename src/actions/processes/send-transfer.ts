"use server";

import { headers } from "next/headers";
import { z } from "zod";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

const sendTransferSchema = z.object({
  processId: z.string(),
  toUserId: z.string(),
  observation: z.string().optional(),
});

export const sendTransfer = withPermissions(
  [{ resource: "process", action: ["transfer"] }],
  async (
    _session,
    data: z.infer<typeof sendTransferSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId, toUserId, observation } =
        sendTransferSchema.parse(data);

      const sessionHeaders = await headers();
      const fullSession = await auth.api.getSession({
        headers: sessionHeaders,
      });

      if (!fullSession) {
        return createErrorResponse("Sessão não encontrada.");
      }

      if (fullSession.user.id === toUserId) {
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

      if (process.ownerId !== fullSession.user.id) {
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

      await prisma.process.update({
        where: { id: processId },
        data: {
          pendingTransferToUserId: toUserId,
          pendingTransferObservation: observation,
          pendingTransferCreatedAt: new Date(),
        },
      });

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao enviar transferência:", error);
      return createErrorResponse("Erro interno ao enviar transferência.");
    }
  },
);
