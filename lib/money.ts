const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatMoney(value: number) {
  return brlFormatter.format(value);
}

export function percent(partial: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((partial / total) * 100)}%`;
}

