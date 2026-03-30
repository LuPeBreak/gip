import { Briefcase, Inbox, Send } from "lucide-react";
import Link from "next/link";
import type { MyDashboardStats } from "@/actions/dashboard/get-my-dashboard-stats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OverviewStatCardsProps {
  stats: MyDashboardStats;
}

export function OverviewStatCards({ stats }: OverviewStatCardsProps) {
  const cards = [
    {
      label: "Processos em Posse",
      value: stats.myProcesses,
      icon: Briefcase,
      href: "/dashboard/my-processes",
      description: "Processos sob sua responsabilidade",
    },
    {
      label: "Trâmites Enviados",
      value: stats.pendingTransfers,
      icon: Send,
      href: "/dashboard/my-processes?inTransfer=true",
      description: "Aguardando aceite do destinatário",
    },
    {
      label: "Caixa de Entrada",
      value: stats.inbox,
      icon: Inbox,
      href: "/dashboard/inbox",
      description: "Processos enviados para você",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Link key={card.label} href={card.href} className="block">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <CardDescription className="mt-1">
                {card.description}
              </CardDescription>
              <span className="text-xs text-primary mt-2 inline-block">
                Ver todos →
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
