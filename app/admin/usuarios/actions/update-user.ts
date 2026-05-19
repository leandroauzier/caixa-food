"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.email(),
  role: z.enum(["CAIXA", "COZINHA", "ATENDENTE"]),
});

export type UpdateUserState = { error?: string };

export async function updateUserAction(
  _prev: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  const user = await requirePermission("manageUsers");

  const parsed = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const target = await prisma.user.findFirst({
    where: {
      id: parsed.data.id,
      companyId: user.companyId,
      role: { in: ["CAIXA", "COZINHA", "ATENDENTE"] },
    },
  });

  if (!target) {
    return { error: "Usuário não encontrado nesta empresa." };
  }

  await prisma.user.update({
    where: { id: target.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
    },
  });

  revalidatePath("/admin/usuarios");

  return {};
}
