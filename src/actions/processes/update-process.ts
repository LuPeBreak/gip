"use server";

import {
  type UpdateProcessData,
  updateProcessSchema,
} from "@/components/dashboard/processes/process-schemas";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

export const updateProcess = withPermissions(
  [{ resource: "process", action: ["update"] }],
  async (_session, data: UpdateProcessData): Promise<ActionResponse<void>> => {
    try {
      const parsedData = updateProcessSchema.parse(data);

      const existing = await prisma.process.findUnique({
        where: { id: parsedData.id },
      });

      if (!existing) {
        return createErrorResponse("Processo não encontrado.");
      }

      const duplicate = await prisma.process.findUnique({
        where: { number: parsedData.number },
      });

      if (duplicate && duplicate.id !== parsedData.id) {
        return createErrorResponse(
          "Já existe um processo com este número.",
          "DUPLICATE_NUMBER",
          "number",
        );
      }

      await prisma.process.update({
        where: { id: parsedData.id },
        data: {
          number: parsedData.number,
          description: parsedData.description,
        },
      });

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao atualizar processo:", error);
      return createErrorResponse("Erro interno ao atualizar processo.");
    }
  },
);
