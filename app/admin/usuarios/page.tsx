import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { requireRoles } from "@/lib/auth";

export default async function AdminUsersPage() {
  const user = await requireRoles(["SUPERADMIN", "ADMIN"]);

  const roles = [
    {
      role: "ADMIN",
      summary: "Gerencia catálogo, estoque, usuários, relatórios e configurações.",
    },
    {
      role: "CAIXA",
      summary: "Opera pedidos, pagamentos, fechamento e emissão futura.",
    },
    {
      role: "COZINHA",
      summary: "Recebe pedidos, aceita, prepara e marca como pronto.",
    },
    {
      role: "ATENDENTE",
      summary: "Cria pedidos e acompanha status para mesa, balcão e retirada.",
    },
  ];

  return (
    <AppShell
      user={user}
      currentPath="/admin/usuarios"
      title="Usuários e roles"
      description="A modelagem prioriza autorização explícita por perfil e por ação, reduzindo brechas de acesso indevido."
    >
      <SectionCard
        title="Perfis previstos"
        description="Cada tela do sistema já considera essas capacidades para renderização e mutação."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((item) => (
            <article
              key={item.role}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Role
              </p>
              <h3 className="mt-3 font-heading text-2xl text-slate-950">
                {item.role}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.summary}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}

