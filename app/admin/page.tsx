import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRoles } from "@/lib/auth";
import { getDashboardOverview } from "@/features/dashboard/dal";

const adminActions = [
  {
    href: "/admin/categorias",
    title: "Categorias",
    description: "Criar e organizar o cardápio da sua empresa.",
    cta: "Gerenciar categorias",
  },
  {
    href: "/admin/produtos",
    title: "Produtos",
    description: "Cadastrar itens, preços, estoque e vínculo com categoria.",
    cta: "Gerenciar produtos",
  },
  {
    href: "/admin/usuarios",
    title: "Usuários",
    description: "Criar e manter contas operacionais da sua equipe.",
    cta: "Gerenciar usuários",
  },
  {
    href: "/admin/estoque",
    title: "Estoque",
    description: "Acompanhar itens críticos e reposição recomendada.",
    cta: "Abrir estoque",
  },
  {
    href: "/admin/relatorios",
    title: "Relatórios",
    description: "Analisar vendas, formas de pagamento e tendências do dia.",
    cta: "Ver relatórios",
  },
  {
    href: "/admin/configuracoes",
    title: "Configurações",
    description: "Ajustar empresa, fiscal e fluxo de pagamentos.",
    cta: "Abrir configurações",
  },
];

export default async function AdminPage() {
  const user = await requireRoles(["SUPERADMIN", "ADMIN"]);
  const overview = await getDashboardOverview();

  return (
    <AppShell
      user={user}
      currentPath="/admin"
      title="Painel administrativo"
      description="Resumo da operação, atalhos de gestão e áreas críticas que você pode agir agora na sua empresa."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      <SectionCard
        title="Ações rápidas"
        description="Esses atalhos levam direto para o que o admin pode fazer no dia a dia."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-[24px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                {action.title}
              </p>
              <h3 className="mt-3 font-heading text-2xl text-slate-950">
                {action.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {action.description}
              </p>
              <p className="mt-6 text-sm font-semibold text-slate-950">
                {action.cta}
              </p>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Riscos imediatos"
        description="Itens mais sensíveis para caixa, cozinha e estoque neste momento."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {overview.lowStock.map((item) => (
            <div
              key={item.productName}
              className="rounded-[24px] border border-amber-200 bg-amber-50 p-5"
            >
              <p className="font-semibold text-slate-950">{item.productName}</p>
              <p className="mt-2 text-sm text-slate-700">
                Atual: {item.currentStock} • mínimo: {item.minimumStock}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
