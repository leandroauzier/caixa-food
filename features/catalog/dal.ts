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
      .sort(
        (left, right) =>
          (left.sortOrder ?? 0) -
            (right.sortOrder ?? 0) ||
          left.name.localeCompare(right.name),
      )
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
          sortOrder: category.sortOrder ?? 0,
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
      sortOrder: category.sortOrder ?? 0,
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
      .sort(
        (left, right) =>
          (left.sortOrder ?? 0) -
            (right.sortOrder ?? 0) ||
          left.name.localeCompare(right.name),
      )
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
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
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
      sortOrder: product.sortOrder ?? 0,
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

export async function getProductById(companyId: string, id: string) {
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE !== "false") {
    const store = await readAppStore();
    const product = store.products.find(
      (item) => item.companyId === companyId && item.id === id,
    );
    if (!product) {
      return null;
    }

    const category = store.categories.find(
      (item) => item.id === product.categoryId && item.companyId === companyId,
    );

    return toProductSummary(
      product,
      category,
      store.productOptions.filter((option) => option.productId === product.id),
    );
  }

  const product = await prisma.product.findFirst({
    where: { id, companyId },
    include: { category: true },
  });

  if (!product) {
    return null;
  }

  return {
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
    sortOrder: product.sortOrder ?? 0,
    options: [],
  };
}

