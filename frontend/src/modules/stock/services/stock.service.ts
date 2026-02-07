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
  getAll: () => api.get<StockItem[]>("/stocks"),

  getById: (id: string) => api.get<StockDetail>(`/stocks/${id}`),

  update: (id: string, data: UpdateStockPayload) =>
    api.put<StockItem>(`/stocks/${id}`, data),

  replenish: (id: string, data: ReplenishStockPayload) =>
    api.post<StockItem>(`/stocks/${id}/replenish`, data),
};

export const categoryService = {
  getAll: () => api.get<Category[]>("/categories"),
};

export const productService = {
  getAll: () => api.get<Product[]>("/products"),

  create: (data: CreateProductPayload) => api.post<Product>("/products", data),

  update: (id: number, data: UpdateProductPayload) =>
    api.put<Product>(`/products/${id}`, data),

  delete: (id: number) => api.delete(`/products/${id}`),
};

export const productSupplierService = {
  getByProductId: (productId: number) =>
    api.get<ProductSupplier[]>(`/product-suppliers/${productId}`),
};
