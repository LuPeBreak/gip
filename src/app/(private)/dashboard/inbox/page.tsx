export default function InboxPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Caixa de Entrada</h1>
      <p className="max-w-md text-muted-foreground">
        Nesta página você vai receber e visualizar os processos que foram
        tramitados para o seu usuário. Aqui será possível aceitar a tramitação
        (assumindo a posse do processo) ou recusá-la devolvendo ao remetente com
        uma justificativa.
      </p>
    </div>
  );
}
