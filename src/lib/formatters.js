export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("pt-BR");
}
