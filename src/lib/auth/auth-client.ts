import { adminClient, customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { ac, roles } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    customSessionClient<typeof auth>(),
    adminClient({
      ac,
      roles: {
        admin: roles.admin,
        user: roles.user,
      },
    }),
  ],
});
