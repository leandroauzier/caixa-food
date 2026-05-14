"use server";

import { revalidatePath } from "next/cache";

import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteCompanyAction(formData: FormData) {
  await requireRoles(["SUPERADMIN"]);

  const id = formData.get("id") as string;

  await prisma.company.delete({ where: { id } });

  revalidatePath("/superadmin/empresas");
}
