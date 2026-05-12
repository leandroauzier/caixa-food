"use client";

import { useActionState } from "react";

import {
  createCategoryAction,
  type CategoryFormState,
} from "@/app/admin/categorias/actions";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState: CategoryFormState = {};

export function CategoryQuickForm() {
  const [state, formAction] = useActionState(createCategoryAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Nome
        <input
          name="name"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          placeholder="Ex.: Sobremesas"
          required
        />
        {state.errors?.name ? (
          <span className="text-xs text-rose-700">{state.errors.name[0]}</span>
        ) : null}
      </label>

      <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
        Descricao
        <textarea
          name="description"
          rows={3}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
          placeholder="Como essa categoria aparece no cardapio e no admin."
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
          <SubmitButton label="Salvar categoria" />
        </div>
      </div>
    </form>
  );
}

