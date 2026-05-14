"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Slug: apenas letras minúsculas, números e hífens."),
});

export type UpdateCompanyState = { error?: string };

export async function updateCompanyAction(
  _prev: UpdateCompanyState,
  formData: FormData,
): Promise<UpdateCompanyState> {
  await requireRoles(["SUPERADMIN"]);

  const parsed = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, name, slug } = parsed.data;

  await prisma.company.update({ where: { id }, data: { name, slug } });

  redirect("/superadmin/empresas");
}
