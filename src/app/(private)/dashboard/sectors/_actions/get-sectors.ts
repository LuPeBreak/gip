"use server";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import type { SectorColumn } from "../_components/data-table-columns";

export interface GetSectorsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface PaginatedData<T> {
  data: T[];
  totalCount: number;
  pageCount: number;
  page: number;
}

export const getSectors = withPermissions(
  [{ resource: "sector", action: ["list"] }],
  async (
    _session,
    params?: GetSectorsParams,
  ): Promise<ActionResponse<PaginatedData<SectorColumn>>> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 15;
      const search = params?.search ?? "";
      const orderBy = params?.orderBy ?? "name";
      const order = params?.order ?? "asc";

      type SectorWhereInput = NonNullable<
        Parameters<typeof prisma.sector.count>[0]
      >["where"];
      const whereClause: SectorWhereInput = {};

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const [totalCount, sectors] = await prisma.$transaction([
        prisma.sector.count({ where: whereClause }),
        prisma.sector.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            _count: {
              select: { users: true },
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

      // Tratamento para formatar a resposta retornando countUsers que usaremos na UI
      const formattedSectors = sectors.map((sector) => ({
        id: sector.id,
        name: sector.name,
        description: sector.description,
        createdAt: sector.createdAt,
        usersCount: sector._count.users,
      }));

      return createSuccessResponse({
        data: formattedSectors as SectorColumn[],
        totalCount,
        pageCount,
        page,
      });
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
      return createErrorResponse("Erro interno do servidor ao buscar setores");
    }
  },
);
