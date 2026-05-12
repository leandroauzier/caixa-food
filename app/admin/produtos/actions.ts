"use server";

import { revalidatePath } from "next/cache";

import { createProductRecord } from "@/features/catalog/dal";
import { requirePermission } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export type ProductFormState = {
  message?: string;
  success?: boolean;
  errors?: {
    name?: string[];
    description?: string[];
    categoryId?: string[];
    price?: string[];
    stockQuantity?: string[];
    minStock?: string[];
  };
};

export async function createProductAction(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await requirePermission("manageCatalog");

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    stockQuantity: formData.get("stockQuantity"),
    minStock: formData.get("minStock"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Revise os campos do produto.",
      success: false,
    };
  }

  const result = await createProductRecord({
    companyId: user.companyId,
    ...parsed.data,
  });

  revalidatePath("/admin/produtos");

  return {
    success: result.persisted,
    message: result.message,
  };
}

