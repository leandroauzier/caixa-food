import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/ui/back-link";
import { SectionCard } from "@/components/ui/section-card";
import { getAllCompanies, getAllUsers } from "@/features/superadmin/dal";
import { requireRoles } from "@/lib/auth";
import { toggleUserAction } from "./actions/toggle-user";
import { deleteUserAction } from "./actions/delete-user";
import { CreateUserForm } from "./_components/create-user-form";

const roleBadge: Record<string, string> = {
  ADMIN: "bg-violet-100 text-violet-700",
  CAIXA: "bg-emerald-100 text-emerald-700",
  COZINHA: "bg-orange-100 text-orange-700",
  ATENDENTE: "bg-sky-100 text-sky-700",
};

export default async function UsuariosPage() {
  const user = await requireRoles(["SUPERADMIN"]);
  const [users, companies] = await Promise.all([getAllUsers(), getAllCompanies()]);

  const companiesForForm = companies.map((c) => ({ id: c.id, name: c.name }));

  return (
    <AppShell
      user={user}
      currentPath="/superadmin"
      title="Usuários"
      description="Gerencie contas, roles e acesso de todos os usuários."
    >
      <BackLink href="/superadmin" />
      <SectionCard title="Novo usuário">
        <CreateUserForm companies={companiesForForm} />
      </SectionCard>

      <SectionCard
        title="Todos os usuários"
        description={`${users.length} registro(s)`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Nome", "Email", "Role", "Empresa", "Status", "Ações"].map(
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
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {u.name}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{u.email}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadge[u.role] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{u.companyName}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {u.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/superadmin/usuarios/${u.id}/edit`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                      >
                        Editar
                      </Link>
                      <form action={toggleUserAction}>
                        <input type="hidden" name="id" value={u.id} />
                        <input
                          type="hidden"
                          name="active"
                          value={String(u.active)}
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                        >
                          {u.active ? "Desativar" : "Ativar"}
                        </button>
                      </form>
                      <form action={deleteUserAction}>
                        <input type="hidden" name="id" value={u.id} />
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
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-sm text-slate-400"
                  >
                    Nenhum usuário cadastrado.
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
