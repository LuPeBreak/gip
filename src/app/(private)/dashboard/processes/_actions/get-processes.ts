"use server";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
  type PaginatedData,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import type { ProcessStatus } from "@/lib/prisma/generated/enums";
import type { ProcessColumn } from "../_components/data-table-row-actions";

export interface GetProcessesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  orderBy?: string;
  order?: "asc" | "desc";
  ownerId?: string | null; // Filter for "My Processes"
}

export const getProcesses = withPermissions(
  [{ resource: "process", action: ["list"] }],
  async (
    _session,
    params?: GetProcessesParams,
  ): Promise<ActionResponse<PaginatedData<ProcessColumn>>> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 15;
      const search = params?.search ?? "";
      const status = params?.status ?? "";
      const orderBy = params?.orderBy ?? "createdAt";
      const order = params?.order ?? "desc";

      type ProcessWhereInput = NonNullable<
        Parameters<typeof prisma.process.count>[0]
      >["where"];
      const whereClause: ProcessWhereInput = {};

      if (search) {
        whereClause.OR = [
          { number: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (status && status !== "all") {
        whereClause.status = status as ProcessStatus;
      }

      // If ownerId is provided, filter exactly by it (can be used for "My Processes").
      // If ownerId is explicitly null, filter where ownerId = null (useful for Archived processes searching)
      if (params?.ownerId !== undefined) {
        whereClause.ownerId = params.ownerId;
      }

      const [totalCount, processes] = await prisma.$transaction([
        prisma.process.count({ where: whereClause }),
        prisma.process.findMany({
          where: whereClause,
          include: {
            owner: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            [orderBy]: order,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      const pageCount = Math.ceil(totalCount / pageSize);

      const formattedProcesses = processes.map((proc) => ({
        id: proc.id,
        number: proc.number,
        description: proc.description,
        status: proc.status,
        ownerId: proc.ownerId,
        ownerName: proc.owner?.name,
        createdAt: proc.createdAt,
      }));

      return createSuccessResponse({
        data: formattedProcesses,
        totalCount,
        pageCount,
        page,
      });
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
      return createErrorResponse(
        "Erro interno do servidor ao buscar processos",
      );
    }
  },
);
