"use client";

import Link from "next/link";
import { GripVertical, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { formatMoney } from "@/lib/money";
import type { ProductSummary } from "@/types/domain";

type ProductTableProps = {
  products: ProductSummary[];
  onOrderChange?: (productIds: string[]) => Promise<void> | void;
  editHrefBase?: string;
};

export function ProductTable({
  products,
  onOrderChange,
  editHrefBase,
}: ProductTableProps) {
  const [orderedProducts, setOrderedProducts] = useState(products);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOrderedProducts(products);
  }, [products]);

  function moveItem(sourceId: string, targetId: string) {
    if (!onOrderChange) {
      return;
    }

    if (sourceId === targetId) {
      return;
    }

    const next = [...orderedProducts];
    const sourceIndex = next.findIndex((item) => item.id === sourceId);
    const targetIndex = next.findIndex((item) => item.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) {
      return;
    }

    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);

    setOrderedProducts(next);
    startTransition(() => {
      void onOrderChange(next.map((item) => item.id));
    });
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
      {onOrderChange ? (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 text-xs text-slate-500">
          <span>Arraste os itens para mudar a ordem de apresentação.</span>
          {isPending ? (
            <span className="inline-flex items-center gap-2 text-slate-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Salvando ordem
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              {onOrderChange ? (
                <th className="w-12 px-4 py-3 font-medium"> </th>
              ) : null}
              <th className="px-4 py-3 font-medium">Imagem</th>
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Estoque</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {editHrefBase ? (
                <th className="px-4 py-3 font-medium">Ações</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orderedProducts.map((product) => (
              <tr
                key={product.id}
                draggable={Boolean(onOrderChange)}
                onDragStart={() => onOrderChange && setDraggingId(product.id)}
                onDragEnd={() => onOrderChange && setDraggingId(null)}
                onDragOver={(event) => onOrderChange && event.preventDefault()}
                onDrop={(event) => {
                  if (!onOrderChange) return;
                  event.preventDefault();
                  if (draggingId) {
                    moveItem(draggingId, product.id);
                  }
                  setDraggingId(null);
                }}
                className={`text-slate-700 transition ${
                  draggingId === product.id ? "bg-slate-50 opacity-80" : ""
                }`}
              >
                {onOrderChange ? (
                  <td className="px-4 py-4 align-middle">
                    <button
                      type="button"
                      className="inline-flex cursor-grab items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-400 active:cursor-grabbing"
                      aria-label="Arrastar produto"
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                  </td>
                ) : null}
                <td className="px-4 py-4 align-middle">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-4 align-middle">
                  <p className="font-semibold text-slate-950">{product.name}</p>
                  <p className="text-slate-500">{product.description}</p>
                </td>
                <td className="px-4 py-4 align-middle">{product.categoryName}</td>
                <td className="px-4 py-4 align-middle">{formatMoney(product.price)}</td>
                <td className="px-4 py-4 align-middle">
                  {product.stockQuantity} / min {product.minStock}
                </td>
                <td className="px-4 py-4 align-middle">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      product.stockQuantity <= product.minStock
                        ? "bg-amber-100 text-amber-800"
                        : product.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {product.stockQuantity <= product.minStock
                      ? "Atenção"
                      : product.active
                        ? "Ativo"
                        : "Inativo"}
                  </span>
                </td>
                {editHrefBase ? (
                  <td className="px-4 py-4 align-middle">
                    <Link
                      href={`${editHrefBase}/${product.id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                    >
                      Editar
                    </Link>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
