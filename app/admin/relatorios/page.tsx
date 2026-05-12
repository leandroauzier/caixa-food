import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { getDashboardOverview } from "@/features/dashboard/dal";
import { getReportCards } from "@/features/reports/dal";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminReportsPage() {
  const user = await getCurrentUser();
  const [reportItems, overview] = await Promise.all([
    getReportCards(),
    getDashboardOverview(),
  ]);

  if (!user) return null;

  return (
    <AppShell
      user={user}
      currentPath="/admin/relatorios"
      title="Relatorios"
      description="Resumo diario alimentado pelo fluxo local de pedidos, pagamentos e baixa de estoque."
    >
      <SectionCard
        title="Indicadores de saida"
        description="Esses cards ja refletem o que foi registrado no fluxo local do sistema."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {reportItems.map((item) => (
            <article
              key={item.title}
              className="rounded-[18px] border border-slate-200 bg-white p-4"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                {item.title}
              </p>
              <p className="mt-2 font-heading text-2xl text-slate-950 sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Estoque em alerta"
        description="Os produtos abaixo ja refletem a baixa automatica feita depois do pagamento."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {overview.lowStock.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-500 sm:text-sm">
              Nenhum item em alerta no momento.
            </div>
          ) : null}
          {overview.lowStock.map((item) => (
            <article
              key={item.productName}
              className="rounded-[18px] border border-slate-200 bg-white p-4"
            >
              <p className="text-sm font-semibold text-slate-950">{item.productName}</p>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                Atual {item.currentStock} / minimo {item.minimumStock}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
