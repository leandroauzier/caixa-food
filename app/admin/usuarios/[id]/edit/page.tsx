import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/ui/back-link";
import { SectionCard } from "@/components/ui/section-card";
import { getAdminUserById } from "@/features/admin/dal";
import { requirePermission } from "@/lib/auth";
import { EditUserForm } from "./form";

type Props = { params: Promise<{ id: string }> };

export default async function EditAdminUserPage({ params }: Props) {
  const { id } = await params;
  const user = await requirePermission("manageUsers");
  const target = await getAdminUserById(user.companyId, id);

  if (!target) {
    notFound();
  }

  return (
    <AppShell
      user={user}
      currentPath="/admin/usuarios"
      title={`Editar: ${target.name}`}
      description="Atualize dados e role de usuários da sua empresa."
    >
      <BackLink href="/admin/usuarios" />
      <SectionCard title="Dados do usuário">
        <EditUserForm user={target} />
      </SectionCard>
    </AppShell>
  );
}
