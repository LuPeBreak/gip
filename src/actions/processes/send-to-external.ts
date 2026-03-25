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

const sendToExternalSchema = z.object({
  processId: z.string(),
  location: z.string().min(1, "Localização é obrigatória"),
});

export const sendToExternal = withPermissions(
  [{ resource: "process", action: ["transfer"] }],
  async (
    _session,
    data: z.infer<typeof sendToExternalSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId, location } = sendToExternalSchema.parse(data);

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

      if (process.status !== "OPEN") {
        return createErrorResponse(
          "Apenas processos abertos podem ser enviados para externo.",
        );
      }

      if (process.ownerId !== fullSession.user.id) {
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

      await prisma.process.update({
        where: { id: processId },
        data: {
          location,
          ownerId: null,
        },
      });

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao enviar para externo:", error);
      return createErrorResponse("Erro interno ao enviar para externo.");
    }
  },
);
