export interface ProductSupplier {
  id: number;
  supplierId: number;
  supplierName: string;
  productName: string;
  tonCost: number;
  costPerCubicMeter: number;
  costFor5CubicMeters?: number;
  density: number;
}

// Payloads para API

export interface ProductSupplierInput {
  productId: number;
  supplierId: number;
  density: number;
  tonCost: number;
  costPerCubicMeter: number;
  costFor5CubicMeters: number;
}

export interface ProductSupplierUpdate {
  density: number;
  tonCost: number;
  costPerCubicMeter: number;
  costFor5CubicMeters: number;
}
