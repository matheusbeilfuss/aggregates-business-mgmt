import { useCallback } from "react";
import { orderService } from "../services/order.service";
import { OrderItem } from "../types";
import { useApi } from "@/hooks/useApi";

export function useOrders(scheduledDate: string | null) {
  const fetcher = useCallback(
    () => orderService.getByScheduledDate(scheduledDate!),
    [scheduledDate],
  );

  return useApi<OrderItem[]>(fetcher, { enabled: !!scheduledDate });
}
