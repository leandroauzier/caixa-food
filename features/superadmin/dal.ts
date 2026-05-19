import "server-only";

import { prisma } from "@/lib/prisma";
import type { Role } from "@/types/domain";

export type SuperadminStats = {
  totalUsers: number;
  totalCompanies: number;
  totalCategories: number;
  totalProducts: number;
  activeUsers: number;
  usersByRole: Record<Role, number>;
};

export type SuperadminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  companyId: string;
  companyName: string;
  createdAt: string;
};

export type SuperadminCompany = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  userCount: number;
  categoryCount: number;
  createdAt: string;
};

export type SuperadminCategory = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  companyId: string;
  companyName: string;
  productCount: number;
  sortOrder: number;
};

export async function getSuperadminStats(): Promise<SuperadminStats> {
  const [users, totalCompanies, totalCategories, totalProducts] =
    await Promise.all([
      prisma.user.findMany({ select: { role: true, active: true } }),
      prisma.company.count(),
      prisma.category.count(),
      prisma.product.count(),
    ]);

  const usersByRole: Record<Role, number> = {
    SUPERADMIN: 0,
    ADMIN: 0,
    CAIXA: 0,
    COZINHA: 0,
    ATENDENTE: 0,
  };
  let activeUsers = 0;
  for (const u of users) {
    usersByRole[u.role as Role]++;
    if (u.active) activeUsers++;
  }

  return {
    totalUsers: users.length,
    totalCompanies,
    totalCategories,
    totalProducts,
    activeUsers,
    usersByRole,
  };
}

export async function getAllUsers(): Promise<SuperadminUser[]> {
  const users = await prisma.user.findMany({
    include: { company: { select: { name: true } } },
    orderBy: [{ company: { name: "asc" } }, { name: "asc" }],
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as Role,
    active: u.active,
    companyId: u.companyId,
    companyName: u.company.name,
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function getUserById(id: string): Promise<SuperadminUser | null> {
  const u = await prisma.user.findUnique({
    where: { id },
    include: { company: { select: { name: true } } },
  });
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as Role,
    active: u.active,
    companyId: u.companyId,
    companyName: u.company.name,
    createdAt: u.createdAt.toISOString(),
  };
}

export async function getAllCompanies(): Promise<SuperadminCompany[]> {
  const companies = await prisma.company.findMany({
    include: { _count: { select: { users: true, categories: true } } },
    orderBy: { name: "asc" },
  });

  return companies.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    active: c.active,
    userCount: c._count.users,
    categoryCount: c._count.categories,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function getCompanyById(id: string) {
  return prisma.company.findUnique({ where: { id } });
}

export async function getAllCategoriesGlobal(): Promise<SuperadminCategory[]> {
  const cats = await prisma.category.findMany({
    include: {
      company: { select: { name: true } },
      _count: { select: { products: true } },
    },
    orderBy: [{ company: { name: "asc" } }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description ?? "",
    active: c.active,
    companyId: c.companyId,
    companyName: c.company.name,
    productCount: c._count.products,
    sortOrder: c.sortOrder ?? 0,
  }));
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: { company: { select: { name: true } } },
  });
}
