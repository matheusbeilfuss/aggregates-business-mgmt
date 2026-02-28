import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { Supplier } from "../types";
import { supplierService } from "../services/productSupplier.service";

export function useSuppliers() {
  const fetcher = useCallback(() => supplierService.getAll(), []);

  const { data, loading, error } = useApi<Supplier[]>(fetcher);

  return { data: data ?? [], loading, error };
}
