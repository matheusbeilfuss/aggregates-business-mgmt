export interface Supplier {
  id: number;
  name: string;
}

export interface ProductSupplier {
  id: number;
  productId: number;
  supplierId: number;
  supplierName: string;
  productName: string;
  tonCost: number;
  costPerCubicMeter: number;
  costFor5CubicMeters?: number;
  density: number;
  observations?: string;
}

// Payloads para API

export interface ProductSupplierInput {
  productId: number;
  supplierId: number;
  density: number;
  tonCost: number;
  costPerCubicMeter: number;
  costFor5CubicMeters: number;
  observations?: string;
}

export interface ProductSupplierUpdate {
  productId: number;
  density: number;
  tonCost: number;
  costPerCubicMeter: number;
  costFor5CubicMeters: number;
  observations?: string;
}
