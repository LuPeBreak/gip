import "dotenv/config";
import { auth } from "../src/lib/auth/auth";
import { prisma } from "../src/lib/prisma";

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@gip.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin1234";

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingUser) {
      console.log("Creating admin user...");
      await auth.api.createUser({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: "Admin",
          role: "admin",
        },
      });
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
