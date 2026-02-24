import { DashboardPageWrapper } from "../_components/dashboard-page-wrapper";

export default function ProcessesPage() {
  return (
    <DashboardPageWrapper
      title="Todos os Processos"
      description="Lista global de todos os processos cadastrados no sistema."
    >
      <div className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 rounded-lg text-muted-foreground">
        <p>
          Navegue, busque e visualize detalhes relevantes como status,
          localização (setor atual) e de quem é a atual posse.
        </p>
      </div>
    </DashboardPageWrapper>
  );
}
