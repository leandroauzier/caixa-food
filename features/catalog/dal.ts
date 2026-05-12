import "server-only";

import { Prisma } from "@prisma/client";

import { requirePermission } from "@/lib/auth";
import { buildId, readAppStore, toProductSummary, updateAppStore } from "@/lib/local-store";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import type { CategorySummary } from "@/types/domain";

async function loadCategories(companyId?: string) {
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE !== "false") {
    const store = await readAppStore();

    return store.categories
      .filter((category) => (companyId ? category.companyId === companyId : true))
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((category) => {
        const productCount = store.products.filter(
          (product) => product.categoryId === category.id,
        ).length;

        return {
          id: category.id,
          name: category.name,
          description: category.description || "Sem descricao.",
          productCount,
          active: category.active,
        };
      });
  }

  try {
    const result = await prisma.category.findMany({
      where: companyId ? { companyId } : undefined,
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return result.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description ?? "Sem descricao.",
      productCount: category._count.products,
      active: category.active,
    }));
  } catch {
    return [];
  }
}

async function loadProducts(companyId?: string) {
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE !== "false") {
    const store = await readAppStore();
    const categoryMap = new Map(
      store.categories.map((category) => [category.id, category]),
    );

    return store.products
      .filter((product) => (companyId ? product.companyId === companyId : true))
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((product) =>
        toProductSummary(
          product,
          categoryMap.get(product.categoryId),
          store.productOptions,
        ),
      );
  }

  try {
    const result = await prisma.product.findMany({
      where: companyId ? { companyId } : undefined,
      include: {
        category: true,
      },
      orderBy: [{ active: "desc" }, { name: "asc" }],
    });

    return result.map((product) => ({
      id: product.id,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      name: product.name,
      description: product.description ?? "Sem descricao.",
      imageUrl: product.imageUrl ?? "/menu/classic-burger.svg",
      price: Number(product.price),
      stockQuantity: product.stockQuantity,
      minStock: product.minStock,
      active: product.active,
      options: [],
    }));
  } catch {
    return [];
  }
}

export async function getCategorySummaries() {
  const user = await requirePermission("manageCatalog");
  return loadCategories(user.companyId);
}

export async function getProductSummaries() {
  const user = await requirePermission("manageCatalog");
  return loadProducts(user.companyId);
}

export async function getPublicMenuCatalog() {
  const [categoryItems, productItems] = await Promise.all([
    loadCategories(),
    loadProducts(),
  ]);

  return {
    categories: categoryItems.filter((category) => category.active),
    products: productItems.filter((product) => product.active),
  };
}

export async function createCategoryRecord(input: {
  companyId: string;
  name: string;
  description?: string;
}) {
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE !== "false") {
    const timestamp = new Date().toISOString();
    const store = await readAppStore();
    const duplicate = store.categories.some(
      (category) =>
        category.companyId === input.companyId &&
        category.name.toLowerCase() === input.name.toLowerCase(),
    );

    if (duplicate) {
      return {
        persisted: false,
        message: "Ja existe uma categoria com esse nome.",
      };
    }

    await updateAppStore((currentStore) => {
      const sortOrder = currentStore.categories.length;

      return {
        ...currentStore,
        categories: [
          ...currentStore.categories,
          {
            id: buildId("cat"),
            companyId: input.companyId,
            name: input.name,
            description: input.description || "Sem descricao.",
            active: true,
            sortOrder,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        ],
      };
    });

    return {
      persisted: true,
      message: `Categoria ${input.name} criada com sucesso.`,
    };
  }

  return {
    persisted: false,
    message: "Cadastro de categoria via Prisma ainda nao foi ligado neste fluxo.",
  };
}

export async function getProductHighlights() {
  const items = await getProductSummaries();

  return items.map((item) => ({
    ...item,
    priceLabel: formatMoney(item.price),
    stockStatus:
      item.stockQuantity <= item.minStock ? "Reposicao necessaria" : "OK",
  }));
}

export async function createProductRecord(input: {
  companyId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  minStock: number;
}) {
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE !== "false") {
    const timestamp = new Date().toISOString();
    const store = await readAppStore();
    const categoryExists = store.categories.some(
      (category) => category.id === input.categoryId,
    );

    if (!categoryExists) {
      return {
        persisted: false,
        message: "Categoria invalida para este produto.",
      };
    }

    await updateAppStore((currentStore) => ({
      ...currentStore,
      products: [
        ...currentStore.products,
        {
          id: buildId("prod"),
          companyId: input.companyId,
          categoryId: input.categoryId,
          name: input.name,
          description: input.description || "Sem descricao.",
          imageUrl: "/menu/classic-burger.svg",
          price: input.price,
          stockQuantity: input.stockQuantity,
          minStock: input.minStock,
          active: true,
          stockControl: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    }));

    return {
      persisted: true,
      message: `Produto ${input.name} criado com sucesso.`,
    };
  }

  try {
    const product = await prisma.product.create({
      data: {
        companyId: input.companyId,
        categoryId: input.categoryId,
        name: input.name,
        description: input.description || null,
        imageUrl: "/menu/classic-burger.svg",
        price: new Prisma.Decimal(input.price),
        stockQuantity: input.stockQuantity,
        minStock: input.minStock,
        stockControl: true,
        active: true,
      },
    });

    return {
      persisted: true,
      message: `Produto ${product.name} criado com sucesso.`,
    };
  } catch {
    return {
      persisted: false,
      message: "Nao foi possivel salvar no banco agora. Revise a conexao do Prisma.",
    };
  }
}

export async function getInventoryAlerts() {
  const items = await getProductSummaries();

  return items
    .filter((item) => item.stockQuantity <= item.minStock)
    .map((item) => ({
      productName: item.name,
      currentStock: item.stockQuantity,
      minimumStock: item.minStock,
    }));
}

export async function getCategoryOptions(): Promise<CategorySummary[]> {
  return getCategorySummaries();
}
