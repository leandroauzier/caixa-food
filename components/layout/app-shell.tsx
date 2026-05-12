import Link from "next/link";
import type { ReactNode } from "react";

import { appModules } from "@/features/core/demo-data";
import type { SessionUser } from "@/types/domain";

type AppShellProps = {
  user: SessionUser;
  currentPath: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AppShell({
  user,
  currentPath,
  title,
  description,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(248,250,252,0.95),_rgba(224,231,255,0.75),_rgba(254,249,195,0.6))]">
      <div className="mx-auto grid min-h-screen max-w-[1480px] gap-3 px-2 py-2 lg:gap-4 lg:px-3 lg:py-3 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.98))] px-4 py-4 text-slate-50 shadow-2xl lg:sticky lg:top-3 lg:h-[calc(100vh-1.5rem)] lg:overflow-auto">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
              Caixa Food
            </p>
            <h1 className="mt-2 font-heading text-2xl">Ops Console</h1>
            <p className="mt-2 text-xs leading-5 text-slate-300 sm:text-sm">
              Multiempresa, permissoes por role e modulos separados por fluxo.
            </p>
          </div>

          <div className="mb-4 rounded-[20px] border border-white/10 bg-white/5 p-3 lg:mb-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Sessao atual
            </p>
            <div className="mt-2 flex items-center justify-between gap-3 lg:block">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-slate-300 sm:text-sm">
                  {user.companyName}
                </p>
              </div>
              <p className="inline-flex rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] tracking-[0.18em] text-emerald-200 lg:mt-2">
                {user.role}
              </p>
            </div>
          </div>

          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:grid lg:grid-cols-1 lg:overflow-visible lg:px-0 lg:pb-0">
            {appModules.map((module) => {
              const active = currentPath.startsWith(module.href);

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className={`block min-w-[150px] rounded-[16px] px-3 py-2.5 transition lg:min-w-0 ${
                    active
                      ? "bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-950 shadow-[0_12px_30px_rgba(16,185,129,0.22)]"
                      : "bg-transparent text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <p className="text-sm font-semibold">{module.title}</p>
                  <p className="mt-1 text-xs leading-5 opacity-80 sm:text-sm">
                    {module.description}
                  </p>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 space-y-4 py-1">
          <header className="rounded-[26px] border border-white/70 bg-white/75 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
              Arquitetura orientada a modulos
            </p>
            <h2 className="mt-2 font-heading text-2xl text-slate-950 sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-600 sm:text-sm">
              {description}
            </p>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
