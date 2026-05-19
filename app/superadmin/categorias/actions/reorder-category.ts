"use server";

import { revalidatePath } from "next/cache";

import { reorderCategoriesRecord } from "@/features/catalog/dal";
import { requireRoles } from "@/lib/auth";

export async function reorderCategoryAction(categoryIds: string[]) {
  await requireRoles(["SUPERADMIN"]);

  await reorderCategoriesRecord({
    categoryIds,
  });

  revalidatePath("/superadmin/categorias");
  revalidatePath("/cardapio");
}
