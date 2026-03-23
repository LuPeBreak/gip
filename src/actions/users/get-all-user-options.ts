"use server";

import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

export interface UserOption {
  id: string;
  name: string;
}

export const getAllUserOptions = withPermissions(
  [{ resource: "user", action: ["list_minimal"] }],
  async (): Promise<ActionResponse<UserOption[]>> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return createSuccessResponse(
        users.map((user) => ({
          id: user.id,
          name: user.name,
        })),
      );
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return createErrorResponse("Erro interno ao buscar usuários");
    }
  },
);
