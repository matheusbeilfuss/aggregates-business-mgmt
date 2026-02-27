export interface ProductSupplier {
  id: number;
  supplierId: number;
  supplierName: string;
  tonCost: number;
  costPerCubicMeter: number;
  costFor5CubicMeters?: number;
  density: number;
}
