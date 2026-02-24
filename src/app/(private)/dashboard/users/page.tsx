import { DashboardPageWrapper } from "../_components/dashboard-page-wrapper";
import { DataTable } from "../_components/data-table";
import { getUsers } from "./_actions/get-users";
import { columns } from "./_components/data-table-columns";

export default async function UsersPage() {
  const response = await getUsers();
  const users = response.success && response.data ? response.data : [];

  return (
    <DashboardPageWrapper
      title="Usuários do Sistema"
      description="Gerencie o acesso, cargos e setores dos usuários da plataforma."
    >
      <DataTable columns={columns} data={users} />
    </DashboardPageWrapper>
  );
}
