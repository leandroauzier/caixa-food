import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { hasPermission, type Permission } from "@/lib/permissions";
import { COOKIE_NAME, decryptSession } from "@/lib/session";
import type { Role, SessionUser } from "@/types/domain";

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await decryptSession(token);

  return session?.user ?? null;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRoles(allowedRoles: Role[]) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    redirect("/");
  }

  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();

  if (!hasPermission(user.role, permission)) {
    redirect("/");
  }

  return user;
}
