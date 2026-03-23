import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { getAllProcesses } from "@/actions/processes/get-processes";
import { getAllUserOptions } from "@/actions/users/get-all-user-options";
import { processesColumns } from "@/components/dashboard/processes/processes-data-table-columns";
import { ProcessesDataTableToolbar } from "@/components/dashboard/processes/processes-data-table-toolbar";
import { processesSearchParamsCache } from "@/components/dashboard/processes/processes-search-params";
import { auth } from "@/lib/auth/auth";
import { DataTable } from "../../../../components/data-table/data-table";
import { DashboardPageWrapper } from "../../../../components/layout/dashboard-page-wrapper";

interface ProcessesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProcessesPage({
  searchParams,
}: ProcessesPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const sp = await searchParams;
  const { page, pageSize, search, status, ownerId, orderBy, order } =
    processesSearchParamsCache.parse(sp);

  const isAdmin = session.user.role === "admin";

  const [processesResponse, usersResponse] = await Promise.all([
    getAllProcesses({
      page,
      pageSize,
      search,
      status,
      ownerId: ownerId || undefined,
      orderBy,
      order: order as "asc" | "desc",
    }),
    isAdmin ? getAllUserOptions() : { success: true, data: [] },
  ]);

  const processes =
    processesResponse.success && processesResponse.data?.data
      ? processesResponse.data.data
      : [];
  const pageCount =
    processesResponse.success && processesResponse.data?.pageCount
      ? processesResponse.data.pageCount
      : 0;
  const totalCount =
    processesResponse.success && processesResponse.data?.totalCount
      ? processesResponse.data.totalCount
      : 0;

  const users =
    usersResponse.success && usersResponse.data ? usersResponse.data : [];

  return (
    <DashboardPageWrapper
      title="Todos os Processos"
      description="Visão geral de todos os processos cadastrados no sistema e suas posses atuais."
    >
      <DataTable
        columns={processesColumns}
        data={processes}
        pageCount={pageCount}
        totalCount={totalCount}
        toolbar={<ProcessesDataTableToolbar users={users} isAdmin={isAdmin} />}
      />
    </DashboardPageWrapper>
  );
}
