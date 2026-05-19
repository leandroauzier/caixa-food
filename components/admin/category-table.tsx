"use client";

import Link from "next/link";
import { GripVertical, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

type CategoryTableItem = {
  id: string;
  name: string;
  description: string;
  productCount: number;
  active: boolean;
  sortOrder: number;
  companyName?: string;
};

type CategoryTableProps = {
  categories: CategoryTableItem[];
  onOrderChange: (categoryIds: string[]) => Promise<void> | void;
  showCompany?: boolean;
  editHrefBase?: string;
  onToggleAction?: (formData: FormData) => Promise<void>;
  onDeleteAction?: (formData: FormData) => Promise<void>;
};

export function CategoryTable({
  categories,
  onOrderChange,
  showCompany = false,
  editHrefBase,
  onToggleAction,
  onDeleteAction,
}: CategoryTableProps) {
  const [orderedCategories, setOrderedCategories] = useState(categories);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOrderedCategories(categories);
  }, [categories]);

  function moveItem(sourceId: string, targetId: string) {
    if (sourceId === targetId) {
      return;
    }

    const next = [...orderedCategories];
    const sourceIndex = next.findIndex((item) => item.id === sourceId);
    const targetIndex = next.findIndex((item) => item.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) {
      return;
    }

    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);

    setOrderedCategories(next);
    startTransition(() => {
      void onOrderChange(next.map((item) => item.id));
    });
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 text-xs text-slate-500">
        <span>Arraste para reorganizar a exibição.</span>
        {isPending ? (
          <span className="inline-flex items-center gap-2 text-slate-700">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Salvando ordem
          </span>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="w-12 px-4 py-3 font-medium" />
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Descrição</th>
              {showCompany ? (
                <th className="px-4 py-3 font-medium">Empresa</th>
              ) : null}
              <th className="px-4 py-3 font-medium">Itens</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {(editHrefBase || onToggleAction || onDeleteAction) ? (
                <th className="px-4 py-3 font-medium">Ações</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orderedCategories.map((category) => (
              <tr
                key={category.id}
                draggable
                onDragStart={() => setDraggingId(category.id)}
                onDragEnd={() => setDraggingId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggingId) {
                    moveItem(draggingId, category.id);
                  }
                  setDraggingId(null);
                }}
                className={`transition ${
                  draggingId === category.id ? "bg-slate-50 opacity-80" : ""
                }`}
              >
                <td className="px-4 py-4 align-middle">
                  <button
                    type="button"
                    className="inline-flex cursor-grab items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-400 active:cursor-grabbing"
                    aria-label="Arrastar categoria"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </td>
                <td className="px-4 py-4 align-middle font-semibold text-slate-950">
                  {category.name}
                </td>
                <td className="max-w-[240px] px-4 py-4 align-middle text-slate-600">
                  {category.description || "—"}
                </td>
                {showCompany ? (
                  <td className="px-4 py-4 align-middle text-slate-600">
                    {category.companyName || "—"}
                  </td>
                ) : null}
                <td className="px-4 py-4 align-middle text-slate-600">
                  {category.productCount}
                </td>
                <td className="px-4 py-4 align-middle">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      category.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.active ? "Ativa" : "Inativa"}
                  </span>
                </td>
                {(editHrefBase || onToggleAction || onDeleteAction) ? (
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-wrap items-center gap-2">
                      {editHrefBase ? (
                        <Link
                          href={`${editHrefBase}/${category.id}/edit`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                        >
                          Editar
                        </Link>
                      ) : null}
                      {onToggleAction ? (
                        <form action={onToggleAction}>
                          <input type="hidden" name="id" value={category.id} />
                          <input
                            type="hidden"
                            name="active"
                            value={String(category.active)}
                          />
                          <button
                            type="submit"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                          >
                            {category.active ? "Desativar" : "Ativar"}
                          </button>
                        </form>
                      ) : null}
                      {onDeleteAction ? (
                        <form action={onDeleteAction}>
                          <input type="hidden" name="id" value={category.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-400"
                          >
                            Excluir
                          </button>
                        </form>
                      ) : null}
                    </div>
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
