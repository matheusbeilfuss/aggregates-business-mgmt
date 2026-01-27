import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { productSupplierService } from "../services/stock.service";

export function useProductSuppliers(productId: number | null) {
  const fetcher = useCallback(
    (signal: AbortSignal) => {
      if (!productId) return Promise.resolve([]);
      return productSupplierService.getByProductId(productId, signal);
    },
    [productId],
  );

  return useApi(fetcher, { immediate: !!productId });
}
