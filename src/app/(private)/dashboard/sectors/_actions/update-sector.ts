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
  type UpdateSectorData,
  updateSectorSchema,
} from "../_schemas/sector-schemas";

export const updateSector = withPermissions(
  [{ resource: "sector", action: ["update"] }],
  async (_session, data: UpdateSectorData): Promise<ActionResponse<void>> => {
    try {
      const parsedData = updateSectorSchema.parse(data);

      const sector = await prisma.sector.findUnique({
        where: { id: parsedData.id },
      });

      if (!sector) {
        return createErrorResponse("Setor não encontrado ou excluído.");
      }

      const existingSectorWithSameName = await prisma.sector.findUnique({
        where: { name: parsedData.name },
      });

      if (
        existingSectorWithSameName &&
        existingSectorWithSameName.id !== parsedData.id
      ) {
        return createErrorResponse(
          "Já existe um setor cadastrado com este nome.",
        );
      }

      await prisma.sector.update({
        where: { id: parsedData.id },
        data: {
          name: parsedData.name,
          description: parsedData.description,
        },
      });

      revalidatePath("/dashboard/sectors");

      return createSuccessResponse(undefined, {
        message: "O Setor foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro na Server Action updateSector:", error);
      return createErrorResponse(
        "Erro interno ao atualizar setor. Entre em contato com o suporte.",
      );
    }
  },
);
