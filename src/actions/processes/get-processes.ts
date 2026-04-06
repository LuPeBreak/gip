"use server";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
  type PaginatedData,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import { buildProcessWhereClause } from "./process-filter-utils";
import type { ProcessBase } from "./process-types";

export type ProcessItem = ProcessBase;

export interface GetAllProcessesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  location?: string;
  ownerId?: string;
  sectorId?: string;
  orderBy?: string;
  order?: "asc" | "desc";
}

export const getAllProcesses = withPermissions(
  [{ resource: "process", action: ["list"] }],
  async (
    _session,
    params?: GetAllProcessesParams,
  ): Promise<ActionResponse<PaginatedData<ProcessItem>>> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 15;
      const orderBy = params?.orderBy ?? "createdAt";
      const order = params?.order ?? "desc";

      const where = buildProcessWhereClause(params);

      const totalCount = await prisma.process.count({ where });

      const validOrderByFields = [
        "createdAt",
        "updatedAt",
        "number",
        "status",
        "location",
      ];
      const safeOrderBy = validOrderByFields.includes(orderBy)
        ? orderBy
        : "createdAt";

      const processes = await prisma.process.findMany({
        where,
        include: {
          owner: {
            select: {
              name: true,
              sector: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { [safeOrderBy]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      const pageCount = Math.ceil(totalCount / pageSize);

      const formattedProcesses: ProcessItem[] = processes.map((proc) => ({
        id: proc.id,
        number: proc.number,
        description: proc.description,
        status: proc.status as ProcessItem["status"],
        ownerId: proc.ownerId,
        ownerName: proc.owner?.name ?? null,
        ownerSectorName: proc.owner?.sector?.name ?? null,
        createdAt: proc.createdAt,
        updatedAt: proc.updatedAt,
        location: proc.location,
      }));

      return createSuccessResponse({
        data: formattedProcesses,
        totalCount,
        pageCount,
        page,
      });
    } catch (error) {
      console.error("Erro ao buscar todos os processos:", error);
      return createErrorResponse("Erro interno ao buscar processos");
    }
  },
);
