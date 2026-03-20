import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { getAllProcesses } from "@/actions/processes/get-processes";
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
  const { page, pageSize, search, status, orderBy, order } =
    processesSearchParamsCache.parse(sp);

  // No ownerId filter: lists all processes in the system
  const response = await getAllProcesses({
    page,
    pageSize,
    search,
    status,
    orderBy,
    order: order as "asc" | "desc",
  });

  const processes =
    response.success && response.data?.data ? response.data.data : [];
  const pageCount =
    response.success && response.data?.pageCount ? response.data.pageCount : 0;
  const totalCount =
    response.success && response.data?.totalCount
      ? response.data.totalCount
      : 0;

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
        toolbar={<ProcessesDataTableToolbar />}
      />
    </DashboardPageWrapper>
  );
}
