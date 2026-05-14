import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/ui/back-link";
import { SectionCard } from "@/components/ui/section-card";
import { getUserById } from "@/features/superadmin/dal";
import { requireRoles } from "@/lib/auth";
import { EditUserForm } from "./form";

type Props = { params: Promise<{ id: string }> };

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;
  const [user, target] = await Promise.all([
    requireRoles(["SUPERADMIN"]),
    getUserById(id),
  ]);

  if (!target) notFound();

  return (
    <AppShell
      user={user}
      currentPath="/superadmin"
      title={`Editar: ${target.name}`}
      description="Altere nome, email e role do usuário."
    >
      <BackLink href="/superadmin/usuarios" />
      <SectionCard title="Dados do usuário">
        <EditUserForm user={target} />
      </SectionCard>
    </AppShell>
  );
}
