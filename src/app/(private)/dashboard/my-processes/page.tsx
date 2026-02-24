import { DashboardPageWrapper } from "../_components/dashboard-page-wrapper";

export default function MyProcessesPage() {
  return (
    <DashboardPageWrapper
      title="Meus Processos"
      description="Lista de processos que estão atualmente em sua posse."
    >
      <div className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 rounded-lg text-muted-foreground">
        <p>
          Aqui você enviará processos para outros usuários ou finalizará o
          trâmite arquivando-os.
        </p>
      </div>
    </DashboardPageWrapper>
  );
}
