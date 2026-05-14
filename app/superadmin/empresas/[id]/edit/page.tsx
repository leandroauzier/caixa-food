import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/ui/back-link";
import { SectionCard } from "@/components/ui/section-card";
import { getCompanyById } from "@/features/superadmin/dal";
import { requireRoles } from "@/lib/auth";
import { EditCompanyForm } from "./form";

type Props = { params: Promise<{ id: string }> };

export default async function EditCompanyPage({ params }: Props) {
  const { id } = await params;
  const [user, company] = await Promise.all([
    requireRoles(["SUPERADMIN"]),
    getCompanyById(id),
  ]);

  if (!company) notFound();

  return (
    <AppShell
      user={user}
      currentPath="/superadmin"
      title={`Editar: ${company.name}`}
      description="Altere nome e slug da empresa."
    >
      <BackLink href="/superadmin/empresas" />
      <SectionCard title="Dados da empresa">
        <EditCompanyForm id={company.id} name={company.name} slug={company.slug} />
      </SectionCard>
    </AppShell>
  );
}
