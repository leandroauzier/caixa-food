import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { categories, productOptions, products } from "@/features/core/demo-data";
import type {
  AppStore,
  OrderSummary,
  ProductSummary,
  StoreCategory,
  StoreOrder,
  StoreProductOption,
  StoreProduct,
} from "@/types/domain";

const dataDirectory = path.join(process.cwd(), "data");
const storePath = path.join(dataDirectory, "app-store.json");

function nowIso() {
  return new Date().toISOString();
}

function categorySeed(): StoreCategory[] {
  const timestamp = nowIso();

  return categories.map((category, index) => ({
    id: category.id,
    companyId: "company_demo",
    name: category.name,
    description: category.description,
    active: category.active,
    sortOrder: index,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

function productSeed(): StoreProduct[] {
  const timestamp = nowIso();

  return products.map((product) => ({
    id: product.id,
    companyId: "company_demo",
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price,
    stockQuantity: product.stockQuantity,
    minStock: product.minStock,
    active: product.active,
    stockControl: true,
    sortOrder: product.sortOrder,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

function productOptionSeed(): StoreProductOption[] {
  return productOptions.map((option) => ({
    id: option.id,
    companyId: "company_demo",
    productId: option.productId,
    name: option.name,
    price: option.price,
    kind: option.kind,
    active: true,
  }));
}

function createDefaultStore(): AppStore {
  return {
    company: {
      id: "company_demo",
      name: "Caixa Food Demo",
    },
    nextOrderCode: 100,
    categories: categorySeed(),
    products: productSeed(),
    productOptions: productOptionSeed(),
    orders: [],
    sales: [],
    payments: [],
    stockMovements: [],
  };
}

async function ensureStoreFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(storePath, "utf-8");
  } catch {
    await writeFile(
      storePath,
      `${JSON.stringify(createDefaultStore(), null, 2)}\n`,
      "utf-8",
    );
  }
}

export async function readAppStore() {
  await ensureStoreFile();
  const raw = await readFile(storePath, "utf-8");
  const parsed = JSON.parse(raw) as Partial<AppStore>;

  return {
    ...createDefaultStore(),
    ...parsed,
    productOptions: parsed.productOptions ?? productOptionSeed(),
  } as AppStore;
}

export async function writeAppStore(store: AppStore) {
  await ensureStoreFile();
  await writeFile(storePath, `${JSON.stringify(store, null, 2)}\n`, "utf-8");
}

export async function updateAppStore(
  updater: (store: AppStore) => AppStore | Promise<AppStore>,
) {
  const store = await readAppStore();
  const updated = await updater(store);
  await writeAppStore(updated);
  return updated;
}

export function toProductSummary(
  product: StoreProduct,
  category?: StoreCategory,
  options: StoreProductOption[] = [],
): ProductSummary {
    return {
      id: product.id,
      categoryId: product.categoryId,
      categoryName: category?.name ?? "Sem categoria",
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      minStock: product.minStock,
      active: product.active,
      imageUrl: product.imageUrl || "/menu/classic-burger.svg",
      sortOrder: product.sortOrder ?? 0,
      options: options
        .filter((option) => option.productId === product.id && option.active)
        .map((option) => ({
        id: option.id,
        productId: option.productId,
        name: option.name,
        price: option.price,
        kind: option.kind,
      })),
  };
}

export function formatOrderTime(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function toOrderSummary(order: StoreOrder): OrderSummary {
  return {
    id: order.id,
    code: order.code,
    type: order.type,
    status: order.status,
    customerName: order.customerName,
    tableNumber: order.tableNumber,
    total: order.total,
    createdAt: formatOrderTime(order.createdAt),
    notes: order.notes,
    items: order.items.map((item) => ({
      productName: item.productName,
      imageUrl: item.imageUrl || "/menu/classic-burger.svg",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      notes: item.notes,
      selectedOptions: item.selectedOptions ?? [],
    })),
  };
}

export function buildId(prefix: string) {
  return `${prefix}_${randomUUID().replaceAll("-", "").slice(0, 10)}`;
}
