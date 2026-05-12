"use server";

import { revalidatePath } from "next/cache";

import { advanceKitchenOrder } from "@/features/orders/dal";
import { requireRoles } from "@/lib/auth";

export async function advanceKitchenOrderAction(orderId: string) {
  const user = await requireRoles(["ADMIN", "COZINHA"]);
  await advanceKitchenOrder(orderId, user.companyId);

  revalidatePath("/cozinha");
  revalidatePath("/pdv");
  revalidatePath("/admin");
}

