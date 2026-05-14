"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  description: z.string().max(120).optional(),
});

export type UpdateCategoryState = { error?: string };

export async function updateCategoryAction(
  _prev: UpdateCategoryState,
  formData: FormData,
): Promise<UpdateCategoryState> {
  await requireRoles(["SUPERADMIN"]);

  const parsed = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, name, description } = parsed.data;

  await prisma.category.update({ where: { id }, data: { name, description } });

  redirect("/superadmin/categorias");
}
