"use server";

import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import type { UserColumn } from "../_components/data-table-columns";

export const getUsers = withPermissions(
  [{ resource: "user", action: ["list"] }],
  async (): Promise<ActionResponse<UserColumn[]>> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          banReason: true,
        },
        orderBy: {
          name: "asc", // Order by name since createdAt is gone
        },
      });

      return createSuccessResponse(users as UserColumn[]);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return createErrorResponse("Erro interno do servidor ao buscar usuários");
    }
  },
);
