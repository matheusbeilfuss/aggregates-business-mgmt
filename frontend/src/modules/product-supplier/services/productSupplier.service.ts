import { api } from "@/lib/api";
import {
  ProductSupplier,
  ProductSupplierInput,
  ProductSupplierUpdate,
  Supplier,
} from "../types";

export const productSupplierService = {
  getById: (id: number) => api.get<ProductSupplier>(`/product-suppliers/${id}`),

  getByProductId: (productId: number) =>
    api.get<ProductSupplier[]>(`/product-suppliers/product/${productId}`),

  getByCategoryId: (categoryId: number) =>
    api.get<ProductSupplier[]>(`/categories/${categoryId}/product-suppliers`),

  insert: (data: ProductSupplierInput) =>
    api.post<ProductSupplier>("/product-suppliers", data),

  update: (id: number, data: ProductSupplierUpdate) =>
    api.put<ProductSupplier>(`/product-suppliers/${id}`, data),

  delete: (id: number) => api.delete(`/product-suppliers/${id}`),
};

export const supplierService = {
  getAll: () => api.get<Supplier[]>("/suppliers"),

  insert: (data: { name: string }) => api.post<Supplier>("/suppliers", data),

  update: (id: number, data: { name: string }) =>
    api.put<Supplier>(`/suppliers/${id}`, data),
};
