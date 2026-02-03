import type { ProductSupplier } from "../types";

export function tonToM3(tons: number, density: number): number {
  if (density <= 0) return 0;
  return parseFloat((tons / density).toFixed(2));
}

export function m3ToTon(m3: number, density: number): number {
  if (density <= 0) return 0;
  return parseFloat((m3 * density).toFixed(2));
}

export function calculateExpenseValue(
  tonQuantity: number,
  m3Quantity: number,
  supplier: Pick<ProductSupplier, "tonCost" | "costPerCubicMeter">,
): number {
  if (supplier.tonCost && supplier.tonCost > 0) {
    return parseFloat((tonQuantity * supplier.tonCost).toFixed(2));
  }
  if (supplier.costPerCubicMeter && supplier.costPerCubicMeter > 0) {
    return parseFloat((m3Quantity * supplier.costPerCubicMeter).toFixed(2));
  }
  return 0;
}
