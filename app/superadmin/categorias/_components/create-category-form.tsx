"use client";

import { useActionState } from "react";

import {
  createCategoryAction,
  type CreateCategoryState,
} from "../actions/create-category";

type Company = { id: string; name: string };

const initial: CreateCategoryState = {};

const input =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

export function CreateCategoryForm({ companies }: { companies: Company[] }) {
  const [state, action] = useActionState(createCategoryAction, initial);

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Empresa
          </label>
          <select name="companyId" required className={input}>
            <option value="">Selecionar...</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Nome
          </label>
          <input name="name" required minLength={2} className={input} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Descrição (opcional)
          </label>
          <input name="description" maxLength={120} className={input} />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex h-10 items-center rounded-full bg-slate-950 px-5 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Criar categoria
      </button>
    </form>
  );
}
