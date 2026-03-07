import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";

export const useExpenseOptions = ({ enabled = true } = {}) => {
  const categories = useApi(
    useCallback(() => api.get<string[]>("/expenses/categories"), []),
    { enabled },
  );
  const vehicles = useApi(
    useCallback(() => api.get<string[]>("/expenses/vehicles"), []),
    { enabled },
  );
  const fuelSuppliers = useApi(
    useCallback(() => api.get<string[]>("/expenses/fuel-suppliers"), []),
    { enabled },
  );

  return {
    categories: categories.data ?? [],
    vehicles: vehicles.data ?? [],
    fuelSuppliers: fuelSuppliers.data ?? [],
  };
};
