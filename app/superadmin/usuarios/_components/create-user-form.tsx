"use client";

import { useActionState } from "react";

import {
  createUserAction,
  type CreateUserState,
} from "../actions/create-user";

type Company = { id: string; name: string };

const initial: CreateUserState = {};

export function CreateUserForm({ companies }: { companies: Company[] }) {
  const [state, action] = useActionState(createUserAction, initial);

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Empresa">
          <select name="companyId" required className={input}>
            <option value="">Selecionar...</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Role">
          <select name="role" required className={input}>
            {(["ADMIN", "CAIXA", "COZINHA", "ATENDENTE"] as const).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nome">
          <input name="name" required minLength={2} className={input} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required className={input} />
        </Field>
        <Field label="Senha inicial" className="sm:col-span-2">
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className={input}
          />
        </Field>
      </div>
      <Btn>Criar usuário</Btn>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function Btn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex h-10 items-center rounded-full bg-slate-950 px-5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
    >
      {children}
    </button>
  );
}

const input =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200";
