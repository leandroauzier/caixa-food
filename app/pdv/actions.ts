"use server";

import { revalidatePath } from "next/cache";

import { createOrderRecord, registerOrderPayment } from "@/features/orders/dal";
import { requireRoles } from "@/lib/auth";
import { createOrderSchema, paymentSchema } from "@/lib/validations";

type DraftCartItem = {
  productId: string;
  quantity: number;
  notes?: string;
  optionIds: string[];
};

export type OrderFormState = {
  message?: string;
  success?: boolean;
  errors?: {
    customerName?: string[];
    type?: string[];
    tableNumber?: string[];
    notes?: string[];
    cart?: string[];
  };
};

export type PaymentFormState = {
  message?: string;
  success?: boolean;
  errors?: {
    orderId?: string[];
    amount?: string[];
    method?: string[];
  };
};

function parseCart(rawCart: string): DraftCartItem[] | null {
  try {
    const parsed = JSON.parse(rawCart) as DraftCartItem[];

    if (!Array.isArray(parsed)) {
      return null;
    }

    const validItems = parsed.filter(
      (item) =>
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0 &&
        Array.isArray(item.optionIds),
    );

    return validItems.length ? validItems : null;
  } catch {
    return null;
  }
}

export async function createOrderAction(
  _previousState: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const user = await requireRoles(["SUPERADMIN", "ADMIN", "CAIXA", "ATENDENTE"]);
  const parsed = createOrderSchema.safeParse({
    customerName: formData.get("customerName"),
    type: formData.get("type"),
    tableNumber: formData.get("tableNumber"),
    notes: formData.get("notes"),
    cart: formData.get("cart"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os dados do pedido.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const cartItems = parseCart(parsed.data.cart);
  if (!cartItems) {
    return {
      success: false,
      message: "Adicione itens validos ao carrinho antes de enviar.",
      errors: {
        cart: ["Carrinho invalido."],
      },
    };
  }

  const result = await createOrderRecord({
    companyId: user.companyId,
    createdById: user.id,
    customerName: parsed.data.customerName,
    type: parsed.data.type,
    tableNumber: parsed.data.tableNumber || undefined,
    notes: parsed.data.notes || undefined,
    items: cartItems,
  });

  revalidatePath("/pdv");
  revalidatePath("/cozinha");
  revalidatePath("/admin");

  return {
    success: result.success,
    message: result.message,
  };
}

export async function registerPaymentAction(
  _previousState: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  const user = await requireRoles(["SUPERADMIN", "ADMIN", "CAIXA"]);
  const parsed = paymentSchema.safeParse({
    orderId: formData.get("orderId"),
    amount: formData.get("amount"),
    method: formData.get("method"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os dados do pagamento.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await registerOrderPayment({
    companyId: user.companyId,
    createdById: user.id,
    ...parsed.data,
  });

  revalidatePath("/pdv");
  revalidatePath("/cozinha");
  revalidatePath("/admin");
  revalidatePath("/admin/estoque");
  revalidatePath("/admin/relatorios");

  return {
    success: result.success,
    message: result.message,
  };
}
