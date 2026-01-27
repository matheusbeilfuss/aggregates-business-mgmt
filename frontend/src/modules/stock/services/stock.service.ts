import { api } from "@/lib/api";
import type {
  StockItem,
  StockDetail,
  Category,
  Product,
  ProductSupplier,
  CreateProductPayload,
  UpdateProductPayload,
  UpdateStockPayload,
  ReplenishStockPayload,
} from "../types";

export const stockService = {
  getAll: (signal?: AbortSignal) => api.get<StockItem[]>("/stocks", signal),

  getById: (id: string, signal?: AbortSignal) =>
    api.get<StockDetail>(`/stocks/${id}`, signal),

  update: (id: string, data: UpdateStockPayload) =>
    api.put<StockItem>(`/stocks/${id}`, data),

  replenish: (id: string, data: ReplenishStockPayload) =>
    api.post<void>(`/stocks/${id}/replenish`, data),
};

export const categoryService = {
  getAll: (signal?: AbortSignal) => api.get<Category[]>("/categories", signal),
};

export const productService = {
  create: (data: CreateProductPayload) => api.post<Product>("/products", data),

  update: (id: number, data: UpdateProductPayload) =>
    api.put<Product>(`/products/${id}`, data),

  delete: (id: number) => api.delete(`/products/${id}`),
};

export const productSupplierService = {
  getByProductId: (productId: number, signal?: AbortSignal) =>
    api.get<ProductSupplier[]>(`/product-suppliers/${productId}`, signal),
};
