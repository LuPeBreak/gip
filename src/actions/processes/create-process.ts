"use server";

import {
  type CreateProcessData,
  createProcessSchema,
} from "@/components/dashboard/processes/process-schemas";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

export const createProcess = withPermissions(
  [{ resource: "process", action: ["create"] }],
  async (session, data: CreateProcessData): Promise<ActionResponse<void>> => {
    try {
      const parsedData = createProcessSchema.parse(data);

      const existing = await prisma.process.findUnique({
        where: { number: parsedData.number },
      });

      if (existing) {
        return createErrorResponse(
          "Já existe um processo com este número.",
          "DUPLICATE_NUMBER",
          "number",
        );
      }

      await prisma.process.create({
        data: {
          number: parsedData.number,
          description: parsedData.description,
          ownerId: session.user.id,
          status: "OPEN",
        },
      });

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao criar processo:", error);
      return createErrorResponse("Erro interno ao criar processo.");
    }
  },
);
