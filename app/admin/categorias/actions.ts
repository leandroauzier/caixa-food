"use server";

import { revalidatePath } from "next/cache";

import {
  createCategoryRecord,
  reorderCategoriesRecord,
} from "@/features/catalog/dal";
import { requirePermission } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

export type CategoryFormState = {
  message?: string;
  success?: boolean;
  errors?: {
    name?: string[];
    description?: string[];
  };
};

export async function createCategoryAction(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const user = await requirePermission("manageCatalog");
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os campos da categoria.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await createCategoryRecord({
    companyId: user.companyId,
    ...parsed.data,
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");

  return {
    success: result.persisted,
    message: result.message,
  };
}

export async function reorderCategoriesAction(categoryIds: string[]) {
  const user = await requirePermission("manageCatalog");
  await reorderCategoriesRecord({
    companyId: user.companyId,
    categoryIds,
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");
}
