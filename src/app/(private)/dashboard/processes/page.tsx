import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { auth } from "@/lib/auth/auth";
import { DashboardPageWrapper } from "../_components/dashboard-page-wrapper";
import { DataTable } from "../_components/data-table";
import { getProcesses } from "./_actions/get-processes";
import { columns } from "./_components/data-table-columns";
import { ProcessDataTableToolbar } from "./_components/data-table-toolbar";
import { processesSearchParamsCache } from "./_components/search-params";

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
  const response = await getProcesses({
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
        columns={columns}
        data={processes}
        pageCount={pageCount}
        totalCount={totalCount}
        toolbar={<ProcessDataTableToolbar />}
      />
    </DashboardPageWrapper>
  );
}
