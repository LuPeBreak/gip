import type { SearchParams } from "nuqs/server";
import { DataTable } from "../../../../components/data-table/data-table";
import { DashboardPageWrapper } from "../../../../components/layout/dashboard-page-wrapper";
import { getSectors } from "./_actions/get-sectors";
import { CreateSectorButton } from "./_components/create-sector-button";
import { sectorsColumns } from "./_components/sectors-data-table-columns";
import { SectorsDataTableToolbar } from "./_components/sectors-data-table-toolbar";
import { sectorsSearchParamsCache } from "./_components/sectors-search-params";

interface SectorsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SectorsPage({ searchParams }: SectorsPageProps) {
  const sp = await searchParams;
  const { page, pageSize, search, orderBy, order } =
    sectorsSearchParamsCache.parse(sp);

  const response = await getSectors({
    page,
    pageSize,
    search,
    orderBy,
    order: order as "asc" | "desc",
  });

  const sectors =
    response.success && response.data?.data ? response.data.data : [];
  const pageCount =
    response.success && response.data?.pageCount ? response.data.pageCount : 0;
  const totalCount =
    response.success && response.data?.totalCount
      ? response.data.totalCount
      : 0;

  return (
    <DashboardPageWrapper
      title="Gestão de Setores"
      description="Gerencie as áreas, cadastrando os micro-setores que determinam cada etapa dos processos."
    >
      <DataTable
        columns={sectorsColumns}
        data={sectors}
        pageCount={pageCount}
        totalCount={totalCount}
        toolbar={<SectorsDataTableToolbar />}
        tableActions={<CreateSectorButton />}
      />
    </DashboardPageWrapper>
  );
}
