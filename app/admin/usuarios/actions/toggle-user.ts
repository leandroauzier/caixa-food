"use server";

import { revalidatePath } from "next/cache";

import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleUserAction(formData: FormData) {
  const user = await requirePermission("manageUsers");

  const id = formData.get("id") as string;
  const active = formData.get("active") === "true";

  await prisma.user.updateMany({
    where: {
      id,
      companyId: user.companyId,
      role: { in: ["CAIXA", "COZINHA", "ATENDENTE"] },
    },
    data: { active: !active },
  });

  revalidatePath("/admin/usuarios");
}
