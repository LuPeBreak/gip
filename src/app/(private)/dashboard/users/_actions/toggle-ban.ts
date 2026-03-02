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

interface ToggleBanParams {
  userId: string;
  banned: boolean;
  banReason?: string | null;
}

export const toggleUserBan = withPermissions(
  [{ resource: "user", action: ["ban"] }],
  async (_session, params: ToggleBanParams): Promise<ActionResponse> => {
    try {
      const { userId, banned, banReason } = params;
      const reqHeaders = await headers();

      if (banned) {
        await auth.api.banUser({
          headers: reqHeaders,
          body: {
            userId,
            banReason: banReason ?? undefined,
          },
        });
      } else {
        await auth.api.unbanUser({
          headers: reqHeaders,
          body: {
            userId,
          },
        });
      }

      revalidatePath("/dashboard/users");

      return createSuccessResponse();
    } catch (error) {
      if (error instanceof Error) {
        return createErrorResponse(error.message);
      }
      return createErrorResponse(
        "Erro inesperado ao alterar status do usuário.",
      );
    }
  },
);
