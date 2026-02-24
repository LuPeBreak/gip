export default function SectorsPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Setores (Admin)</h1>
      <p className="max-w-md text-muted-foreground">
        Página restrita para a administração visualizar a listagem de todos os
        setores e micro-setores. Aqui será possível criar novos setores e,
        futuramente, atribuir os funcionários responsáveis por cada etapa.
      </p>
    </div>
  );
}
