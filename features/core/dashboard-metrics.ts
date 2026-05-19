import type { DashboardMetric } from "@/types/domain";

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Vendas do dia",
    value: "R$ 3.420,00",
    hint: "12% acima da media dos ultimos 7 dias.",
  },
  {
    label: "Pedidos em aberto",
    value: "18",
    hint: "6 aguardando cozinha e 4 esperando pagamento.",
  },
  {
    label: "Caixa ativo",
    value: "01",
    hint: "Aberto as 08:00 com fundo inicial de R$ 200,00.",
  },
  {
    label: "Itens com estoque baixo",
    value: "03",
    hint: "Revisar Coca-Cola 2L, pao brioche e molho especial.",
  },
];
