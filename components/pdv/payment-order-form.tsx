"use client";

import { useActionState } from "react";

import { registerPaymentAction, type PaymentFormState } from "@/app/pdv/actions";
import { ProductImage } from "@/components/ui/product-image";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatMoney } from "@/lib/money";
import type { OrderSummary } from "@/types/domain";

const initialState: PaymentFormState = {};

export function PaymentOrderForm({ order }: { order: OrderSummary }) {
  const [state, formAction] = useActionState(registerPaymentAction, initialState);

  return (
    <form
      action={formAction}
      className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
    >
      <input type="hidden" name="orderId" value={order.id} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Pedido pronto
          </p>
          <p className="mt-1 font-semibold text-slate-950">#{order.code}</p>
          <p className="text-xs text-slate-600 sm:text-sm">{order.customerName}</p>
        </div>
        <p className="font-heading text-2xl text-slate-950">
          {formatMoney(order.total)}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {order.items.map((item, index) => (
          <div
            key={`${order.id}-item-${index}`}
            className="grid grid-cols-[48px_minmax(0,1fr)] gap-2 rounded-[16px] border border-slate-100 bg-slate-50 p-2.5 sm:grid-cols-[56px_minmax(0,1fr)]"
          >
            <ProductImage
              src={item.imageUrl}
              alt={item.productName}
              className="h-11 rounded-[14px] bg-white sm:h-12"
              fit="contain"
            />
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 text-sm font-medium leading-5 text-slate-900">
                  {item.quantity}x {item.productName}
                </p>
                <p className="shrink-0 text-sm font-semibold text-slate-900">
                  {formatMoney(item.subtotal)}
                </p>
              </div>
              {item.selectedOptions.length > 0 ? (
                <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                  {item.selectedOptions
                    .map((option) => `${option.kind === "PORTION" ? "Porcao" : "Extra"} ${option.name}`)
                    .join(" / ")}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700 sm:text-sm">
          Metodo
          <select
            name="method"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-slate-950"
            defaultValue="PIX"
          >
            <option value="PIX">Pix</option>
            <option value="DINHEIRO">Dinheiro</option>
            <option value="CARTAO_CREDITO">Cartao credito</option>
            <option value="CARTAO_DEBITO">Cartao debito</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700 sm:text-sm">
          Valor pago
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={order.total.toFixed(2)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-slate-950"
            required
          />
        </label>
      </div>

      {state.message ? (
        <p
          aria-live="polite"
          className={`mt-4 text-sm ${state.success ? "text-emerald-700" : "text-amber-700"}`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <SubmitButton label="Finalizar venda" />
      </div>
    </form>
  );
}
