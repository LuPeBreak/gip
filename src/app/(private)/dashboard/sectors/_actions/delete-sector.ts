"use server";

import { revalidatePath } from "next/cache";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import {
  type DeleteSectorData,
  deleteSectorSchema,
} from "../_schemas/sector-schemas";

export const deleteSector = withPermissions(
  [{ resource: "sector", action: ["delete"] }],
  async (_session, data: DeleteSectorData): Promise<ActionResponse<void>> => {
    try {
      const parsedData = deleteSectorSchema.parse(data);

      const sector = await prisma.sector.findUnique({
        where: { id: parsedData.id },
        include: {
          _count: {
            select: { users: true },
          },
        },
      });

      if (!sector) {
        return createErrorResponse("O setor já foi removido ou não existe.");
      }

      // Business Rule: Restrict Deletion if Sector owns Users
      if (sector._count.users > 0) {
        return createErrorResponse(
          "Não é possível excluir este setor porque há usuários vinculados a ele. Transfira os usuários para outro setor primeiro.",
        );
      }

      await prisma.sector.delete({
        where: { id: parsedData.id },
      });

      revalidatePath("/dashboard/sectors");

      return createSuccessResponse(undefined, {
        message: "O Setor foi excluído com sucesso do sistema.",
      });
    } catch (error) {
      console.error("Erro na Server Action deleteSector:", error);
      return createErrorResponse(
        "Erro interno ao excluir setor. Entre em contato com o suporte.",
      );
    }
  },
);
