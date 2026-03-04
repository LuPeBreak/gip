import { DashboardPageWrapper } from "../../../components/layout/dashboard-page-wrapper";

export default function DashboardPage() {
  return (
    <DashboardPageWrapper
      title="Dashboard"
      description="Visão geral e atalhos rápidos do sistema GIP."
    >
      <div className="flex flex-col items-start justify-start text-left bg-muted/50 p-6 rounded-lg border border-border">
        <p className="max-w-xl text-muted-foreground">
          Nesta tela, no futuro, você verá um resumo rápido do seu dia:
          <br />
          <br />- Quantos processos estão em sua posse atualmente.
          <br />- Quantos você tramitou e aguarda que o recebedor aceite.
          <br />- Quantos processos estão aguardando você aceitar ou recusar
          (sua caixa de entrada).
          <br />
          <br />
          (Futuramente, usuários Admin terão aqui gráficos mais detalhados do
          sistema geral).
        </p>
      </div>
    </DashboardPageWrapper>
  );
}
