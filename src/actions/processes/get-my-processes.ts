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

export type MyProcessItem = {
  id: string;
  number: string;
  description: string;
  status: "OPEN" | "FINISHED" | "EXTERNAL";
  createdAt: Date;
};

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

      type ProcessWhereInput = NonNullable<
        Parameters<typeof prisma.process.count>[0]
      >["where"];

      const whereClause: ProcessWhereInput = {
        ownerId: session.user.id, // Strictly filter by the current session user
      };

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
          orderBy: {
            [orderBy]: order,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      const pageCount = Math.ceil(totalCount / pageSize);

      const formattedProcesses: MyProcessItem[] = processes.map((proc) => ({
        id: proc.id,
        number: proc.number,
        description: proc.description,
        status: proc.status as MyProcessItem["status"],
        createdAt: proc.createdAt,
      }));

      return createSuccessResponse({
        data: formattedProcesses,
        totalCount,
        pageCount,
        page,
      });
    } catch (error) {
      console.error("Erro ao buscar meus processos:", error);
      return createErrorResponse(
        "Erro interno do servidor ao buscar seus processos",
      );
    }
  },
);
