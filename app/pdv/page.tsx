import { AppShell } from "@/components/layout/app-shell";
import { PdvWorkbench } from "@/components/pdv/pdv-workbench";
import { OrderSummaryCard } from "@/components/pdv/order-summary";
import { PaymentOrderForm } from "@/components/pdv/payment-order-form";
import { SectionCard } from "@/components/ui/section-card";
import { getPdvContext } from "@/features/orders/dal";
import { requireRoles } from "@/lib/auth";

export default async function PdvPage() {
  const user = await requireRoles(["SUPERADMIN", "ADMIN", "CAIXA", "ATENDENTE"]);
  const context = await getPdvContext();

  return (
    <AppShell
      user={user}
      currentPath="/pdv"
      title="PDV e caixa"
      description="Catalogo visual, montagem de pedido por carrinho, extras por produto e fechamento mais direto para o operador."
    >
      <div className="space-y-4 pb-24 xl:pb-0">
        <PdvWorkbench
          categories={context.catalogCategories}
          products={context.catalog}
        />

        <div className="grid gap-4 2xl:grid-cols-[340px_minmax(0,1fr)]">
          <OrderSummaryCard order={context.openOrders[0]} />

          <SectionCard
            title="Fila do caixa"
            description="Visao clara dos pedidos que ainda estao rodando no sistema."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
              {context.openOrders.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-500 sm:text-sm">
                  Nenhum pedido aberto no momento.
                </div>
              ) : null}
              {context.openOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-[18px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Pedido #{order.code}</p>
                      <p className="text-xs text-slate-600 sm:text-sm">{order.customerName}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:text-xs">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 sm:text-sm">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order.id}-item-${index}`}
                        className="flex items-center justify-between gap-3 rounded-[14px] bg-white/80 px-3 py-2"
                      >
                        <p className="min-w-0 truncate">
                          {item.quantity}x {item.productName}
                        </p>
                        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {item.selectedOptions.length} extra(s)
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Pagamentos prontos para fechar"
          description="Pedidos que ja passaram pela cozinha e podem virar venda agora."
        >
          <div className="grid gap-4">
            {context.readyForCheckout.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-500 sm:text-sm">
                Nenhum pedido pronto aguardando pagamento.
              </div>
            ) : null}
            {context.readyForCheckout.map((order) => (
              <PaymentOrderForm key={order.id} order={order} />
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
