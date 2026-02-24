import {
  FolderOpen,
  Inbox,
  Landmark,
  Layers,
  LayoutDashboard,
  Users,
  Workflow,
} from "lucide-react";
import { headers } from "next/headers";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { CustomTrigger } from "./custom-trigger";
import { NavUser } from "./nav-user";
import { SidebarLink } from "./sidebar-link";

const menuLinks = {
  Geral: {
    roles: ["admin", "user"],
    links: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "user"],
      },
      {
        title: "Meus Processos",
        url: "/dashboard/my-processes",
        icon: FolderOpen,
        roles: ["admin", "user"],
      },
      {
        title: "Caixa de Entrada",
        url: "/dashboard/inbox",
        icon: Inbox,
        roles: ["admin", "user"],
      },
      {
        title: "Todos os Processos",
        url: "/dashboard/processes",
        icon: Layers,
        roles: ["admin", "user"],
      },
    ],
  },
  Admin: {
    roles: ["admin"],
    links: [
      {
        title: "Usuários",
        url: "/dashboard/users",
        icon: Users,
        roles: ["admin"],
      },
      {
        title: "Setores",
        url: "/dashboard/sectors",
        icon: Landmark,
        roles: ["admin"],
      },
    ],
  },
};

export async function DashboardSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Workflow className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">GIP</span>
                <span className="truncate text-xs">Pref. Barra Mansa</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(menuLinks).map(([groupName, group]) => {
          // Verifica se o usuário tem permissão para ver o grupo
          if (!group.roles.includes(session.user.role as string)) return null;

          // Filtra os links que o usuário pode ver
          const visibleLinks = group.links.filter((link) =>
            link.roles.includes(session.user.role as string),
          );

          // Se não há links visíveis, não renderiza o grupo
          if (visibleLinks.length === 0) return null;

          return (
            <SidebarGroup key={groupName}>
              <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleLinks.map((link) => (
                    <SidebarMenuItem key={link.title}>
                      <SidebarLink
                        url={link.url}
                        title={link.title}
                        icon={<link.icon />}
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image || undefined,
          }}
        />
        <div className="group-data-[collapsible=icon]:hidden">
          <SidebarSeparator />
          <div className="px-2 py-2">
            <p className="text-[0.65rem] text-muted-foreground text-center leading-tight">
              Desenvolvido pela Equipe de TI da Prefeitura de Barra Mansa
            </p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
      <CustomTrigger />
    </Sidebar>
  );
}
