"use server";

import { revalidatePath } from "next/cache";

import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteCategoryAction(formData: FormData) {
  await requireRoles(["SUPERADMIN"]);

  const id = formData.get("id") as string;

  await prisma.category.delete({ where: { id } });

  revalidatePath("/superadmin/categorias");
}
