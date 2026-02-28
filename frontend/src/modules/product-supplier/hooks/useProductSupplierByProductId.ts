import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { ProductSupplier } from "../types";
import { productSupplierService } from "../services/productSupplier.service";

export function useProductSuppliersByProductId(productId: number | null) {
  const fetcher = useCallback(() => {
    return productSupplierService.getByProductId(productId!);
  }, [productId]);

  return useApi<ProductSupplier[]>(fetcher, { enabled: !!productId });
}
