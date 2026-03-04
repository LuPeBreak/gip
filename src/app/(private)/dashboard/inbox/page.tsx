import { DashboardPageWrapper } from "../../../../components/layout/dashboard-page-wrapper";

export default function InboxPage() {
  return (
    <DashboardPageWrapper
      title="Caixa de Entrada"
      description="Nesta página você vai receber e visualizar os processos que foram
        tramitados para o seu usuário."
    >
      <div className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 rounded-lg text-muted-foreground">
        <p>
          Aqui será possível aceitar a tramitação (assumindo a posse do
          processo) ou recusá-la devolvendo ao remetente com uma justificativa.
        </p>
      </div>
    </DashboardPageWrapper>
  );
}
