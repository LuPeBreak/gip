import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../env";
import { PrismaClient } from "./generated/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const connectionString = `${env.DATABASE_URL}`;

const createPrismaClient = () => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
