import { CategoryQuickForm } from "@/components/admin/category-quick-form";
import { CategoryTable } from "@/components/admin/category-table";
import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { getCategorySummaries } from "@/features/catalog/dal";
import { requireRoles } from "@/lib/auth";
import { reorderCategoriesAction } from "./actions";

export default async function AdminCategoriesPage() {
  const user = await requireRoles(["SUPERADMIN", "ADMIN"]);
  const categoryItems = await getCategorySummaries();

  return (
    <AppShell
      user={user}
      currentPath="/admin/categorias"
      title="Categorias"
      description="Agrupamento unico para evitar duplicacao de estrutura entre catalogo, menu e PDV."
    >
      <SectionCard
        title="Nova categoria"
        description="Cadastro simples para o primeiro marco funcional, sem depender de banco configurado."
      >
        <CategoryQuickForm />
      </SectionCard>

      <SectionCard
        title="Mapa de categorias"
        description="Arraste para mudar a ordem das categorias usadas no cardápio e nos produtos."
      >
        <CategoryTable
          categories={categoryItems}
          onOrderChange={reorderCategoriesAction}
        />
      </SectionCard>
    </AppShell>
  );
}
