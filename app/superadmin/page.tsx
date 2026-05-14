import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { getSuperadminStats } from "@/features/superadmin/dal";
import { requireRoles } from "@/lib/auth";

const roleColors: Record<string, string> = {
  ADMIN: "bg-violet-400",
  CAIXA: "bg-emerald-400",
  COZINHA: "bg-orange-400",
  ATENDENTE: "bg-sky-400",
};

export default async function SuperadminPage() {
  const user = await requireRoles(["SUPERADMIN"]);
  const stats = await getSuperadminStats();

  return (
    <AppShell
      user={user}
      currentPath="/superadmin"
      title="Superadmin"
      description="Controle global de empresas, usuários e dados do sistema."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Empresas"
          value={String(stats.totalCompanies)}
          hint="cadastradas"
        />
        <StatCard
          label="Usuários"
          value={String(stats.totalUsers)}
          hint={`${stats.activeUsers} ativos`}
        />
        <StatCard
          label="Categorias"
          value={String(stats.totalCategories)}
          hint="total"
        />
        <StatCard
          label="Produtos"
          value={String(stats.totalProducts)}
          hint="total"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Usuários por role">
          <div className="space-y-3">
            {Object.entries(stats.usersByRole).map(([role, count]) => {
              const pct =
                stats.totalUsers > 0
                  ? Math.round((count / stats.totalUsers) * 100)
                  : 0;
              return (
                <div key={role} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs font-semibold text-slate-600">
                    {role}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full transition-all ${roleColors[role] ?? "bg-slate-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs text-slate-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Módulos de gestão">
          <div className="space-y-2">
            {[
              {
                href: "/superadmin/usuarios",
                label: "Usuários",
                description: "Contas, roles e senhas",
                count: stats.totalUsers,
              },
              {
                href: "/superadmin/empresas",
                label: "Empresas",
                description: "Tenants e configurações",
                count: stats.totalCompanies,
              },
              {
                href: "/superadmin/categorias",
                label: "Categorias",
                description: "Cardápios de todas as empresas",
                count: stats.totalCategories,
              },
            ].map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {m.label}
                  </p>
                  <p className="text-xs text-slate-500">{m.description}</p>
                </div>
                <span className="ml-4 text-sm font-semibold text-slate-400">
                  {m.count}
                </span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
