export function parseLocalCurrency(value: string): number | undefined {
  const parsed = Number(
    value
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", "."),
  );

  return Number.isNaN(parsed) ? undefined : parsed;
}
