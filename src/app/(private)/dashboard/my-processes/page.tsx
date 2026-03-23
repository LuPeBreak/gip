import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { getMyProcesses } from "@/actions/processes/get-my-processes";
import { CreateProcessButton } from "@/components/dashboard/my-processes/create-process-button";
import { myProcessesColumns } from "@/components/dashboard/my-processes/my-processes-data-table-columns";
import { MyProcessesDataTableToolbar } from "@/components/dashboard/my-processes/my-processes-data-table-toolbar";
import { processesSearchParamsCache } from "@/components/dashboard/my-processes/my-processes-search-params";
import { auth } from "@/lib/auth/auth";
import { DataTable } from "../../../../components/data-table/data-table";
import { DashboardPageWrapper } from "../../../../components/layout/dashboard-page-wrapper";

interface MyProcessesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function MyProcessesPage({
  searchParams,
}: MyProcessesPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  // Parse params server-side safely using nuqs
  const sp = await searchParams;
  const { page, pageSize, search, status, orderBy, order } =
    processesSearchParamsCache.parse(sp);

  const response = await getMyProcesses({
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

  // Render using standard DataTable components, and passing our Columns Config
  return (
    <DashboardPageWrapper
      title="Meus Processos Ativos"
      description="Gerencie os processos que estão atualmente sob sua posse na sua mesa de trabalho."
    >
      <DataTable
        columns={myProcessesColumns}
        data={processes}
        pageCount={pageCount}
        totalCount={totalCount}
        toolbar={<MyProcessesDataTableToolbar />}
        tableActions={<CreateProcessButton />}
      />
    </DashboardPageWrapper>
  );
}
