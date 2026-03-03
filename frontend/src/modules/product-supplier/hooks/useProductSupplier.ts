import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { ProductSupplier } from "../types";
import { productSupplierService } from "../services/productSupplier.service";

export function useProductSupplier(
  id: number | null | undefined,
  { enabled = true } = {},
) {
  const fetcher = useCallback(() => productSupplierService.getById(id!), [id]);

  return useApi<ProductSupplier>(fetcher, {
    enabled: enabled && id != null && id > 0,
  });
}
