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

const acceptTransferSchema = z.object({
  processId: z.string(),
});

export const acceptTransfer = withPermissions(
  [{ resource: "process", action: ["transfer"] }],
  async (
    _session,
    data: z.infer<typeof acceptTransferSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId } = acceptTransferSchema.parse(data);

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

      if (process.pendingTransferToUserId !== fullSession.user.id) {
        return createErrorResponse(
          "Você não possui transferência pendente para este processo.",
        );
      }

      await prisma.process.update({
        where: { id: processId },
        data: {
          ownerId: fullSession.user.id,
          pendingTransferToUserId: null,
          pendingTransferObservation: null,
          pendingTransferCreatedAt: null,
        },
      });

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao aceitar transferência:", error);
      return createErrorResponse("Erro interno ao aceitar transferência.");
    }
  },
);
