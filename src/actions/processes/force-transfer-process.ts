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

const forceTransferSchema = z.object({
  processId: z.string().min(1, "ID do processo é obrigatório"),
  targetUserId: z.string().min(1, "Usuário destino é obrigatório"),
  reason: z.string().min(3, "O motivo deve ter pelo menos 3 caracteres"),
});

export const forceTransferProcess = withPermissions(
  [{ resource: "process", action: ["intervene"] }],
  async (
    _session,
    data: z.infer<typeof forceTransferSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const {
        processId,
        targetUserId,
        reason: _reason,
      } = forceTransferSchema.parse(data);

      const sessionHeaders = await headers();
      const fullSession = await auth.api.getSession({
        headers: sessionHeaders,
      });

      if (!fullSession) {
        return createErrorResponse("Sessão não encontrada.");
      }

      const process = await prisma.process.findUnique({
        where: { id: processId },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.status === "FINISHED") {
        return createErrorResponse(
          "Não é possível transferir um processo finalizado. Reabra o processo primeiro.",
        );
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
      });

      if (!targetUser || targetUser.banned) {
        return createErrorResponse("Usuário destino inválido.");
      }

      if (process.ownerId === targetUserId) {
        return createErrorResponse("O processo já está com este usuário.");
      }

      await prisma.process.update({
        where: { id: processId },
        data: {
          ownerId: targetUserId,
          status: "OPEN",
          pendingTransferToUserId: null,
          pendingTransferObservation: null,
          pendingTransferCreatedAt: null,
          location: null,
        },
      });

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro na transferência forçada:", error);
      return createErrorResponse(
        "Erro interno ao realizar transferência forçada.",
      );
    }
  },
);
