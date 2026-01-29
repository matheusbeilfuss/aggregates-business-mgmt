import { useCallback } from "react";
import { productSupplierService } from "../services/stock.service";
import { useApi } from "@/hooks/useApi";
import { ProductSupplier } from "../types";

export function useProductSuppliers(productId: number | null) {
  const fetcher = useCallback(() => {
    if (!productId) throw new Error("O ID do produto é obrigatório");
    return productSupplierService.getByProductId(productId);
  }, [productId]);

  return useApi<ProductSupplier[]>(fetcher);
}
