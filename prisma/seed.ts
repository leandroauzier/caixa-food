import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const company = await prisma.company.upsert({
    where: { slug: "caixa-food" },
    update: {},
    create: {
      name: "Caixa Food",
      slug: "caixa-food",
    },
  });

  await prisma.user.upsert({
    where: {
      companyId_email: {
        companyId: company.id,
        email: "leandroauzier02@gmail.com",
      },
    },
    update: { passwordHash, role: "ADMIN", active: true },
    create: {
      companyId: company.id,
      name: "Leandro Sobrinho",
      email: "leandroauzier02@gmail.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Seed ok. Admin: leandroauzier02@gmail.com / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
