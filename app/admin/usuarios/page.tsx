import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/ui/back-link";
import { SectionCard } from "@/components/ui/section-card";
import { getAdminUsers } from "@/features/admin/dal";
import { requirePermission } from "@/lib/auth";
import { CreateUserForm } from "./_components/create-user-form";
import { deleteUserAction } from "./actions/delete-user";
import { toggleUserAction } from "./actions/toggle-user";

const roleBadge: Record<string, string> = {
  CAIXA: "bg-emerald-100 text-emerald-700",
  COZINHA: "bg-orange-100 text-orange-700",
  ATENDENTE: "bg-sky-100 text-sky-700",
};

export default async function AdminUsersPage() {
  const user = await requirePermission("manageUsers");
  const users = await getAdminUsers(user.companyId);

  return (
    <AppShell
      user={user}
      currentPath="/admin/usuarios"
      title="Usuários da empresa"
      description="Gerencie contas operacionais da sua própria empresa, sem acesso aos níveis globais."
    >
      <BackLink href="/admin" />

      <SectionCard
        title="Novo usuário"
        description="Crie usuários abaixo da hierarquia admin para a operação do dia a dia."
      >
        <CreateUserForm />
      </SectionCard>

      <SectionCard
        title="Usuários ativos"
        description={`${users.length} registro(s) desta empresa`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Nome", "Email", "Role", "Status", "Ações"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{item.email}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadge[item.role] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {item.role}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {item.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/usuarios/${item.id}/edit`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                      >
                        Editar
                      </Link>
                      <form action={toggleUserAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="active"
                          value={String(item.active)}
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                        >
                          {item.active ? "Desativar" : "Ativar"}
                        </button>
                      </form>
                      <form action={deleteUserAction}>
                        <input type="hidden" name="id" value={item.id} />
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
                    colSpan={5}
                    className="px-3 py-8 text-center text-sm text-slate-400"
                  >
                    Nenhum usuário operacional cadastrado.
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
