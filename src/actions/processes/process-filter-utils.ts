export interface ProcessFilterParams {
  search?: string;
  status?: string;
  location?: string;
  ownerId?: string;
}

export function buildProcessWhereClause(
  params?: ProcessFilterParams,
): Record<string, unknown> {
  const search = params?.search ?? "";
  const status = params?.status ?? "";
  const location = params?.location ?? "";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { number: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (location) {
    if (location === "internal") {
      where.location = null;
    } else if (location === "external") {
      where.location = { not: null };
    }
  }

  if (params?.ownerId) {
    where.ownerId = params.ownerId;
  }

  return where;
}
