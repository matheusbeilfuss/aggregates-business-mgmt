import { Category } from "@/modules/category/types";
import { Product } from "@/modules/product/types";

export interface StockItem {
  id: number;
  tonQuantity: number;
  m3Quantity: number;
  density: number;
  product: Product;
}

export interface StockDetail extends StockItem {
  product: Product & {
    category: Category;
  };
}

// Payloads para API

export interface UpdateStockPayload {
  tonQuantity: number;
  m3Quantity: number;
  density: number;
  productId: number;
}

export interface ReplenishStockPayload {
  tonQuantity: number;
  m3Quantity: number;
  density: number;
  expenseValue: number;
  paymentStatus: "PAID" | "PENDING";
}
