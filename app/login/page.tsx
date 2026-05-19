"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.96),_rgba(226,232,240,0.88),_rgba(191,219,254,0.62))] px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Caixa Food
          </p>
          <h1 className="mt-2 font-heading text-3xl text-slate-950">
            Entrar
          </h1>
        </div>

        <form
          action={action}
          className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur space-y-4"
        >
          {state.error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {state.error}
            </p>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="Sua Senha"
            />
          </div>

          <LoginButton />
        </form>
      </div>
    </div>
  );
}

function LoginButton() {
  return (
    <button
      type="submit"
      className="w-full rounded-full bg-slate-950 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      Entrar
    </button>
  );
}
