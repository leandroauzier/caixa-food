"use client";

import { useActionState, useState } from "react";

import { slugify } from "@/lib/slugify";
import {
  updateCompanyAction,
  type UpdateCompanyState,
} from "../../actions/update-company";

const initial: UpdateCompanyState = {};

const input =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

type Props = { id: string; name: string; slug: string };

export function EditCompanyForm({ id, name, slug: initialSlug }: Props) {
  const [state, action] = useActionState(updateCompanyAction, initial);
  const [slug, setSlug] = useState(initialSlug);

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(slugify(e.target.value));
  }

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
            Slug
          </label>
          <input
            name="slug"
            required
            minLength={2}
            value={slug}
            onChange={handleSlugChange}
            className={input}
          />
          <p className="mt-1 text-xs text-slate-400">
            Somente letras minúsculas, números e hífens.
          </p>
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
