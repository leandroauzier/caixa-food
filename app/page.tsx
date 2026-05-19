import Link from "next/link";

import { ModuleCard } from "@/components/dashboard/module-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { getVisibleAppModules } from "@/features/core/app-modules";
import { dashboardMetrics } from "@/features/core/dashboard-metrics";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  const visibleModules = getVisibleAppModules(user?.role);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(226,232,240,0.92),_rgba(254,240,138,0.55))] px-4 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-[36px] border border-white/70 bg-slate-950 px-8 py-10 text-white shadow-2xl">
          <p className="text-xs uppercase tracking-[0.36em] text-slate-400">
            MVP para operação de loja de comida
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-5xl leading-tight">
            Base fullstack preparada para Admin, PDV, Cozinha e Cardápio.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
            A estrutura já nasce separando UI, DAL server-only, permissões por
            role, multiempresa por `companyId` e schema Prisma para evoluir sem
            retrabalho.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Abrir painel admin
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
            >
              Ver fluxo de autenticação
            </Link>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>

        <SectionCard
          title="Módulos do sistema"
          description={
            user
              ? "Cada área tem responsabilidade própria e os blocos aparecem conforme a sua role."
              : "Entre para ver os módulos liberados para a sua conta."
          }
        >
          {visibleModules.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
              {visibleModules.map((module) => (
                <ModuleCard key={module.href} module={module} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-950">
                Entre com uma conta autorizada para liberar os módulos.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A home continua aberta, mas os acessos ficam condicionados ao
                `userRole` real vindo da sessão.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Ir para login
              </Link>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Decisões de segurança"
          description="A base já foi pensada para reduzir os problemas mais comuns antes de chegar em produção."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "DAL server-only para evitar acesso direto do cliente ao banco.",
              "Permissões por role verificadas no servidor, não apenas na UI.",
              "Validação com Zod em formulários e Server Actions.",
              "Schema multiempresa para filtrar tudo por companyId.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
