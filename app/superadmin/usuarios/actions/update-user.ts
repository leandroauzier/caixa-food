"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.email(),
  role: z.enum(["ADMIN", "CAIXA", "COZINHA", "ATENDENTE"]),
});

export type UpdateUserState = { error?: string };

export async function updateUserAction(
  _prev: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  await requireRoles(["SUPERADMIN"]);

  const parsed = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, name, email, role } = parsed.data;

  await prisma.user.update({ where: { id }, data: { name, email, role } });

  redirect("/superadmin/usuarios");
}
