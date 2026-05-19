"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requirePermission } from "@/lib/auth";
import { sendTemporaryPasswordEmail } from "@/lib/email";
import { generateTemporaryPassword, hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.email(),
  role: z.enum(["CAIXA", "COZINHA", "ATENDENTE"]),
});

export type CreateUserState = {
  error?: string;
  success?: string;
};

export async function createUserAction(
  _prev: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const user = await requirePermission("manageUsers");

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, role } = parsed.data;

  const exists = await prisma.user.findUnique({
    where: { companyId_email: { companyId: user.companyId, email } },
  });

  if (exists) {
    return { error: "Email já cadastrado nesta empresa." };
  }

  const password = generateTemporaryPassword(8);
  const passwordHash = await hashPassword(password);
  const createdUser = await prisma.user.create({
    data: {
      companyId: user.companyId,
      name,
      email,
      passwordHash,
      role,
    },
  });

  try {
    await sendTemporaryPasswordEmail({
      to: email,
      name,
      companyName: user.companyName,
      password,
    });
  } catch {
    await prisma.user.delete({ where: { id: createdUser.id } });

    return {
      error:
        "Nao foi possivel enviar o e-mail com a senha temporaria. O usuario nao foi criado.",
    };
  }

  revalidatePath("/admin/usuarios");

  return {
    success: "Usuario criado. A senha temporaria foi enviada por e-mail.",
  };
}
