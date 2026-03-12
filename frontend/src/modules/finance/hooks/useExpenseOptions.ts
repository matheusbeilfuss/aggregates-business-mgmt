import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";

export const useExpenseOptions = ({
  enabled = true,
  includeVehicles = true,
  includeFuelSuppliers = true,
} = {}) => {
  const categories = useApi(
    useCallback(() => api.get<string[]>("/expenses/categories"), []),
    { enabled },
  );
  const vehicles = useApi(
    useCallback(() => api.get<string[]>("/expenses/vehicles"), []),
    { enabled: enabled && includeVehicles },
  );
  const fuelSuppliers = useApi(
    useCallback(() => api.get<string[]>("/expenses/fuel-suppliers"), []),
    { enabled: enabled && includeFuelSuppliers },
  );

  return {
    categories: categories.data ?? [],
    vehicles: vehicles.data ?? [],
    fuelSuppliers: fuelSuppliers.data ?? [],
  };
};
