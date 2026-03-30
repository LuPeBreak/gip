"use server";

import { revalidatePath } from "next/cache";
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
  async (session, data: UpdateProcessData): Promise<ActionResponse<void>> => {
    try {
      const parsedData = updateProcessSchema.parse(data);

      const existing = await prisma.process.findUnique({
        where: { id: parsedData.id },
      });

      if (!existing) {
        return createErrorResponse("Processo não encontrado.");
      }

      const oldNumber = existing.number;
      const oldDescription = existing.description;

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

      const fields: { name: string; from: string; to: string }[] = [];

      if (oldNumber !== parsedData.number) {
        fields.push({ name: "number", from: oldNumber, to: parsedData.number });
      }

      if (oldDescription !== parsedData.description) {
        fields.push({
          name: "description",
          from: oldDescription,
          to: parsedData.description,
        });
      }

      if (fields.length > 0) {
        await prisma.$transaction([
          prisma.process.update({
            where: { id: parsedData.id },
            data: {
              number: parsedData.number,
              description: parsedData.description,
            },
          }),
          prisma.processEvent.create({
            data: {
              processId: parsedData.id,
              type: "DATA_EDITED",
              actorId: session.user.id,
              metadata: { fields },
            },
          }),
        ]);
      } else {
        await prisma.process.update({
          where: { id: parsedData.id },
          data: {
            number: parsedData.number,
            description: parsedData.description,
          },
        });
      }

      revalidatePath("/dashboard/processes");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao atualizar processo:", error);
      return createErrorResponse("Erro interno ao atualizar processo.");
    }
  },
);
