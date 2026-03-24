"use server";

import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
  type PaginatedData,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import type { ProcessBase } from "./process-types";

export type MyProcessItem = ProcessBase;

export interface GetMyProcessesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  orderBy?: string;
  order?: "asc" | "desc";
}

export const getMyProcesses = withPermissions(
  [{ resource: "process", action: ["list"] }],
  async (
    session,
    params?: GetMyProcessesParams,
  ): Promise<ActionResponse<PaginatedData<MyProcessItem>>> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 15;
      const search = params?.search ?? "";
      const status = params?.status ?? "";
      const orderBy = params?.orderBy ?? "createdAt";
      const order = params?.order ?? "desc";

      const where: Record<string, unknown> = {
        ownerId: session.user.id,
      };

      if (search) {
        where.OR = [
          { number: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (status && status !== "all") {
        where.status = status;
      }

      const totalCount = await prisma.process.count({ where });

      const validOrderByFields = [
        "createdAt",
        "updatedAt",
        "number",
        "description",
        "status",
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
        orderBy: {
          [safeOrderBy]: order,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      const pageCount = Math.ceil(totalCount / pageSize);

      const formattedProcesses: MyProcessItem[] = processes.map((proc) => ({
        id: proc.id,
        number: proc.number,
        description: proc.description,
        status: proc.status as MyProcessItem["status"],
        ownerId: proc.ownerId,
        ownerName: proc.owner?.name ?? null,
        ownerSectorName: proc.owner?.sector?.name ?? null,
        createdAt: proc.createdAt,
        pendingTransferToUserId: proc.pendingTransferToUserId,
        pendingTransferObservation: proc.pendingTransferObservation,
        pendingTransferCreatedAt: proc.pendingTransferCreatedAt,
      }));

      return createSuccessResponse({
        data: formattedProcesses,
        totalCount,
        pageCount,
        page,
      });
    } catch (error) {
      console.error("Erro ao buscar meus processos:", error);
      return createErrorResponse("Erro interno ao buscar processos");
    }
  },
);
