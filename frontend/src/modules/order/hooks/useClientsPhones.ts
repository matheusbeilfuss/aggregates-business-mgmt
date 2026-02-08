import { useApi } from "@/hooks/useApi";
import { clientService } from "../services/order.service";
import { Phone } from "../types";
import { useCallback } from "react";

export function useClientsPhones(id: string | null) {
  const fetcher = useCallback(
    () => clientService.getPhonesById(Number(id!)),
    [id],
  );

  return useApi<Phone[]>(fetcher, { enabled: !!id });
}
