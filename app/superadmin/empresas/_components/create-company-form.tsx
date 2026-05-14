"use client";

import { useActionState, useRef, useState } from "react";

import { slugify } from "@/lib/slugify";
import {
  createCompanyAction,
  type CreateCompanyState,
} from "../actions/create-company";

const initial: CreateCompanyState = {};

const input =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

export function CreateCompanyForm() {
  const [state, action] = useActionState(createCompanyAction, initial);
  const [slug, setSlug] = useState("");
  const slugTouched = useRef(false);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched.current) {
      setSlug(slugify(e.target.value));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    slugTouched.current = true;
    setSlug(slugify(e.target.value));
  }

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
            Nome
          </label>
          <input
            name="name"
            required
            minLength={2}
            className={input}
            onChange={handleNameChange}
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
            placeholder="gerado-automaticamente"
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
        Criar empresa
      </button>
    </form>
  );
}
