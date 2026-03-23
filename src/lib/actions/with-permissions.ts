import type { Session as BetterAuthSession } from "better-auth";
import type { UserWithRole } from "better-auth/plugins/admin";
import { headers } from "next/headers";
import type { ActionResponse } from "@/lib/actions/action-utils";
import { auth } from "@/lib/auth/auth";
import type { PermissionOption } from "@/lib/auth/permissions";

export interface Session extends BetterAuthSession {
  user: UserWithRole;
}

export interface WithPermissionsOptions {
  requireAll?: boolean;
}

export function withPermissions<T, TArgs extends unknown[]>(
  options: PermissionOption[],
  callback: (session: Session, ...args: TArgs) => Promise<ActionResponse<T>>,
  opts?: WithPermissionsOptions,
) {
  return async (...args: TArgs): Promise<ActionResponse<T>> => {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as Session | null;

    if (!session) {
      return {
        success: false,
        error: {
          message: "Sessão expirada. Faça login novamente.",
        },
      };
    }

    const permissions: Record<string, string[]> = {};

    options.forEach(({ resource, action = ["list"] }) => {
      permissions[resource] = action;
    });

    const requireAll = opts?.requireAll ?? true;

    if (!requireAll) {
      const hasAnyPermission = await Promise.all(
        Object.entries(permissions).map(async ([resource, actions]) => {
          for (const action of actions) {
            const result = await auth.api.userHasPermission({
              body: {
                userId: session.user.id,
                permissions: { [resource]: [action] },
              },
            });
            if (result.success) {
              return true;
            }
          }
          return false;
        }),
      );

      if (!hasAnyPermission.some(Boolean)) {
        return {
          success: false,
          error: {
            message: "Você não tem permissão para realizar esta ação.",
          },
        };
      }

      return callback(session, ...args);
    }

    const permissionCheck = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions,
      },
    });

    if (!permissionCheck.success) {
      return {
        success: false,
        error: {
          message: "Você não tem permissão para realizar esta ação.",
        },
      };
    }

    return callback(session, ...args);
  };
}
