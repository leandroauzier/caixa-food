"use server";

import { revalidatePath } from "next/cache";

import {
  createProductRecord,
  updateProductRecord,
  reorderProductsRecord,
} from "@/features/catalog/dal";
import { requirePermission } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export type ProductFormState = {
  message?: string;
  success?: boolean;
  errors?: {
    name?: string[];
    description?: string[];
    categoryId?: string[];
    imageUrl?: string[];
    price?: string[];
    stockQuantity?: string[];
    minStock?: string[];
  };
};

export type UpdateProductState = ProductFormState;

export async function createProductAction(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await requirePermission("manageCatalog");

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    imageUrl: formData.get("imageUrl"),
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

export async function reorderProductsAction(productIds: string[]) {
  const user = await requirePermission("manageCatalog");
  await reorderProductsRecord({
    companyId: user.companyId,
    productIds,
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");
}

export async function updateProductAction(
  _previousState: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  const user = await requirePermission("manageCatalog");

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    imageUrl: formData.get("imageUrl"),
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

  const id = String(formData.get("id") || "");
  const result = await updateProductRecord({
    id,
    companyId: user.companyId,
    ...parsed.data,
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/cardapio");

  return {
    success: result.persisted,
    message: result.message,
  };
}
