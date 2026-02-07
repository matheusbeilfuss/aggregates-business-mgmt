import { useCallback } from "react";
import { orderService } from "../services/order.service";
import { Client, ClientDetail } from "../types";
import { useApi } from "@/hooks/useApi";

export function useClients() {
  const fetcher = useCallback(() => orderService.getAllClients(), []);

  return useApi<Client[]>(fetcher);
}

export function useClient(id: string | null) {
  const fetcher = useCallback(
    () => orderService.getClientById(Number(id!)),
    [id],
  );

  return useApi<ClientDetail>(fetcher, { enabled: !!id });
}
