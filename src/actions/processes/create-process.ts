"use server";

import { revalidatePath } from "next/cache";
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

      await prisma.$transaction(async (tx) => {
        const process = await tx.process.create({
          data: {
            number: parsedData.number,
            description: parsedData.description,
            ownerId: session.user.id,
            status: "OPEN",
          },
        });

        await tx.processEvent.create({
          data: {
            processId: process.id,
            type: "CREATED",
            actorId: session.user.id,
          },
        });

        return process;
      });

      revalidatePath("/dashboard/my-processes");
      revalidatePath("/dashboard/processes");
      revalidatePath("/dashboard");

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao criar processo:", error);
      return createErrorResponse("Erro interno ao criar processo.");
    }
  },
);
