"use client";

import { useActionState } from "react";

import {
  createProductAction,
  type ProductFormState,
} from "@/app/admin/produtos/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import type { CategorySummary } from "@/types/domain";

const initialState: ProductFormState = {};

export function ProductQuickForm({
  categories,
}: {
  categories: CategorySummary[];
}) {
  const [state, formAction] = useActionState(createProductAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Nome
        <input
          name="name"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          placeholder="Ex.: Smash duplo trufado"
          required
        />
        {state.errors?.name ? (
          <span className="text-xs text-rose-700">{state.errors.name[0]}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Categoria
        <select
          name="categoryId"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-950"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Selecione
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {state.errors?.categoryId ? (
          <span className="text-xs text-rose-700">
            {state.errors.categoryId[0]}
          </span>
        ) : null}
      </label>

      <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
        Descrição
        <textarea
          name="description"
          rows={3}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          placeholder="Resumo rápido para PDV e cardápio."
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Preço
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          required
        />
        {state.errors?.price ? (
          <span className="text-xs text-rose-700">{state.errors.price[0]}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Estoque atual
        <input
          name="stockQuantity"
          type="number"
          min="0"
          step="1"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Estoque mínimo
        <input
          name="minStock"
          type="number"
          min="0"
          step="1"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          required
        />
      </label>

      <div className="md:col-span-2 flex flex-col gap-3">
        {state.message ? (
          <p
            aria-live="polite"
            className={`text-sm ${state.success ? "text-emerald-700" : "text-amber-700"}`}
          >
            {state.message}
          </p>
        ) : null}
        <div className="flex justify-end">
          <SubmitButton label="Salvar produto" />
        </div>
      </div>
    </form>
  );
}
