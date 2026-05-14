"use server";

import { revalidatePath } from "next/cache";

import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleCategoryAction(formData: FormData) {
  await requireRoles(["SUPERADMIN"]);

  const id = formData.get("id") as string;
  const active = formData.get("active") === "true";

  await prisma.category.update({ where: { id }, data: { active: !active } });

  revalidatePath("/superadmin/categorias");
}
