import "server-only";

import { requirePermission } from "@/lib/auth";
import { readAppStore } from "@/lib/local-store";
import { formatMoney } from "@/lib/money";

export async function getReportCards() {
  const user = await requirePermission("viewReports");
  const store = await readAppStore();
  const paidSales = store.sales.filter(
    (sale) => sale.companyId === user.companyId && sale.status === "PAGA",
  );
  const payments = store.payments.filter(
    (payment) => payment.companyId === user.companyId && payment.status === "APROVADO",
  );
  const deliveredOrders = store.orders.filter(
    (order) => order.companyId === user.companyId && order.status === "ENTREGUE",
  );
  const totalRevenue = paidSales.reduce((sum, sale) => sum + sale.total, 0);
  const averageTicket = paidSales.length ? totalRevenue / paidSales.length : 0;
  const methodCount = new Map<string, number>();
  const productCount = new Map<string, number>();

  for (const payment of payments) {
    methodCount.set(payment.method, (methodCount.get(payment.method) ?? 0) + 1);
  }

  for (const order of deliveredOrders) {
    for (const item of order.items) {
      productCount.set(
        item.productName,
        (productCount.get(item.productName) ?? 0) + item.quantity,
      );
    }
  }

  const leadingMethod =
    [...methodCount.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ??
    "Sem dados";
  const topProduct =
    [...productCount.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ??
    "Sem vendas";

  return [
    {
      title: "Vendas do dia",
      value: formatMoney(totalRevenue),
      description: `${paidSales.length} venda(s) finalizadas neste ambiente local.`,
    },
    {
      title: "Ticket medio",
      value: formatMoney(averageTicket),
      description: "Calculado apenas sobre vendas pagas.",
    },
    {
      title: "Forma lider",
      value: leadingMethod,
      description: "Metodo mais usado entre os pagamentos aprovados.",
    },
    {
      title: "Produto campeao",
      value: topProduct,
      description: "Item mais vendido entre pedidos entregues.",
    },
  ];
}
