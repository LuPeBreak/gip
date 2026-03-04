import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  sector: ["create", "list", "update", "delete"],
  process: ["create", "list", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
  sector: ["create", "list", "update", "delete"],
  process: ["create", "list", "update", "delete"],
});

export const user = ac.newRole({
  ...userAc.statements,
  process: ["create", "list"], // Users can create and list processes they own/interact with
});

export interface PermissionOption {
  resource: string;
  action?: string[];
}
