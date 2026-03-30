"use server";

import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import type { ProcessBase } from "./process-types";

export type ProcessDetail = ProcessBase & {
  updatedAt: Date;
};

export const getProcessById = withPermissions(
  [{ resource: "process", action: ["list"] }],
  async (_session, id: string): Promise<ActionResponse<ProcessDetail>> => {
    try {
      const process = await prisma.process.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              name: true,
              sector: {
                select: { name: true },
              },
            },
          },
        },
      });

      if (!process) {
        return createErrorResponse("Processo não encontrado", "NOT_FOUND");
      }

      return createSuccessResponse({
        id: process.id,
        number: process.number,
        description: process.description,
        status: process.status as ProcessDetail["status"],
        ownerId: process.ownerId,
        ownerName: process.owner?.name ?? null,
        ownerSectorName: process.owner?.sector?.name ?? null,
        createdAt: process.createdAt,
        updatedAt: process.updatedAt,
        location: process.location,
      });
    } catch (error) {
      console.error("Erro ao buscar processo por ID:", error);
      return createErrorResponse("Erro interno ao buscar processo");
    }
  },
);
