import { api } from "@/lib/api";
import { CreateProductPayload, Product, UpdateProductPayload } from "../types";

export const productService = {
  getAll: () => api.get<Product[]>("/products"),

  create: (data: CreateProductPayload) => api.post<Product>("/products", data),

  update: (id: number, data: UpdateProductPayload) =>
    api.put<Product>(`/products/${id}`, data),

  delete: (id: number) => api.delete(`/products/${id}`),
};
