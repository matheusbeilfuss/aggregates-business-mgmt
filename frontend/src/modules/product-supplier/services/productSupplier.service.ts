import { api } from "@/lib/api";
import {
  ProductSupplier,
  ProductSupplierInput,
  ProductSupplierUpdate,
} from "../types";

export const productSupplierService = {
  getByProductId: (productId: number) =>
    api.get<ProductSupplier[]>(`/product-suppliers/${productId}`),

  getByCategoryId: (categoryId: number) =>
    api.get<ProductSupplier[]>(`/categories/${categoryId}/product-suppliers`),

  insert: (data: ProductSupplierInput) =>
    api.post<ProductSupplier>("/product-suppliers", data),

  update: (id: number, data: ProductSupplierUpdate) =>
    api.put<ProductSupplier>(`/product-suppliers/${id}`, data),

  delete: (id: number) => api.delete(`/product-suppliers/${id}`),
};
