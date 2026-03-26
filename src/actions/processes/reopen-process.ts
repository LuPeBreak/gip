"use server";

import { z } from "zod";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

const reopenProcessSchema = z.object({
  id: z.string(),
});

export const reopenProcess = withPermissions(
  [{ resource: "process", action: ["reopen"] }],
  async (
    session,
    data: z.infer<typeof reopenProcessSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { id } = reopenProcessSchema.parse(data);

      const process = await prisma.process.findUnique({
        where: { id },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.status !== "FINISHED") {
        return createErrorResponse(
          "Apenas processos finalizados podem ser reabertos.",
        );
      }

      await prisma.$transaction([
        prisma.process.update({
          where: { id },
          data: {
            status: "OPEN",
            ownerId: session.user.id,
          },
        }),
        prisma.processEvent.create({
          data: {
            processId: id,
            type: "REOPENED",
            actorId: session.user.id,
          },
        }),
      ]);

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao reabrir processo:", error);
      return createErrorResponse("Erro interno ao reabrir processo.");
    }
  },
);
