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

const finishProcessSchema = z.object({
  id: z.string(),
});

export const finishProcess = withPermissions(
  [{ resource: "process", action: ["finish"] }],
  async (
    _session,
    data: z.infer<typeof finishProcessSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { id } = finishProcessSchema.parse(data);

      const sessionHeaders = await headers();
      const fullSession = await auth.api.getSession({
        headers: sessionHeaders,
      });

      if (!fullSession) {
        return createErrorResponse("Sessão não encontrada.");
      }

      const process = await prisma.process.findUnique({
        where: { id },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.status !== "OPEN") {
        return createErrorResponse(
          "Apenas processos abertos podem ser finalizados.",
        );
      }

      const isOwner = process.ownerId === fullSession.user.id;

      if (!isOwner) {
        return createErrorResponse(
          "Você só pode finalizar processos que estão sob sua posse.",
        );
      }

      await prisma.process.update({
        where: { id },
        data: {
          status: "FINISHED",
          ownerId: null,
        },
      });

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao finalizar processo:", error);
      return createErrorResponse("Erro interno ao finalizar processo.");
    }
  },
);
