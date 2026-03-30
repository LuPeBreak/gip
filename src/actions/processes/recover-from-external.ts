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

const recoverFromExternalSchema = z.object({
  processId: z.string(),
});

export const recoverFromExternal = withPermissions(
  [{ resource: "process", action: ["transfer"] }],
  async (
    session,
    data: z.infer<typeof recoverFromExternalSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { processId } = recoverFromExternalSchema.parse(data);

      const process = await prisma.process.findUnique({
        where: { id: processId },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (!process.location) {
        return createErrorResponse(
          "Este processo não está em localização externa.",
        );
      }

      if (process.pendingTransferToUserId) {
        return createErrorResponse(
          "Este processo possui uma transferência pendente.",
        );
      }

      await prisma.$transaction([
        prisma.process.update({
          where: { id: processId },
          data: {
            location: null,
            ownerId: session.user.id,
          },
        }),
        prisma.processEvent.create({
          data: {
            processId,
            type: "EXTERNAL_RECOVERED",
            actorId: session.user.id,
          },
        }),
      ]);

      revalidatePath("/dashboard/my-processes");
      revalidatePath("/dashboard/processes");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao recuperar de externo:", error);
      return createErrorResponse("Erro interno ao recuperar de externo.");
    }
  },
);
