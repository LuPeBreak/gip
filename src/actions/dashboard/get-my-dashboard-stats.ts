"use server";

import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";

export interface MyDashboardStats {
  myProcesses: number;
  pendingTransfers: number;
  inbox: number;
}

export const getMyDashboardStats = withPermissions(
  [{ resource: "process", action: ["list"] }],
  async (session): Promise<ActionResponse<MyDashboardStats>> => {
    try {
      const userId = session.user.id;

      const myProcesses = await prisma.process.count({
        where: {
          ownerId: userId,
          status: "OPEN",
        },
      });

      const pendingTransfers = await prisma.process.count({
        where: {
          ownerId: userId,
          pendingTransferToUserId: { not: null },
        },
      });

      const inbox = await prisma.process.count({
        where: {
          pendingTransferToUserId: userId,
        },
      });

      return createSuccessResponse({
        myProcesses,
        pendingTransfers,
        inbox,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas do dashboard:", error);
      return createErrorResponse("Erro interno ao buscar estatísticas.");
    }
  },
);
