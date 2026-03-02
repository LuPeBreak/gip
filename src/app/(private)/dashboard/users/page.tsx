import type { SearchParams } from "nuqs/server";
import { DashboardPageWrapper } from "../_components/dashboard-page-wrapper";
import { DataTable } from "../_components/data-table";
import { getUsers } from "./_actions/get-users";
import { CreateUserDialog } from "./_components/create-user-dialog";
import { columns } from "./_components/data-table-columns";
import { UsersDataTableToolbar } from "./_components/data-table-toolbar";
import { usersSearchParamsCache } from "./_components/search-params";

interface UsersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  // Parse params server-side safely using nuqs
  const sp = await searchParams;
  const { page, pageSize, search, role, orderBy, order } =
    usersSearchParamsCache.parse(sp);

  const response = await getUsers({
    page,
    pageSize,
    search,
    role,
    orderBy,
    order: order as "asc" | "desc",
  });

  const users =
    response.success && response.data?.data ? response.data.data : [];
  const pageCount =
    response.success && response.data?.pageCount ? response.data.pageCount : 0;
  const totalCount =
    response.success && response.data?.totalCount
      ? response.data.totalCount
      : 0;

  return (
    <DashboardPageWrapper
      title="Usuários do Sistema"
      description="Gerencie o acesso, cargos e setores dos usuários da plataforma."
    >
      <DataTable
        columns={columns}
        data={users}
        pageCount={pageCount}
        totalCount={totalCount}
        toolbar={<UsersDataTableToolbar />}
        tableActions={<CreateUserDialog />}
      />
    </DashboardPageWrapper>
  );
}
