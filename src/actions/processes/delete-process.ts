"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

const deleteProcessSchema = z.object({
  id: z.string(),
});

export const deleteProcess = withPermissions(
  [{ resource: "process", action: ["delete", "delete_own"] }],
  async (
    session,
    data: z.infer<typeof deleteProcessSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { id } = deleteProcessSchema.parse(data);

      const process = await prisma.process.findUnique({
        where: { id },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado.");
      }

      if (process.status !== "OPEN") {
        return createErrorResponse(
          "Não é possível excluir um processo que não está aberto.",
        );
      }

      const isOwner = process.ownerId === session.user.id;

      if (!isOwner) {
        const canDeleteAny = await auth.api.userHasPermission({
          body: {
            userId: session.user.id,
            permissions: { process: ["delete"] },
          },
        });

        if (!canDeleteAny.success) {
          return createErrorResponse(
            "Você só pode excluir processos que estão sob sua posse.",
          );
        }
      }

      const realEventCount = await prisma.processEvent.count({
        where: { processId: id, type: { not: "CREATED" } },
      });

      if (realEventCount > 0) {
        return createErrorResponse(
          "Não é possível excluir um processo que possui histórico de movimentações.",
        );
      }

      await prisma.$transaction([
        prisma.processEvent.deleteMany({
          where: { processId: id, type: "CREATED" },
        }),
        prisma.process.delete({ where: { id } }),
      ]);

      revalidatePath("/dashboard/my-processes");
      revalidatePath("/dashboard/processes");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao excluir processo:", error);
      return createErrorResponse("Erro interno ao excluir processo.");
    }
  },
  { requireAll: false },
);
