import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { ProductSupplier } from "../types";
import { productSupplierService } from "../services/productSupplier.service";

export function useProductSuppliersByProductId(
  productId: number | null | undefined,
  { enabled = true } = {},
) {
  const fetcher = useCallback(
    () => productSupplierService.getByProductId(productId!),
    [productId],
  );

  return useApi<ProductSupplier[]>(fetcher, {
    enabled: enabled && productId != null && productId > 0,
  });
}
