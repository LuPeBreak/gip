export default function DashboardPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="max-w-xl text-muted-foreground">
        Nesta tela, no futuro, você verá um resumo rápido do seu dia:
        <br />
        <br />- Quantos processos estão em sua posse atualmente.
        <br />- Quantos você tramitou e aguarda que o recebedor aceite.
        <br />- Quantos processos estão aguardando você aceitar ou recusar (sua
        caixa de entrada).
        <br />
        <br />
        (Futuramente, usuários Admin terão aqui gráficos mais detalhados do
        sistema geral).
      </p>
    </div>
  );
}
