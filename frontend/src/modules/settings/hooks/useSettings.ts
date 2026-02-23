import { useCallback } from "react";
import { settingsService } from "../services/settings.service";
import { Settings } from "../types";
import { useApi } from "@/hooks/useApi";

export function useSettings() {
  const fetcher = useCallback(() => settingsService.get(), []);

  return useApi<Settings>(fetcher);
}
