import { ProductTable } from "@/components/admin/product-table";
import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { getProductSummaries } from "@/features/catalog/dal";
import { getDashboardOverview } from "@/features/dashboard/dal";
import { requireRoles } from "@/lib/auth";

export default async function AdminStockPage() {
  const user = await requireRoles(["SUPERADMIN", "ADMIN"]);
  const [overview, products] = await Promise.all([
    getDashboardOverview(),
    getProductSummaries(),
  ]);

  return (
    <AppShell
      user={user}
      currentPath="/admin/estoque"
      title="Estoque"
      description="Controle basico por produto, com baixa automatica acontecendo depois do pagamento aprovado."
    >
      <SectionCard
        title="Itens com atencao"
        description="Esses produtos ja alcancaram ou encostaram no estoque minimo."
      >
        <div className="space-y-3">
          {overview.lowStock.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
              Nenhum item em alerta no momento.
            </div>
          ) : null}
          {overview.lowStock.map((item) => (
            <div
              key={item.productName}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-semibold text-slate-950">{item.productName}</p>
                <p className="text-sm text-slate-600">
                  Atual {item.currentStock} / minimo {item.minimumStock}
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                Reposicao recomendada
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Saldo atual do catalogo"
        description="Use essa visao para acompanhar a baixa apos cada venda concluida."
      >
        <ProductTable products={products} />
      </SectionCard>
    </AppShell>
  );
}
