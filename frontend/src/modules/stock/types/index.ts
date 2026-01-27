export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  category?: Category;
}

export interface StockItem {
  id: number;
  tonQuantity: number;
  m3Quantity: number;
  product: Product;
}

export interface StockDetail extends StockItem {
  product: Product & {
    category: Category;
  };
}

export interface ProductSupplier {
  id: number;
  supplierId: number;
  supplierName: string;
  tonCost: number;
  costPerCubicMeter: number;
  costFor5CubicMeters?: number;
  density: number;
}

// Payloads para API
export interface CreateProductPayload {
  name: string;
  categoryId?: number;
  categoryName?: string;
}

export interface UpdateProductPayload {
  name: string;
  categoryId: number;
}

export interface UpdateStockPayload {
  tonQuantity: number;
  m3Quantity: number;
  productId: number;
}

export interface ReplenishStockPayload {
  tonQuantity: number;
  m3Quantity: number;
  expenseValue: number;
  paymentStatus: "PAID" | "PENDING";
}
