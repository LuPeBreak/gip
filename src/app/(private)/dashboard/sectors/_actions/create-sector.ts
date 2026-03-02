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
  type CreateSectorData,
  createSectorSchema,
} from "../_schemas/sector-schemas";

export const createSector = withPermissions(
  [{ resource: "sector", action: ["create"] }],
  async (_session, data: CreateSectorData): Promise<ActionResponse<void>> => {
    try {
      // Re-valida para termos certeza de que ninguém burlou o Frontend payload
      const parsedData = createSectorSchema.parse(data);

      // Regra de negócio: O Nome do setor deve ser Único
      const existingSector = await prisma.sector.findUnique({
        where: { name: parsedData.name },
      });

      if (existingSector) {
        return createErrorResponse(
          "Já existe um setor cadastrado com este nome.",
        );
      }

      await prisma.sector.create({
        data: {
          name: parsedData.name,
          description: parsedData.description,
        },
      });

      // Zera a cache do Next para refletir a Action na Table no mesmo instante
      revalidatePath("/dashboard/sectors");

      return createSuccessResponse(undefined, {
        message: "Setor criado com sucesso.",
      });
    } catch (error) {
      console.error("Erro na Server Action createSector:", error);
      return createErrorResponse(
        "Erro interno ao tentar salvar o setor. Faça contato com o suporte.",
      );
    }
  },
);
