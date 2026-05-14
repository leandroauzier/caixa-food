"use client";

import { useActionState } from "react";

import {
  updateCategoryAction,
  type UpdateCategoryState,
} from "../../actions/update-category";

const initial: UpdateCategoryState = {};

const input =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

type Props = { id: string; name: string; description: string };

export function EditCategoryForm({ id, name, description }: Props) {
  const [state, action] = useActionState(updateCategoryAction, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Nome
          </label>
          <input
            name="name"
            required
            minLength={2}
            defaultValue={name}
            className={input}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Descrição
          </label>
          <input
            name="description"
            maxLength={120}
            defaultValue={description}
            className={input}
          />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex h-10 items-center rounded-full bg-slate-950 px-5 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Salvar alterações
      </button>
    </form>
  );
}
