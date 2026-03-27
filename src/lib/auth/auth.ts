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
  user: {
    additionalFields: {
      sectorId: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [
    customSession(async ({ user }) => {
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
          sector: userWithSector?.sector || null,
        },
      };
    }),
    adminPlugin({
      ac,
      roles: {
        admin: roles.admin,
        user: roles.user,
      },
    }),
  ],
});
