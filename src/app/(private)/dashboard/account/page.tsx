import { Building2, Mail } from "lucide-react";
import { headers } from "next/headers";
import { ChangePasswordForm } from "@/components/dashboard/account/change-password-form";
import { UpdateNameForm } from "@/components/dashboard/account/update-name-form";
import { DashboardPageWrapper } from "@/components/layout/dashboard-page-wrapper";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { getAvatarFallbackByName } from "@/lib/utils/formatters";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <DashboardPageWrapper
        title="Perfil"
        description="Gerencie suas informações pessoais"
      >
        <p className="text-muted-foreground">
          Erro ao carregar dados do perfil.
        </p>
      </DashboardPageWrapper>
    );
  }

  const user = session.user;

  return (
    <DashboardPageWrapper
      title="Perfil"
      description="Gerencie suas informações pessoais"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <UpdateNameForm defaultName={user.name} />
          <ChangePasswordForm />
        </div>

        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card className="lg:sticky lg:top-6">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {getAvatarFallbackByName(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>Informações do seu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">E-mail</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Setor</p>
                    <p className="text-sm font-medium">
                      {user.sector?.name || "Não atribuído"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageWrapper>
  );
}
