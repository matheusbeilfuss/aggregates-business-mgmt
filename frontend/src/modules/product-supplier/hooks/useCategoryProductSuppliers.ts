import { useCallback } from "react";
import { productSupplierService } from "../services/productSupplier.service";
import { ProductSupplier } from "../types";
import { useApi } from "@/hooks/useApi";

export function useCategoryProductSuppliers(
  categoryId: number | null | undefined,
  { enabled = true } = {},
) {
  const fetcher = useCallback(
    () => productSupplierService.getByCategoryId(categoryId!),
    [categoryId],
  );

  return useApi<ProductSupplier[]>(fetcher, {
    enabled: enabled && categoryId != null && categoryId > 0,
  });
}
