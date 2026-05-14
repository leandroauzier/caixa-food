"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  companyId: z.string().min(1),
  name: z.string().min(2).max(80),
  description: z.string().max(120).optional(),
});

export type CreateCategoryState = { error?: string };

export async function createCategoryAction(
  _prev: CreateCategoryState,
  formData: FormData,
): Promise<CreateCategoryState> {
  await requireRoles(["SUPERADMIN"]);

  const parsed = schema.safeParse({
    companyId: formData.get("companyId"),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { companyId, name, description } = parsed.data;

  const exists = await prisma.category.findUnique({
    where: { companyId_name: { companyId, name } },
  });
  if (exists) return { error: "Categoria já existe nesta empresa." };

  await prisma.category.create({ data: { companyId, name, description } });

  redirect("/superadmin/categorias");
}
