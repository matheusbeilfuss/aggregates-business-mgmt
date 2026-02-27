import { api } from "@/lib/api";
import { ProductSupplier } from "../types";

export const productSupplierService = {
  getByProductId: (productId: number) =>
    api.get<ProductSupplier[]>(`/product-suppliers/${productId}`),
};
