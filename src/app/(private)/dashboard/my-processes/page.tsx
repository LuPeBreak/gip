export default function MyProcessesPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Meus Processos</h1>
      <p className="max-w-md text-muted-foreground">
        Aqui você visualizará os processos que estão atualmente sob a sua posse.
        Nesta página será possível enviar (tramitar) processos para outros
        usuários ou mesmo finalizar os processos quando concluídos.
      </p>
    </div>
  );
}
