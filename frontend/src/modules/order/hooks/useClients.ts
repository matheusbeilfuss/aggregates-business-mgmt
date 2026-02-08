import { useCallback } from "react";
import { clientService } from "../services/order.service";
import { Client, ClientDetail } from "../types";
import { useApi } from "@/hooks/useApi";

export function useClients() {
  const fetcher = useCallback(() => clientService.getAll(), []);

  return useApi<Client[]>(fetcher);
}

export function useClient(id: string | null) {
  const fetcher = useCallback(() => clientService.getById(Number(id!)), [id]);

  return useApi<ClientDetail>(fetcher, { enabled: !!id });
}
