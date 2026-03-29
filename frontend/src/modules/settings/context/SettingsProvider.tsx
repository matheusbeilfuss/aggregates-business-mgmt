import { ReactNode, useCallback, useEffect, useState } from "react";
import { settingsService } from "../services/settings.service";
import { SettingsContext } from "./settings.context";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [businessName, setBusinessName] = useState("Nome do Comércio");
  const [businessImgName, setBusinessImgName] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const settings = await settingsService.get();
      setBusinessName(settings.businessName);
      setBusinessImgName(settings.businessImgName);
    } catch {
      setBusinessName("Nome do Comércio");
      setBusinessImgName(undefined);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider
      value={{
        businessName,
        businessImgName,
        isLoading,
        refetchSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
