import type { OrderStatus } from "@/types/domain";

const statusStyles: Record<OrderStatus, string> = {
  NOVO: "bg-amber-100 text-amber-800",
  EM_PREPARO: "bg-orange-100 text-orange-800",
  PRONTO: "bg-emerald-100 text-emerald-800",
  ENTREGUE: "bg-slate-200 text-slate-700",
  CANCELADO: "bg-rose-100 text-rose-800",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] ${statusStyles[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
