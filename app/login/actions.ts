"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, encryptSession } from "@/lib/session";
import { getRoleHomeHref } from "@/features/core/app-modules";
import type { SessionUser } from "@/types/domain";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Email ou senha inválidos." };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { email, active: true },
    include: { company: true },
  });

  if (!user) {
    return { error: "Credenciais inválidas." };
  }

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    return { error: "Credenciais inválidas." };
  }

  const sessionUser: SessionUser = {
    id: user.id,
    companyId: user.companyId,
    companyName: user.company.name,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  const token = await encryptSession({ user: sessionUser });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(getRoleHomeHref(sessionUser.role));
}
