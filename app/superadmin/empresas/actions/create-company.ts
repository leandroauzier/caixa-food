"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requireRoles } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Slug: apenas letras minúsculas, números e hífens."),
});

export type CreateCompanyState = { error?: string };

export async function createCompanyAction(
  _prev: CreateCompanyState,
  formData: FormData,
): Promise<CreateCompanyState> {
  await requireRoles(["SUPERADMIN"]);

  const parsed = schema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, slug } = parsed.data;

  const exists = await prisma.company.findUnique({ where: { slug } });
  if (exists) return { error: "Slug já em uso." };

  await prisma.company.create({ data: { name, slug } });

  redirect("/superadmin/empresas");
}
