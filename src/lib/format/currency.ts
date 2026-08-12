const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
