import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  sector: ["create", "list", "update", "delete"],
  process: [
    "create",
    "list",
    "update",
    "delete",
    "delete_own",
    "finish",
    "reopen",
    "transfer",
    "intervene",
    "edit_observation",
  ],
  report: ["export"],
  dashboard: ["view_admin"],
  user: [...defaultStatements.user, "list_minimal"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  admin: ac.newRole({
    ...adminAc.statements,
    sector: ["create", "list", "update", "delete"],
    process: [
      "create",
      "list",
      "update",
      "delete",
      "delete_own",
      "finish",
      "reopen",
      "transfer",
      "intervene",
      "edit_observation",
    ],
    report: ["export"],
    dashboard: ["view_admin"],
    user: [...defaultStatements.user, "list_minimal"],
  }),
  user: ac.newRole({
    ...userAc.statements,
    process: [
      "create",
      "list",
      "delete_own",
      "finish",
      "reopen",
      "transfer",
      "edit_observation",
    ],
    report: ["export"],
    dashboard: [],
    user: ["list_minimal"],
  }),
} as const;

export type RoleKey = keyof typeof roles;

export interface PermissionOption {
  resource: string;
  action?: string[];
}
