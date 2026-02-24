import { useCallback, useEffect, useState } from "react";
import { settingsService } from "../services/settings.service";
import { SettingsContext } from "./settings.context";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [businessName, setBusinessName] = useState("Nome do Comércio");
  const [isLoading, setIsLoading] = useState(true);
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const settings = await settingsService.get();
      setBusinessName(settings.businessName);
    } catch {
      setBusinessName("Nome do Comércio");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider
      value={{ businessName, isLoading, refetchSettings: fetchSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
