import { useApi } from "@/hooks/useApi";
import { orderService } from "../services/order.service";
import { Phone } from "../types";
import { useCallback } from "react";

export function useClientsPhones(id: string | null) {
  const fetcher = useCallback(
    () => orderService.getPhonesByClientId(Number(id!)),
    [id],
  );

  return useApi<Phone[]>(fetcher, { enabled: !!id });
}
