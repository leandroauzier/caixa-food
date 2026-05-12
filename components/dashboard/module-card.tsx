import Link from "next/link";

import type { AppModule } from "@/types/domain";

export function ModuleCard({ module }: { module: AppModule }) {
  return (
    <Link
      href={module.href}
      className="group overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
    >
      <div className={`h-2 bg-gradient-to-r ${module.accent}`} />
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
          Módulo
        </p>
        <h3 className="mt-3 font-heading text-2xl text-slate-950">
          {module.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {module.description}
        </p>
        <p className="mt-6 text-sm font-semibold text-slate-950">
          Abrir fluxo
        </p>
      </div>
    </Link>
  );
}

