import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileSearch,
  Search,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const features = [
    {
      icon: FileSearch,
      title: "Histórico de Movimentações",
      description:
        "Acompanhe cada etapa do processo com registro imutável de todas as ações realizadas.",
    },
    {
      icon: Users,
      title: "Controle de Posse",
      description:
        "Saiba exatamente quem está com cada processo, eliminando a dúvida sobre &ldquo;em qual mesa está o processo&rdquo;.",
    },
    {
      icon: Search,
      title: "Busca Global",
      description:
        "Pesquise processos por número ou descrição e encontre rapidamente qualquer processo no sistema.",
    },
    {
      icon: ClipboardList,
      title: "Gestão de Setores",
      description:
        "Adminstre os micro-setores como Pregão, Contratos, Compras e Jurídico.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-900 dark:to-green-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/10 dark:bg-amber-600/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23808080' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-800 text-white shadow-lg shadow-blue-700/25">
              <Workflow className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">GIP</h1>
              <p className="text-xs text-muted-foreground">
                Gestão Interna de Processos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-blue-200 dark:border-slate-700"
            >
              <Link href="/login">
                Entrar
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
            <Building2 className="w-4 h-4" />
            Prefeitura Municipal de Barra Mansa
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            Controle e Rastreabilidade de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-600 dark:from-blue-400 dark:to-green-400 block mt-2">
              Processos Licitatórios
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Sistema de gestão interna para otimizar o controle e a
            rastreabilidade dos processos licitatórios. Elimine a dúvida sobre
            &ldquo;em qual mesa está o processo&rdquo; com transparência e
            eficiência.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-700 to-green-600 hover:from-blue-800 hover:to-green-700 border-0 text-white"
            >
              <Link href="/login">
                Acessar Sistema
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold mb-4">
              Funcionalidades Principais
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Uma plataforma completa para gestionar os processos da Secretaria
              de Administração
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 flex items-center justify-center mb-4 group-hover:from-blue-600 group-hover:to-green-500 group-hover:text-white transition-all">
                  <feature.icon className="w-6 h-6 text-blue-700 dark:text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Workflow className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">GIP</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Gestão Interna de Processos de Licitação
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Desenvolvido pela equipe de TI da Prefeitura de Barra Mansa
          </p>
        </div>
      </footer>
    </div>
  );
}
