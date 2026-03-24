import { getInboxTransfers } from "@/actions/processes/get-inbox-transfers";
import { DashboardPageWrapper } from "../../../../components/layout/dashboard-page-wrapper";
import { InboxTable } from "./inbox-table";

export default async function InboxPage() {
  const response = await getInboxTransfers();

  const transfers = response.success && response.data ? response.data : [];

  return (
    <DashboardPageWrapper
      title="Caixa de Entrada"
      description="Nesta página você vai receber e visualizar os processos que foram tramitados para o seu usuário."
    >
      <InboxTable transfers={transfers} />
    </DashboardPageWrapper>
  );
}
