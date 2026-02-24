import { DashboardPageWrapper } from "../_components/dashboard-page-wrapper";

export default function SectorsPage() {
  return (
    <DashboardPageWrapper
      title="Setores"
      description="Gerenciamento de departamentos e áreas da prefeitura."
    >
      <div className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 rounded-lg text-muted-foreground">
        <p>
          Aqui o administrador cadastra, visualiza e inativa os setores por onde
          os processos tramitam.
        </p>
      </div>
    </DashboardPageWrapper>
  );
}
