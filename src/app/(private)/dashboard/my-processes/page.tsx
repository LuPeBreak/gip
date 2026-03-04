import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { auth } from "@/lib/auth/auth";
import { DashboardPageWrapper } from "../_components/dashboard-page-wrapper";
import { DataTable } from "../_components/data-table";
import { getProcesses } from "../processes/_actions/get-processes";
import { columns } from "../processes/_components/data-table-columns";
import { ProcessDataTableToolbar } from "../processes/_components/data-table-toolbar";
import { processesSearchParamsCache } from "../processes/_components/search-params";

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

  const response = await getProcesses({
    page,
    pageSize,
    search,
    status,
    orderBy,
    order: order as "asc" | "desc",
    ownerId: session.user.id, // FILTER ONLY MINE
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
        columns={columns}
        data={processes}
        pageCount={pageCount}
        totalCount={totalCount}
        toolbar={<ProcessDataTableToolbar />}
      />
    </DashboardPageWrapper>
  );
}
