import "server-only";

import { prisma } from "@/lib/prisma";
import type { Role } from "@/types/domain";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Exclude<Role, "SUPERADMIN" | "ADMIN">;
  active: boolean;
  companyId: string;
  companyName: string;
  createdAt: string;
};

export async function getAdminUsers(companyId: string): Promise<AdminUser[]> {
  const users = await prisma.user.findMany({
    where: {
      companyId,
      role: { in: ["CAIXA", "COZINHA", "ATENDENTE"] },
    },
    include: { company: { select: { name: true } } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as AdminUser["role"],
    active: user.active,
    companyId: user.companyId,
    companyName: user.company.name,
    createdAt: user.createdAt.toISOString(),
  }));
}

export async function getAdminUserById(
  companyId: string,
  id: string,
): Promise<AdminUser | null> {
  const user = await prisma.user.findFirst({
    where: {
      id,
      companyId,
      role: { in: ["CAIXA", "COZINHA", "ATENDENTE"] },
    },
    include: { company: { select: { name: true } } },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as AdminUser["role"],
    active: user.active,
    companyId: user.companyId,
    companyName: user.company.name,
    createdAt: user.createdAt.toISOString(),
  };
}
