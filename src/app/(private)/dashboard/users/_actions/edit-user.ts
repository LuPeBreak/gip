"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import {
  type EditUserFormValues,
  editUserSchema,
} from "../_components/edit-user-schema";

interface EditUserParams extends EditUserFormValues {
  userId: string;
}

export const editUser = withPermissions(
  [{ resource: "user", action: ["update"] }],
  async (_session, params: EditUserParams): Promise<ActionResponse> => {
    try {
      const parsedData = editUserSchema.safeParse({
        name: params.name,
        role: params.role,
        sectorId: params.sectorId,
      });

      if (!parsedData.success) {
        return createErrorResponse(
          "Dados inválidos. Verifique os campos do formulário.",
          "VALIDATION_ERROR",
        );
      }

      const { name, role, sectorId } = parsedData.data;
      const { userId } = params;
      const reqHeaders = await headers();

      await auth.api.adminUpdateUser({
        headers: reqHeaders,
        body: {
          userId,
          data: {
            name,
            role,
          },
        },
      });

      // Se o schema previu explicitamente atualizar o sector (pode ser null/undefined para limpar or string pra setar)
      if (sectorId !== undefined) {
        await prisma.user.update({
          where: { id: userId },
          data: { sectorId },
        });
      }

      revalidatePath("/dashboard/users");

      return createSuccessResponse();
    } catch (error) {
      if (error instanceof Error) {
        return createErrorResponse(error.message);
      }
      return createErrorResponse("Erro inesperado ao editar o usuário.");
    }
  },
);
