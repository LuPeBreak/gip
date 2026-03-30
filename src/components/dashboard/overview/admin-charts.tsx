"use client";

import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardAdminStats } from "@/actions/dashboard/get-dashboard-admin-stats";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CHART_COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

interface AdminChartsProps {
  processesBySector: DashboardAdminStats["processesBySector"];
  limboTransfers: DashboardAdminStats["limboTransfers"];
  sectorIdMap?: Record<string, string>;
}

export function AdminCharts({
  processesBySector,
  limboTransfers,
  sectorIdMap = {},
}: AdminChartsProps) {
  const router = useRouter();

  if (processesBySector.length === 0 && limboTransfers.length === 0) {
    return null;
  }

  const chartData = processesBySector.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // biome-ignore lint/suspicious/noExplicitAny: Recharts callback type is not well-typed
  const handleBarClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.sectorName) {
      const sectorName = data.activePayload[0].payload.sectorName;
      const sectorId = sectorIdMap[sectorName];
      if (sectorId) {
        router.push(`/dashboard/processos?sectorId=${sectorId}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Separator />
      <div>
        <h2 className="text-lg font-semibold mb-4">Dashboard Administrativo</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Processos por Setor */}
          {processesBySector.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Processos por Micro-Setor
              </h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="sectorName"
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={60}
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis style={{ fontSize: "12px" }} />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={handleBarClick}
                      isAnimationActive={false}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.sectorName} fill={entry.color} />
                      ))}
                    </Bar>
                    <Tooltip
                      formatter={(value) => [`${value}`, "Processos"]}
                      labelStyle={{ color: "var(--foreground)" }}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Trâmites em Limbo */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Trâmites em Limbo (mais de 1 dia)
            </h3>
            {limboTransfers.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Processo</TableHead>
                      <TableHead>De → Para</TableHead>
                      <TableHead>Dias</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {limboTransfers.slice(0, 5).map((transfer) => (
                      <TableRow key={transfer.processId}>
                        <TableCell className="font-medium">
                          {transfer.processNumber}
                        </TableCell>
                        <TableCell className="text-sm">
                          {transfer.fromUserName} → {transfer.toUserName}
                        </TableCell>
                        <TableCell>{transfer.daysPending}d</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {limboTransfers.length > 5 && (
                  <div className="p-2 text-xs text-muted-foreground text-center border-t">
                    +{limboTransfers.length - 5} mais
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground p-4 border rounded-lg">
                Nenhum trâmite em limbo.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
