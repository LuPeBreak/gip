export default function ProcessesPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Todos os Processos</h1>
      <p className="max-w-md text-muted-foreground">
        Lista global de todos os processos cadastrados no sistema. Navegue,
        busque e visualize detalhes relevantes como status, localização (setor
        atual) e de quem é a atual posse.
      </p>
    </div>
  );
}
