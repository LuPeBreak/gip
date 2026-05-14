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
  orderBy?: string;
  order?: "asc" | "desc";
  inTransfer?: boolean;
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
      const orderBy = params?.orderBy ?? "createdAt";
      const order = params?.order ?? "desc";
      const inTransfer = params?.inTransfer ?? false;

      const where: Record<string, unknown> = {
        ownerId: session.user.id,
      };

      if (search) {
        where.OR = [
          { number: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (inTransfer) {
        where.pendingTransferToUserId = { not: null };
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
          pendingTransferToUser: {
            select: { name: true },
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
        pendingTransferToUserName: proc.pendingTransferToUser?.name ?? null,
        pendingTransferObservation: proc.pendingTransferObservation,
        pendingTransferCreatedAt: proc.pendingTransferCreatedAt,
        location: proc.location,
        externalOrigin: proc.externalOrigin,
        observation: proc.observation,
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
