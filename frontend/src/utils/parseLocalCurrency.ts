export function parseLocalCurrency(value: string): number | undefined {
  const cleaned = value
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  if (!cleaned) return undefined;

  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? undefined : parsed;
}
