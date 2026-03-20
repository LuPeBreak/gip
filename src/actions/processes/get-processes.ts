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
export type ProcessItem = {
  id: string;
  number: string;
  description: string;
  status: "OPEN" | "FINISHED" | "EXTERNAL";
  ownerId: string | null;
  ownerName?: string | null;
  ownerSectorName?: string | null;
  createdAt: Date;
};

export interface GetAllProcessesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
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

      const [totalCount, processes] = await prisma.$transaction([
        prisma.process.count({ where: whereClause }),
        prisma.process.findMany({
          where: whereClause,
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
            [orderBy]: order,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      const pageCount = Math.ceil(totalCount / pageSize);

      const formattedProcesses: ProcessItem[] = processes.map((proc) => ({
        id: proc.id,
        number: proc.number,
        description: proc.description,
        status: proc.status as ProcessItem["status"],
        ownerId: proc.ownerId,
        ownerName: proc.owner?.name,
        ownerSectorName: proc.owner?.sector?.name,
        createdAt: proc.createdAt,
      }));

      return createSuccessResponse({
        data: formattedProcesses,
        totalCount,
        pageCount,
        page,
      });
    } catch (error) {
      console.error("Erro ao buscar todos os processos:", error);
      return createErrorResponse(
        "Erro interno do servidor ao buscar processos",
      );
    }
  },
);
