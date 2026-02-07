import { useCallback } from "react";
import { orderService } from "../services/order.service";
import { OrderItem, Price } from "../types";
import { useApi } from "@/hooks/useApi";

export function useOrders(scheduledDate: string | null) {
  const fetcher = useCallback(
    () => orderService.getByScheduledDate(scheduledDate!),
    [scheduledDate],
  );

  return useApi<OrderItem[]>(fetcher, { enabled: !!scheduledDate });
}

export function useOrder(id: string | null) {
  const fetcher = useCallback(() => orderService.getById(id!), [id]);

  return useApi<OrderItem>(fetcher, { enabled: !!id });
}

export function usePrices(categoryId: number | null) {
  const fetcher = useCallback(
    () => orderService.getCategoryPrices(categoryId!),
    [categoryId],
  );

  const { data, loading, error } = useApi<Price[]>(fetcher, {
    enabled: !!categoryId,
  });

  return { data: data ?? [], loading, error };
}