export async function getPublicMenuCatalog() {
  const [categoryItems, productItems] = await Promise.all([
    loadCategories(),
    loadProducts(),
  ]);

  return {
    categories: categoryItems
      .filter((category) => category.active)
      .sort(
        (left, right) =>
          (left.sortOrder ?? 0) - (right.sortOrder ?? 0) ||
          left.name.localeCompare(right.name),
      ),
    products: productItems
      .filter((product) => product.active)
      .sort(
        (left, right) =>
          (left.sortOrder ?? 0) - (right.sortOrder ?? 0) ||
          left.name.localeCompare(right.name),
      ),
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
      const sortOrder = currentStore.categories.filter(
        (category) => category.companyId === input.companyId,
      ).length;

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

  try {
    const duplicate = await prisma.category.findFirst({
      where: {
        companyId: input.companyId,
        name: { equals: input.name, mode: "insensitive" },
      },
    });

    if (duplicate) {
      return {
        persisted: false,
        message: "Ja existe uma categoria com esse nome.",
      };
    }

    const aggregate = await prisma.category.aggregate({
      where: { companyId: input.companyId },
      _max: { sortOrder: true },
    });

    const category = await prisma.category.create({
      data: {
        companyId: input.companyId,
        name: input.name,
        description: input.description || null,
        sortOrder: (aggregate._max.sortOrder ?? -1) + 1,
      },
    });

    return {
      persisted: true,
      message: `Categoria ${category.name} criada com sucesso.`,
    };
  } catch {
    return {
      persisted: false,
      message: "Nao foi possivel salvar no banco agora. Revise a conexao do Prisma.",
    };
  }
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
  imageUrl?: string;
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
          imageUrl: input.imageUrl || "/menu/classic-burger.svg",
          price: input.price,
          stockQuantity: input.stockQuantity,
          minStock: input.minStock,
          active: true,
          stockControl: true,
          sortOrder: currentStore.products.filter(
            (product) => product.companyId === input.companyId,
          ).length,
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
    const category = await prisma.category.findFirst({
      where: {
        id: input.categoryId,
        companyId: input.companyId,
      },
    });

    if (!category) {
      return {
        persisted: false,
        message: "Categoria invalida para este produto.",
      };
    }

    const duplicate = await prisma.product.findFirst({
      where: {
        companyId: input.companyId,
        name: { equals: input.name, mode: "insensitive" },
      },
    });

    if (duplicate) {
      return {
        persisted: false,
        message: "Ja existe um produto com esse nome.",
      };
    }

    const aggregate = await prisma.product.aggregate({
      where: { companyId: input.companyId },
      _max: { sortOrder: true },
    });

    const product = await prisma.product.create({
      data: {
        companyId: input.companyId,
        categoryId: input.categoryId,
        name: input.name,
        description: input.description || null,
        imageUrl: input.imageUrl || "/menu/classic-burger.svg",
        price: new Prisma.Decimal(input.price),
        stockQuantity: input.stockQuantity,
        minStock: input.minStock,
        stockControl: true,
        active: true,
        sortOrder: (aggregate._max.sortOrder ?? -1) + 1,
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

export async function updateProductRecord(input: {
  companyId: string;
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  stockQuantity: number;
  minStock: number;
}) {
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE !== "false") {
    const timestamp = new Date().toISOString();
    const store = await readAppStore();
    const index = store.products.findIndex(
      (product) => product.id === input.id && product.companyId === input.companyId,
    );

    if (index < 0) {
      return { persisted: false, message: "Produto nao encontrado." };
    }

    const categoryExists = store.categories.some(
      (category) =>
        category.id === input.categoryId && category.companyId === input.companyId,
    );

    if (!categoryExists) {
      return {
        persisted: false,
        message: "Categoria invalida para este produto.",
      };
    }

    await updateAppStore((currentStore) => {
      const products = [...currentStore.products];
      products[index] = {
        ...products[index],
        categoryId: input.categoryId,
        name: input.name,
        description: input.description || "Sem descricao.",
        imageUrl: input.imageUrl || products[index].imageUrl,
        price: input.price,
        stockQuantity: input.stockQuantity,
        minStock: input.minStock,
        updatedAt: timestamp,
      };

      return {
        ...currentStore,
        products,
      };
    });

    return { persisted: true, message: `Produto ${input.name} atualizado com sucesso.` };
  }

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: input.categoryId,
        companyId: input.companyId,
      },
    });

    if (!category) {
      return {
        persisted: false,
        message: "Categoria invalida para este produto.",
      };
    }

    const product = await prisma.product.findFirst({
      where: { id: input.id, companyId: input.companyId },
    });

    if (!product) {
      return {
        persisted: false,
        message: "Produto nao encontrado.",
      };
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        categoryId: input.categoryId,
        name: input.name,
        description: input.description || null,
        imageUrl: input.imageUrl || product.imageUrl,
        price: new Prisma.Decimal(input.price),
        stockQuantity: input.stockQuantity,
        minStock: input.minStock,
      },
    });

    return {
      persisted: true,
      message: `Produto ${input.name} atualizado com sucesso.`,
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

export async function reorderCategoriesRecord(input: {
  companyId?: string;
  categoryIds: string[];
}) {
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE !== "false") {
    await updateAppStore((currentStore) => {
      const orderMap = new Map(
        input.categoryIds.map((categoryId, index) => [categoryId, index]),
      );

      return {
        ...currentStore,
        categories: currentStore.categories.map((category) =>
          (input.companyId ? category.companyId === input.companyId : true) &&
          orderMap.has(category.id)
            ? {
                ...category,
                sortOrder: orderMap.get(category.id) ?? category.sortOrder,
              }
            : category,
        ),
      };
    });

    return { persisted: true };
  }

  await prisma.$transaction(
    input.categoryIds.map((id, sortOrder) =>
      prisma.category.update({
        where: { id },
        data: { sortOrder },
      }),
    ),
  );

  return { persisted: true };
}

export async function reorderProductsRecord(input: {
  companyId: string;
  productIds: string[];
}) {
  if (!process.env.DATABASE_URL || process.env.DEMO_MODE !== "false") {
    await updateAppStore((currentStore) => {
      const orderMap = new Map(
        input.productIds.map((productId, index) => [productId, index]),
      );

      return {
        ...currentStore,
        products: currentStore.products.map((product) =>
          product.companyId === input.companyId && orderMap.has(product.id)
            ? {
                ...product,
                sortOrder: orderMap.get(product.id) ?? product.sortOrder,
              }
            : product,
        ),
      };
    });

    return { persisted: true };
  }

  await prisma.$transaction(
    input.productIds.map((id, sortOrder) =>
      prisma.product.update({
        where: { id },
        data: { sortOrder },
      }),
    ),
  );

  return { persisted: true };
}
