import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin, customSession } from "better-auth/plugins";
import { prisma } from "../prisma";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin: roles.admin,
        user: roles.user,
      },
    }),
    customSession(async ({ user, session }) => {
      const userWithSector = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          sector: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        user: {
          ...user,
          role: (user as unknown as { role: string }).role,
          sector: userWithSector?.sector || null,
        },
        session,
      };
    }),
  ],
});
