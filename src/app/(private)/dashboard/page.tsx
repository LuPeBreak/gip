import { getDashboardAdminStats } from "@/actions/dashboard/get-dashboard-admin-stats";
import { getMyDashboardStats } from "@/actions/dashboard/get-my-dashboard-stats";
import { AdminCharts } from "@/components/dashboard/overview/admin-charts";
import { OverviewStatCards } from "@/components/dashboard/overview/overview-stat-cards";
import { DashboardPageWrapper } from "@/components/layout/dashboard-page-wrapper";

export default async function DashboardPage() {
  const userStatsResponse = await getMyDashboardStats();

  if (!userStatsResponse.success) {
    return (
      <DashboardPageWrapper
        title="Dashboard"
        description="Visão geral e atalhos rápidos do sistema GIP."
      >
        <div className="text-destructive">
          Erro ao carregar estatísticas:{" "}
          {userStatsResponse.error?.message ?? "Erro desconhecido"}
        </div>
      </DashboardPageWrapper>
    );
  }

  const userStats = userStatsResponse.data ?? {
    myProcesses: 0,
    pendingTransfers: 0,
    inbox: 0,
  };

  const dashboardResponse = await getDashboardAdminStats();
  const showAdminCharts =
    dashboardResponse.success &&
    dashboardResponse.data &&
    (dashboardResponse.data.processesBySector.length > 0 ||
      dashboardResponse.data.limboTransfers.length > 0);

  return (
    <DashboardPageWrapper
      title="Dashboard"
      description="Visão geral e atalhos rápidos do sistema GIP."
    >
      <OverviewStatCards stats={userStats} />
      {showAdminCharts && dashboardResponse.data && (
        <AdminCharts
          processesBySector={dashboardResponse.data.processesBySector}
          limboTransfers={dashboardResponse.data.limboTransfers}
          sectorIdMap={dashboardResponse.data.sectorIdMap}
        />
      )}
    </DashboardPageWrapper>
  );
}
