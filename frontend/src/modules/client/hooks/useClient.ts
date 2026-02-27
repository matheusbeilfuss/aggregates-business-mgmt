import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { clientService } from "../services/client.service";
import { Client } from "../types";

export function useClient(id: string | null) {
  const fetcher = useCallback(() => clientService.getById(Number(id!)), [id]);

  return useApi<Client>(fetcher, { enabled: !!id });
}
