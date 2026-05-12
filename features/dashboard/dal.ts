import "server-only";

import { requirePermission } from "@/lib/auth";
import { getInventoryAlerts } from "@/features/catalog/dal";
import { getReportCards } from "@/features/reports/dal";
import { readAppStore } from "@/lib/local-store";
import { formatMoney } from "@/lib/money";

export async function getDashboardOverview() {
  const user = await requirePermission("viewAdmin");
  const store = await readAppStore();
  const companyOrders = store.orders.filter((order) => order.companyId === user.companyId);
  const openOrders = companyOrders.filter(
    (order) => order.status !== "ENTREGUE" && order.status !== "CANCELADO",
  );
  const paidSales = store.sales.filter(
    (sale) => sale.companyId === user.companyId && sale.status === "PAGA",
  );
  const totalRevenue = paidSales.reduce((sum, sale) => sum + sale.total, 0);
  const lowStock = await getInventoryAlerts();
  const reports = await getReportCards();

  return {
    metrics: [
      {
        label: "Vendas do dia",
        value: formatMoney(totalRevenue),
        hint: `${paidSales.length} venda(s) com pagamento aprovado.`,
      },
      {
        label: "Pedidos em aberto",
        value: String(openOrders.length),
        hint: "Pedidos ainda em fluxo entre caixa e cozinha.",
      },
      {
        label: "Pedidos prontos",
        value: String(
          companyOrders.filter((order) => order.status === "PRONTO").length,
        ),
        hint: "Aguardando pagamento e entrega pelo caixa.",
      },
      {
        label: "Itens com estoque baixo",
        value: String(lowStock.length),
        hint: "Produtos que ja alcancaram o minimo definido.",
      },
    ],
    lowStock,
    reports,
  };
}
