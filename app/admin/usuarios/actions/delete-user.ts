"use server";

import { revalidatePath } from "next/cache";

import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteUserAction(formData: FormData) {
  const user = await requirePermission("manageUsers");

  const id = formData.get("id") as string;

  await prisma.user.deleteMany({
    where: {
      id,
      companyId: user.companyId,
      role: { in: ["CAIXA", "COZINHA", "ATENDENTE"] },
    },
  });

  revalidatePath("/admin/usuarios");
}
