import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { clientService } from "../services/client.service";
import { Client } from "../types";

export function useClients() {
  const fetcher = useCallback(() => clientService.getAll(), []);

  return useApi<Client[]>(fetcher);
}
