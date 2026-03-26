import { Calendar, FileText, History, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProcessById } from "@/actions/processes/get-process-by-id";
import { ProcessDetailAdminActions } from "@/components/dashboard/processes/process-detail-admin-actions";
import { ProcessHistoryTimeline } from "@/components/dashboard/processes/process-history-timeline";
import { DashboardPageWrapper } from "@/components/layout/dashboard-page-wrapper";
import { ProcessStatusBadge } from "@/components/processes/process-status-badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function ProcessDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getProcessById(id);

  if (!response.success) {
    notFound();
  }

  const process = response.data;

  if (!process) {
    notFound();
  }

  const sessionHeaders = await headers();
  const session = await auth.api.getSession({ headers: sessionHeaders });
  const canIntervene = session?.user?.id
    ? (
        await auth.api.userHasPermission({
          body: {
            userId: session.user.id,
            permissions: { process: ["intervene"] },
          },
        })
      ).success
    : false;

  return (
    <DashboardPageWrapper title={`Processo ${process.number}`}>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/processes">Processos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{process.number}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-2xl font-bold">
                      {process.number}
                    </CardTitle>
                    <ProcessStatusBadge status={process.status} />
                  </div>
                  <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    {process.ownerName ? (
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {process.ownerName}
                        {process.ownerSectorName && (
                          <span className="text-muted-foreground/60">
                            · {process.ownerSectorName}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="italic text-muted-foreground">
                        Sem posse
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(process.createdAt)}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Descrição
                </h3>
                <p className="text-base leading-relaxed">
                  {process.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Histórico</CardTitle>
              </div>
              <CardDescription>Registro de eventos do processo</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <ProcessHistoryTimeline processId={process.id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Última atualização</dt>
                  <dd className="font-medium text-right">
                    {formatDate(process.updatedAt)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {canIntervene && <ProcessDetailAdminActions process={process} />}

          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard/processes">
              <FileText className="mr-2 h-4 w-4" />
              Ver todos os processos
            </Link>
          </Button>
        </div>
      </div>
    </DashboardPageWrapper>
  );
}
