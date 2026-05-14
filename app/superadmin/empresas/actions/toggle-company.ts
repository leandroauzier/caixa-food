"use server";

import { revalidatePath } from "next/cache";

import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleCompanyAction(formData: FormData) {
  await requireRoles(["SUPERADMIN"]);

  const id = formData.get("id") as string;
  const active = formData.get("active") === "true";

  await prisma.company.update({ where: { id }, data: { active: !active } });

  revalidatePath("/superadmin/empresas");
}
