import { advanceKitchenOrderAction } from "@/app/cozinha/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/money";
import type { OrderSummary } from "@/types/domain";

export function KitchenColumn({
  title,
  orders,
}: {
  title: string;
  orders: OrderSummary[];
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-heading text-xl text-slate-950">{title}</h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:text-xs">
          {orders.length} pedidos
        </span>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 sm:text-sm">
            Nenhum pedido nesta coluna.
          </div>
        ) : null}

        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-[18px] border border-slate-100 bg-slate-50 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Pedido #{order.code}</p>
                <p className="text-xs text-slate-600 sm:text-sm">{order.customerName}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700 sm:text-sm">
              {order.items.map((item, index) => (
                <li key={`${order.id}-item-${index}`}>
                  {item.quantity}x {item.productName}
                  {item.notes ? ` / ${item.notes}` : ""}
                </li>
              ))}
            </ul>
            {order.notes ? (
              <p className="mt-2 text-xs text-slate-500 sm:text-sm">{order.notes}</p>
            ) : null}
            {order.status !== "PRONTO" ? (
              <form
                action={advanceKitchenOrderAction.bind(null, order.id)}
                className="mt-3"
              >
                <button
                  type="submit"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-3.5 text-xs font-semibold text-white transition hover:bg-slate-800 sm:text-sm"
                >
                  {order.status === "NOVO"
                    ? "Iniciar preparo"
                    : "Marcar como pronto"}
                </button>
              </form>
            ) : null}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 sm:text-sm">
              <span>{order.createdAt}</span>
              <span className="font-semibold text-slate-950">
                {formatMoney(order.total)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
