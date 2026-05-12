import "server-only";

import { requirePermission, requireRoles } from "@/lib/auth";
import {
  buildId,
  readAppStore,
  toOrderSummary,
  toProductSummary,
  updateAppStore,
} from "@/lib/local-store";
import type {
  OrderItemOptionSummary,
  OrderStatus,
  PaymentMethod,
  ProductOptionSummary,
} from "@/types/domain";

type DraftOrderItemInput = {
  productId: string;
  quantity: number;
  notes?: string;
  optionIds: string[];
};

type PreparedOrderItemResult =
  | { error: string }
  | {
      value: {
        productId: string;
        productName: string;
        imageUrl: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
        notes?: string;
        selectedOptions: OrderItemOptionSummary[];
      };
    };

function optionSubtotal(options: Array<{ price: number }>) {
  return options.reduce((sum, option) => sum + option.price, 0);
}

function mapSelectedOptions(
  availableOptions: ProductOptionSummary[],
  optionIds: string[],
): OrderItemOptionSummary[] {
  return optionIds
    .map((optionId) => availableOptions.find((option) => option.id === optionId))
    .filter((option): option is ProductOptionSummary => Boolean(option))
    .map((option) => ({
      optionId: option.id,
      name: option.name,
      price: option.price,
      kind: option.kind,
    }));
}

export async function getKitchenBoard() {
  await requirePermission("manageKitchen");
  const store = await readAppStore();
  const orderItems = store.orders
    .filter((order) => order.status !== "ENTREGUE" && order.status !== "CANCELADO")
    .sort((left, right) => right.code - left.code)
    .map(toOrderSummary);

  return {
    newOrders: orderItems.filter((order) => order.status === "NOVO"),
    preparingOrders: orderItems.filter((order) => order.status === "EM_PREPARO"),
    readyOrders: orderItems.filter((order) => order.status === "PRONTO"),
  };
}

export async function getPdvContext() {
  const user = await requireRoles(["ADMIN", "CAIXA", "ATENDENTE"]);
  const store = await readAppStore();
  const categoryMap = new Map(
    store.categories.map((category) => [category.id, category]),
  );
  const catalog = store.products
    .filter((product) => product.companyId === user.companyId && product.active)
    .map((product) =>
      toProductSummary(
        product,
        categoryMap.get(product.categoryId),
        store.productOptions,
      ),
    );
  const openOrders = store.orders
    .filter(
      (order) =>
        order.companyId === user.companyId &&
        order.status !== "ENTREGUE" &&
        order.status !== "CANCELADO",
    )
    .sort((left, right) => right.code - left.code)
    .map(toOrderSummary);

  return {
    catalog,
    catalogCategories: store.categories
      .filter((category) => category.companyId === user.companyId && category.active)
      .map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        active: category.active,
        productCount: catalog.filter((product) => product.categoryId === category.id).length,
      })),
    openOrders,
    readyForCheckout: openOrders.filter((order) => order.status === "PRONTO"),
  };
}

export async function getOrdersByStatus(status: OrderStatus) {
  const user = await requireRoles(["ADMIN", "CAIXA", "ATENDENTE", "COZINHA"]);
  const store = await readAppStore();

  return store.orders
    .filter((order) => order.companyId === user.companyId && order.status === status)
    .map(toOrderSummary);
}

export async function createOrderRecord(input: {
  companyId: string;
  createdById: string;
  customerName: string;
  type: "BALCAO" | "MESA" | "DELIVERY" | "RETIRADA";
  tableNumber?: string;
  notes?: string;
  items: DraftOrderItemInput[];
}) {
  const store = await readAppStore();

  if (input.items.length === 0) {
    return { success: false, message: "Adicione ao menos um item ao pedido." };
  }

  const preparedItems: PreparedOrderItemResult[] = input.items.map((draftItem) => {
    const product = store.products.find(
      (item) =>
        item.id === draftItem.productId &&
        item.companyId === input.companyId &&
        item.active,
    );

    if (!product) {
      return { error: "Um dos produtos do carrinho nao esta disponivel." } as const;
    }

    if (product.stockControl && product.stockQuantity < draftItem.quantity) {
      return {
        error: `Estoque insuficiente para ${product.name}.`,
      } as const;
    }

    const productOptions = store.productOptions
      .filter(
        (option) =>
          option.productId === product.id &&
          option.companyId === input.companyId &&
          option.active,
      )
      .map((option) => ({
        id: option.id,
        productId: option.productId,
        name: option.name,
        price: option.price,
        kind: option.kind,
      }));

    const selectedOptions = mapSelectedOptions(productOptions, draftItem.optionIds);
    const lineUnitPrice = product.price + optionSubtotal(selectedOptions);
    const lineSubtotal = Number((lineUnitPrice * draftItem.quantity).toFixed(2));

    return {
      value: {
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        quantity: draftItem.quantity,
        unitPrice: Number(lineUnitPrice.toFixed(2)),
        subtotal: lineSubtotal,
        notes: draftItem.notes || undefined,
        selectedOptions,
      },
    } as const;
  });

  const invalidItem = preparedItems.find((item) => "error" in item);
  if (invalidItem && "error" in invalidItem) {
    return { success: false, message: invalidItem.error };
  }

  const validPreparedItems = preparedItems.filter(
    (item): item is Extract<PreparedOrderItemResult, { value: object }> =>
      "value" in item,
  );
  const items = validPreparedItems.map((item) => item.value);
  const total = Number(
    items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
  );
  const timestamp = new Date().toISOString();
  const orderId = buildId("order");

  await updateAppStore((currentStore) => ({
    ...currentStore,
    nextOrderCode: currentStore.nextOrderCode + 1,
    orders: [
      {
        id: orderId,
        companyId: input.companyId,
        code: currentStore.nextOrderCode,
        type: input.type,
        status: "NOVO",
        customerName: input.customerName,
        tableNumber: input.tableNumber || undefined,
        notes: input.notes || undefined,
        total,
        createdById: input.createdById,
        createdAt: timestamp,
        updatedAt: timestamp,
        items,
      },
      ...currentStore.orders,
    ],
  }));

  return {
    success: true,
    message: `Pedido #${store.nextOrderCode} criado com ${items.length} item(ns).`,
  };
}

