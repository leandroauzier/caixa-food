import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRoles } from "@/lib/auth";
import { getDashboardOverview } from "@/features/dashboard/dal";

export default async function AdminPage() {
  const user = await requireRoles(["SUPERADMIN", "ADMIN"]);
  const overview = await getDashboardOverview();

  return (
    <AppShell
      user={user}
      currentPath="/admin"
      title="Painel administrativo"
      description="Resumo da operação, alertas do dia e áreas críticas que concentram o fluxo do MVP."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

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

