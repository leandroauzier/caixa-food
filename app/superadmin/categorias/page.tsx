import { CategoryTable } from "@/components/admin/category-table";
import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/ui/back-link";
import { SectionCard } from "@/components/ui/section-card";
import {
  getAllCategoriesGlobal,
  getAllCompanies,
} from "@/features/superadmin/dal";
import { requireRoles } from "@/lib/auth";
import { deleteCategoryAction } from "./actions/delete-category";
import { reorderCategoryAction } from "./actions/reorder-category";
import { toggleCategoryAction } from "./actions/toggle-category";
import { CreateCategoryForm } from "./_components/create-category-form";

export default async function CategoriasPage() {
  const user = await requireRoles(["SUPERADMIN"]);
  const [categories, companies] = await Promise.all([
    getAllCategoriesGlobal(),
    getAllCompanies(),
  ]);

  const companiesForForm = companies.map((c) => ({ id: c.id, name: c.name }));

  return (
    <AppShell
      user={user}
      currentPath="/superadmin"
      title="Categorias"
      description="Todas as categorias de cardápio de todas as empresas."
    >
      <BackLink href="/superadmin" />
      <SectionCard title="Nova categoria">
        <CreateCategoryForm companies={companiesForForm} />
      </SectionCard>

      <SectionCard
        title="Todas as categorias"
        description={`${categories.length} registro(s)`}
      >
        <CategoryTable
          categories={categories}
          showCompany
          editHrefBase="/superadmin/categorias"
          onOrderChange={reorderCategoryAction}
          onToggleAction={toggleCategoryAction}
          onDeleteAction={deleteCategoryAction}
        />
      </SectionCard>
    </AppShell>
  );
}
