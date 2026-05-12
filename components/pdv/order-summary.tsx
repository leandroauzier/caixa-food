import { ProductImage } from "@/components/ui/product-image";
import { formatMoney } from "@/lib/money";
import type { OrderSummary } from "@/types/domain";

export function OrderSummaryCard({ order }: { order?: OrderSummary | null }) {
  if (!order) {
    return (
      <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] p-4 text-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Pedido atual
        </p>
        <h3 className="mt-3 font-heading text-xl">Nenhum pedido em fluxo</h3>
        <p className="mt-2 text-xs leading-6 text-slate-300 sm:text-sm">
          Quando voce comecar a montar pedidos, eles aparecem aqui com status, itens e total.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] p-4 text-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Último Pedido
          </p>
          <h3 className="mt-2 font-heading text-xl">#{order.code}</h3>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">{order.customerName}</p>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-emerald-200 sm:text-xs">
          {order.type}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {order.items.map((item, index) => (
          <div
            key={`${order.id}-item-${index}`}
            className="grid grid-cols-[52px_minmax(0,1fr)] gap-2.5 rounded-[16px] border border-white/10 bg-white/5 p-2.5 sm:grid-cols-[60px_minmax(0,1fr)]"
          >
            <ProductImage
              src={item.imageUrl}
              alt={item.productName}
              className="h-12 rounded-[16px] bg-white/90 sm:h-14"
              fit="contain"
            />
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 text-sm font-medium leading-5">
                  {item.quantity}x {item.productName}
                </p>
                <p className="shrink-0 text-sm font-semibold">
                  {formatMoney(item.subtotal)}
                </p>
              </div>
              {item.selectedOptions.length > 0 ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {item.selectedOptions.map((option) => (
                    <span
                      key={`${item.productName}-${option.optionId}`}
                      className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-300"
                    >
                      {option.kind === "PORTION" ? "Porcao" : "Extra"} {option.name}
                    </span>
                  ))}
                </div>
              ) : null}
              {item.notes ? (
                <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">{item.notes}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-xs text-slate-300 sm:text-sm">Status</p>
          <p className="text-sm font-semibold text-white">{order.status}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-300 sm:text-sm">Total</p>
          <p className="font-heading text-2xl">{formatMoney(order.total)}</p>
        </div>
      </div>
    </div>
  );
}
