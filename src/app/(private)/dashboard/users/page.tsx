export default function UsersPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 text-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Usuários do Sistema</h1>
      <p className="max-w-md text-muted-foreground">
        Área de gestão de contas (Admin). Aqui o administrador lista os
        usuários, cria novos cadastros, realiza bloqueio/banimento de contas e
        reseta senhas.
      </p>
    </div>
  );
}
