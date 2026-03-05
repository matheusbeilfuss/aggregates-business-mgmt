import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";

export const useExpenseOptions = () => {
  const categories = useApi(
    useCallback(() => api.get<string[]>("/expenses/categories"), []),
  );
  const vehicles = useApi(
    useCallback(() => api.get<string[]>("/expenses/vehicles"), []),
  );
  const fuelSuppliers = useApi(
    useCallback(() => api.get<string[]>("/expenses/fuel-suppliers"), []),
  );

  return {
    categories: categories.data ?? [],
    vehicles: vehicles.data ?? [],
    fuelSuppliers: fuelSuppliers.data ?? [],
  };
};
