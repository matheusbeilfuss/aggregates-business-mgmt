import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { Supplier } from "../types";
import { supplierService } from "../services/supplier.service";

export function useSuppliers({ enabled = true } = {}) {
  const fetcher = useCallback(() => supplierService.getAll(), []);

  return useApi<Supplier[]>(fetcher, { enabled });
}
