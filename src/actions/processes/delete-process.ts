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

const deleteProcessSchema = z.object({
  id: z.string(),
});

export const deleteProcess = withPermissions(
  [{ resource: "process", action: ["delete", "delete_own"] }],
  async (
    _session,
    data: z.infer<typeof deleteProcessSchema>,
  ): Promise<ActionResponse<void>> => {
    try {
      const { id } = deleteProcessSchema.parse(data);

      const sessionHeaders = await headers();
      const fullSession = await auth.api.getSession({
        headers: sessionHeaders,
      });

      if (!fullSession) {
        return createErrorResponse("Sessão não encontrada.");
      }

      const isAdmin = fullSession.user.role === "admin";

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

      const isOwner = process.ownerId === fullSession.user.id;

      if (!isAdmin && !isOwner) {
        return createErrorResponse(
          "Você só pode excluir processos que estão sob sua posse.",
        );
      }

      await prisma.process.delete({
        where: { id },
      });

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao excluir processo:", error);
      return createErrorResponse("Erro interno ao excluir processo.");
    }
  },
  { requireAll: false },
);
