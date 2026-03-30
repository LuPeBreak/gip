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

const finishProcessSchema = z.object({
  id: z.string(),
});

export const finishProcess = withPermissions(
  [{ resource: "process", action: ["finish"] }],
  async (
    session,
    data: z.infer<typeof finishProcessSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { id } = finishProcessSchema.parse(data);

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

      const isOwner = process.ownerId === session.user.id;

      if (!isOwner) {
        return createErrorResponse(
          "Você só pode finalizar processos que estão sob sua posse.",
        );
      }

      if (process.pendingTransferToUserId) {
        return createErrorResponse(
          "Este processo possui uma transferência pendente.",
        );
      }

      await prisma.$transaction([
        prisma.process.update({
          where: { id },
          data: {
            status: "FINISHED",
            ownerId: null,
          },
        }),
        prisma.processEvent.create({
          data: {
            processId: id,
            type: "FINISHED",
            actorId: session.user.id,
          },
        }),
      ]);

      revalidatePath("/dashboard/my-processes");
      revalidatePath("/dashboard/processes");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao finalizar processo:", error);
      return createErrorResponse("Erro interno ao finalizar processo.");
    }
  },
);
