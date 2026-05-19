import Link from "next/link";
import {
  BadgeCheck,
  ClipboardList,
  CreditCard,
  LockKeyhole,
  Utensils,
} from "lucide-react";

import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { dashboardMetrics } from "@/features/core/dashboard-metrics";
import { getCurrentUser } from "@/lib/auth";

const operationBenefits = [
  {
    icon: ClipboardList,
    title: "Pedidos organizados",
    description: "Acompanhe cada pedido desde o atendimento até a cozinha.",
  },
  {
    icon: CreditCard,
    title: "Controle de caixa",
    description: "Registre vendas, pagamentos e movimentações do dia.",
  },
  {
    icon: Utensils,
    title: "Cardápio centralizado",
    description: "Mantenha produtos, preços e disponibilidade sempre atualizados.",
  },
  {
    icon: LockKeyhole,
    title: "Acesso por função",
    description: "Cada colaborador acessa apenas as áreas liberadas para seu perfil.",
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(248,250,252,1),_rgba(226,232,240,0.95),_rgba(186,230,253,0.45))] px-4 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-[36px] border border-white/70 bg-slate-950 px-8 py-10 text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">
            <BadgeCheck className="h-4 w-4" />
            Sistema de gestão para alimentação
          </div>

          <h1 className="mt-5 max-w-4xl font-heading text-5xl leading-tight">
            CAIXA FOOD
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200">
            Controle pedidos, caixa, cozinha, cardápio e usuários em um único
            sistema. Cada colaborador acessa apenas as áreas necessárias para a
            sua função.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link
                href={user.role === "SUPERADMIN" ? "/superadmin" : "/admin"}
                className="rounded-full bg-sky-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-950/20 transition hover:bg-sky-300"
              >
                Abrir painel
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-sky-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-950/20 transition hover:bg-sky-300"
              >
                Entrar no sistema
              </Link>
            )}
          </div>
        </header>

        {/* <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div> */}

        <SectionCard
          title="Como o sistema ajuda sua operação"
          description="Recursos pensados para reduzir erros, organizar a equipe e melhorar o controle diário da loja."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {operationBenefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-bold text-slate-950">
                    {item.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}