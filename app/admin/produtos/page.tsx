import { ProductQuickForm } from "@/components/admin/product-quick-form";
import { ProductTable } from "@/components/admin/product-table";
import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { getCategorySummaries, getProductSummaries } from "@/features/catalog/dal";
import { requireRoles } from "@/lib/auth";

export default async function AdminProductsPage() {
  const user = await requireRoles(["SUPERADMIN", "ADMIN"]);
  const [categoryItems, productItems] = await Promise.all([
    getCategorySummaries(),
    getProductSummaries(),
  ]);

  return (
    <AppShell
      user={user}
      currentPath="/admin/produtos"
      title="Produtos"
      description="Tela pensada para reaproveitar os mesmos contratos entre admin, PDV e cardápio."
    >
      <SectionCard
        title="Cadastro rápido"
        description="Ação server-side validada com Zod e preparada para persistência via Prisma."
      >
        <ProductQuickForm categories={categoryItems} />
      </SectionCard>

      <SectionCard
        title="Catálogo ativo"
        description="Lista base para admin, cozinha e frente de caixa."
      >
        <ProductTable products={productItems} />
      </SectionCard>
    </AppShell>
  );
}

