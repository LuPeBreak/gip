"use server";

import type { z } from "zod";
import { createUserSchema } from "@/components/dashboard/users/create-user-schema";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { auth } from "@/lib/auth/auth";

export const createUser = withPermissions(
  [{ resource: "user", action: ["create"] }],
  async (
    _session,
    data: z.infer<typeof createUserSchema>,
  ): Promise<ActionResponse> => {
    try {
      // 1. Zod Validation on Server
      const parsedData = createUserSchema.safeParse(data);

      if (!parsedData.success) {
        return createErrorResponse(
          "Dados inválidos. Verifique os campos do formulário.",
          "VALIDATION_ERROR",
        );
      }

      const { name, email, password, role, sectorId } = parsedData.data;

      // 2. Create user via Better Auth Admin API
      // Better auth handles the hashing and database insertion automatically
      const result = await auth.api.createUser({
        body: {
          name,
          email,
          password,
          role,
          data: {
            sectorId,
          },
        },
      });

      if (!result.user) {
        // Fallback error, usually if email is already taken.
        // Real production apps check P2002 from Prisma if bypassing Better Auth,
        // but Better Auth usually throws before returning.
        return createErrorResponse(
          "Ocorreu um erro ao criar o usuário. O email já pode estar em uso.",
        );
      }

      return createSuccessResponse();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);

      // Better auth throws APIError for conflicts
      if (error instanceof Error && error.message.includes("already exists")) {
        return createErrorResponse(
          "Este e-mail já está em uso por outro usuário.",
        );
      }

      return createErrorResponse("Erro interno do servidor ao criar usuário.");
    }
  },
);
