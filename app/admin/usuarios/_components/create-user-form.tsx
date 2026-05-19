"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

import {
  createUserAction,
  type CreateUserState,
} from "../actions/create-user";

const initial: CreateUserState = {};

const input =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

export function CreateUserForm() {
  const [state, action] = useActionState(createUserAction, initial);

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Role">
          <select name="role" required className={input}>
            {(["CAIXA", "COZINHA", "ATENDENTE"] as const).map((role) => (
              <option key={role} value={role}>
                {role}
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
        <Field label="Senha inicial">
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
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function Btn({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex h-10 items-center rounded-full bg-slate-950 px-5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
    >
      {children}
    </button>
  );
}
