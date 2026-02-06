import { useCallback } from "react";
import { orderService } from "../services/order.service";
import { Client } from "../types";
import { useApi } from "@/hooks/useApi";

export function useClients() {
  const fetcher = useCallback(() => orderService.getAllClients(), []);

  return useApi<Client[]>(fetcher);
}
