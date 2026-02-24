"use server";
import {
  type ActionResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/actions/action-utils";
import { withPermissions } from "@/lib/actions/with-permissions";
import { prisma } from "@/lib/prisma";
import type { UserColumn } from "../_components/data-table-columns";

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface PaginatedData<T> {
  data: T[];
  totalCount: number;
  pageCount: number;
  page: number;
}

export const getUsers = withPermissions(
  [{ resource: "user", action: ["list"] }],
  async (
    _session,
    params?: GetUsersParams,
  ): Promise<ActionResponse<PaginatedData<UserColumn>>> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 15;
      const search = params?.search ?? "";
      const role = params?.role ?? "";
      const orderBy = params?.orderBy ?? "name";
      const order = params?.order ?? "asc";

      // Dynamically extract the "where" type that Prisma expects for User queries.
      type UserWhereInput = NonNullable<
        Parameters<typeof prisma.user.count>[0]
      >["where"];
      const whereClause: UserWhereInput = {};

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      if (role) {
        whereClause.role = role;
      }

      // Execute transaction for count and data fetch cleanly
      const [totalCount, users] = await prisma.$transaction([
        prisma.user.count({ where: whereClause }),
        prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            banned: true,
            banReason: true,
          },
          orderBy: {
            [orderBy]: order,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      const pageCount = Math.ceil(totalCount / pageSize);

      return createSuccessResponse({
        data: users as UserColumn[],
        totalCount,
        pageCount,
        page,
      });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return createErrorResponse("Erro interno do servidor ao buscar usuários");
    }
  },
);
