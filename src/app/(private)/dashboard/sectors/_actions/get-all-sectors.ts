"use server";

import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

export type SimpleSector = {
  id: string;
  name: string;
};

export const getAllSectors = withPermissions(
  [{ resource: "sector", action: ["list"] }],
  async (): Promise<ActionResponse<SimpleSector[]>> => {
    try {
      const sectors = await prisma.sector.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return createSuccessResponse(sectors);
    } catch (error) {
      console.error("Erro ao carregar setores:", error);
      return createErrorResponse(
        "Não foi possível carregar a lista de setores.",
      );
    }
  },
);
