import { CategoryQuickForm } from "@/components/admin/category-quick-form";
import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { getCategorySummaries } from "@/features/catalog/dal";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  const categoryItems = await getCategorySummaries();

  if (!user) return null;

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
        description="Cada categoria fica preparada para ordenacao, ativacao e compartilhamento com o cardapio."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryItems.map((category) => (
            <article
              key={category.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-950">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {category.description}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {category.productCount} itens
                </span>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
