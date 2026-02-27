import { useCallback } from "react";
import { orderService } from "../services/order.service";
import { OrderItem } from "../types";
import { useApi } from "@/hooks/useApi";

export function useOrder(id: number | null) {
  const fetcher = useCallback(() => orderService.getById(id!), [id]);

  return useApi<OrderItem>(fetcher, { enabled: !!id });
}
