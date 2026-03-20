"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/components/dashboard/users/reset-password-schema";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { auth } from "@/lib/auth/auth";

interface ResetPasswordParams extends Partial<ResetPasswordFormValues> {
  userId: string;
}

export const resetUserPassword = withPermissions(
  [{ resource: "user", action: ["set-password"] }],
  async (
    _session,
    params: ResetPasswordParams,
  ): Promise<ActionResponse<{ password?: string }>> => {
    try {
      // Validate string inputs utilizing Zod Schema
      if (params.password) {
        const parsedData = resetPasswordSchema.safeParse({
          password: params.password,
        });
        if (!parsedData.success) {
          return createErrorResponse(
            "Senha inválida. Certifique-se de que atende aos requisitos mínimos.",
            "VALIDATION_ERROR",
          );
        }
      }

      const { userId, password } = params;
      const reqHeaders = await headers();

      // Generate a random 8-char password if none is provided
      const passwordToSet = password || Math.random().toString(36).slice(-8);

      await auth.api.setUserPassword({
        headers: reqHeaders,
        body: {
          userId,
          newPassword: passwordToSet,
        },
      });

      revalidatePath("/dashboard/users");

      return createSuccessResponse({ password: passwordToSet });
    } catch (error) {
      if (error instanceof Error) {
        return createErrorResponse(error.message);
      }
      return createErrorResponse(
        "Erro inesperado ao redefinir a senha do usuário.",
      );
    }
  },
);
