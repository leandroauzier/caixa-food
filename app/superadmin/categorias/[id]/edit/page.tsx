import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/ui/back-link";
import { SectionCard } from "@/components/ui/section-card";
import { getCategoryById } from "@/features/superadmin/dal";
import { requireRoles } from "@/lib/auth";
import { EditCategoryForm } from "./form";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const [user, category] = await Promise.all([
    requireRoles(["SUPERADMIN"]),
    getCategoryById(id),
  ]);

  if (!category) notFound();

  return (
    <AppShell
      user={user}
      currentPath="/superadmin"
      title={`Editar: ${category.name}`}
      description="Altere nome e descrição da categoria."
    >
      <BackLink href="/superadmin/categorias" />
      <SectionCard title="Dados da categoria">
        <EditCategoryForm
          id={category.id}
          name={category.name}
          description={category.description ?? ""}
        />
      </SectionCard>
    </AppShell>
  );
}
