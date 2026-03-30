"use server";

import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import {
  getMyDashboardStats,
  type MyDashboardStats,
} from "./get-my-dashboard-stats";

export interface DashboardAdminStats extends MyDashboardStats {
  processesBySector: { sectorName: string; sectorId: string; count: number }[];
  sectorIdMap: Record<string, string>;
  limboTransfers: {
    processId: string;
    processNumber: string;
    fromUserName: string;
    toUserName: string;
    daysPending: number;
    observation: string | null;
  }[];
}

export const getDashboardAdminStats = withPermissions(
  [{ resource: "dashboard", action: ["view_admin"] }],
  async (_session): Promise<ActionResponse<DashboardAdminStats>> => {
    try {
      const userStatsResponse = await getMyDashboardStats();
      if (!userStatsResponse.success || !userStatsResponse.data) {
        return createErrorResponse("Erro ao buscar estatísticas do dashboard.");
      }

      const allOpenProcesses = await prisma.process.findMany({
        where: {
          status: "OPEN",
          owner: { isNot: null },
        },
        include: {
          owner: {
            include: {
              sector: { select: { id: true, name: true } },
            },
          },
        },
      });

      const sectorMap = new Map<string, { sectorId: string; count: number }>();
      for (const proc of allOpenProcesses) {
        const sectorName = proc.owner?.sector?.name ?? "Sem Setor";
        const existing = sectorMap.get(sectorName);
        if (existing) {
          existing.count++;
        } else {
          sectorMap.set(sectorName, {
            sectorId: proc.owner?.sector?.id ?? "",
            count: 1,
          });
        }
      }

      const sectorIdMap: Record<string, string> = {};
      const processesBySector = Array.from(sectorMap.entries())
        .map(([sectorName, data]) => {
          sectorIdMap[sectorName] = data.sectorId;
          return {
            sectorName,
            sectorId: data.sectorId,
            count: data.count,
          };
        })
        .sort((a, b) => b.count - a.count);

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const limboProcesses = await prisma.process.findMany({
        where: {
          pendingTransferToUserId: { not: null },
          pendingTransferCreatedAt: { lt: oneDayAgo },
        },
        include: {
          owner: { select: { name: true } },
          pendingTransferToUser: { select: { name: true } },
        },
      });

      const limboTransfers = limboProcesses.map((proc) => ({
        processId: proc.id,
        processNumber: proc.number,
        fromUserName: proc.owner?.name ?? "Desconhecido",
        toUserName: proc.pendingTransferToUser?.name ?? "Desconhecido",
        daysPending: Math.floor(
          (Date.now() - (proc.pendingTransferCreatedAt?.getTime() ?? 0)) /
            (1000 * 60 * 60 * 24),
        ),
        observation: proc.pendingTransferObservation,
      }));

      return createSuccessResponse({
        ...userStatsResponse.data,
        processesBySector,
        sectorIdMap,
        limboTransfers,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas do dashboard:", error);
      return createErrorResponse("Erro interno ao buscar estatísticas.");
    }
  },
);
