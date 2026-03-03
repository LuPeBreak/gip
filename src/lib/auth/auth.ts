import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { prisma } from "../prisma";
import { ac, admin, user } from "./permissions";

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
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
});
