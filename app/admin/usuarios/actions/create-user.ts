"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requirePermission } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.email(),
  password: z.string().min(8).max(64),
  role: z.enum(["CAIXA", "COZINHA", "ATENDENTE"]),
});

export type CreateUserState = { error?: string };

export async function createUserAction(
  _prev: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const user = await requirePermission("manageUsers");

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, role } = parsed.data;

  const exists = await prisma.user.findUnique({
    where: { companyId_email: { companyId: user.companyId, email } },
  });

  if (exists) {
    return { error: "Email já cadastrado nesta empresa." };
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: {
      companyId: user.companyId,
      name,
      email,
      passwordHash,
      role,
    },
  });

  revalidatePath("/admin/usuarios");

  return {};
}