function nextKitchenStatus(status: OrderStatus): OrderStatus | null {
  if (status === "NOVO") return "EM_PREPARO";
  if (status === "EM_PREPARO") return "PRONTO";
  return null;
}

export async function advanceKitchenOrder(orderId: string, companyId: string) {
  let resultMessage = "Pedido atualizado.";

  await updateAppStore((store) => {
    const orders = store.orders.map((order) => {
      if (order.id !== orderId || order.companyId !== companyId) {
        return order;
      }

      const nextStatus = nextKitchenStatus(order.status);
      if (!nextStatus) {
        resultMessage = "Este pedido nao pode mais avancar na cozinha.";
        return order;
      }

      resultMessage = `Pedido #${order.code} movido para ${nextStatus}.`;

      return {
        ...order,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      };
    });

    return {
      ...store,
      orders,
    };
  });

  return resultMessage;
}

export async function registerOrderPayment(input: {
  orderId: string;
  companyId: string;
  createdById: string;
  method: PaymentMethod;
  amount: number;
}) {
  const store = await readAppStore();
  const order = store.orders.find(
    (item) => item.id === input.orderId && item.companyId === input.companyId,
  );

  if (!order) {
    return { success: false, message: "Pedido nao encontrado." };
  }

  if (order.status !== "PRONTO") {
    return {
      success: false,
      message: "O pagamento so pode ser registrado para pedidos prontos.",
    };
  }

  if (order.saleId) {
    return { success: false, message: "Este pedido ja foi finalizado." };
  }

  if (input.amount < order.total) {
    return { success: false, message: "O valor pago precisa cobrir o total." };
  }

  for (const item of order.items) {
    const product = store.products.find((productItem) => productItem.id === item.productId);
    if (!product) {
      return { success: false, message: "Produto do pedido nao foi encontrado." };
    }
    if (product.stockControl && product.stockQuantity < item.quantity) {
      return {
        success: false,
        message: `Estoque insuficiente para ${product.name}.`,
      };
    }
  }

  const timestamp = new Date().toISOString();
  const saleId = buildId("sale");
  const paymentId = buildId("pay");

  await updateAppStore((currentStore) => {
    const products = currentStore.products.map((product) => {
      const orderItem = order.items.find((item) => item.productId === product.id);
      if (!orderItem || !product.stockControl) {
        return product;
      }

      return {
        ...product,
        stockQuantity: product.stockQuantity - orderItem.quantity,
        updatedAt: timestamp,
      };
    });

    return {
      ...currentStore,
      products,
      orders: currentStore.orders.map((currentOrder) =>
        currentOrder.id === order.id
          ? {
              ...currentOrder,
              status: "ENTREGUE",
              saleId,
              updatedAt: timestamp,
            }
          : currentOrder,
      ),
      sales: [
        {
          id: saleId,
          companyId: input.companyId,
          orderId: order.id,
          total: order.total,
          discount: 0,
          status: "PAGA",
          createdById: input.createdById,
          createdAt: timestamp,
          paidAt: timestamp,
        },
        ...currentStore.sales,
      ],
      payments: [
        {
          id: paymentId,
          companyId: input.companyId,
          saleId,
          orderId: order.id,
          method: input.method,
          status: "APROVADO",
          amount: input.amount,
          createdAt: timestamp,
          paidAt: timestamp,
        },
        ...currentStore.payments,
      ],
      stockMovements: [
        ...order.items.map((item) => ({
          id: buildId("stock"),
          companyId: input.companyId,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          type: "SAIDA" as const,
          reason: `Baixa automatica do pedido #${order.code}`,
          userId: input.createdById,
          createdAt: timestamp,
        })),
        ...currentStore.stockMovements,
      ],
    };
  });

  return {
    success: true,
    message: `Pedido #${order.code} finalizado e estoque atualizado.`,
  };
}
