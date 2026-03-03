import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { clientService } from "../services/client.service";
import { Client } from "../types";

export function useClient(
  id: number | null | undefined,
  { enabled = true } = {},
) {
  const fetcher = useCallback(() => clientService.getById(id!), [id]);

  return useApi<Client>(fetcher, { enabled: enabled && id != null && id > 0 });
}
