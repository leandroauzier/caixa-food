import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/ui/back-link";
import { SectionCard } from "@/components/ui/section-card";
import { getAllCompanies } from "@/features/superadmin/dal";
import { requireRoles } from "@/lib/auth";
import { deleteCompanyAction } from "./actions/delete-company";
import { toggleCompanyAction } from "./actions/toggle-company";
import { CreateCompanyForm } from "./_components/create-company-form";

export default async function EmpresasPage() {
  const user = await requireRoles(["SUPERADMIN"]);
  const companies = await getAllCompanies();

  return (
    <AppShell
      user={user}
      currentPath="/superadmin"
      title="Empresas"
      description="Crie e gerencie os tenants do sistema."
    >
      <BackLink href="/superadmin" />
      <SectionCard title="Nova empresa">
        <CreateCompanyForm />
      </SectionCard>

      <SectionCard
        title="Todas as empresas"
        description={`${companies.length} registro(s)`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Nome", "Slug", "Usuários", "Categorias", "Status", "Ações"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {c.name}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-500">
                    {c.slug}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{c.userCount}</td>
                  <td className="px-3 py-3 text-slate-600">
                    {c.categoryCount}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {c.active ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/superadmin/empresas/${c.id}/edit`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                      >
                        Editar
                      </Link>
                      <form action={toggleCompanyAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <input
                          type="hidden"
                          name="active"
                          value={String(c.active)}
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                        >
                          {c.active ? "Desativar" : "Ativar"}
                        </button>
                      </form>
                      <form action={deleteCompanyAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-400"
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-sm text-slate-400"
                  >
                    Nenhuma empresa cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}
