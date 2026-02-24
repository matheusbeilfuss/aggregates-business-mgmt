import { createContext } from "react";

export interface SettingsContextData {
  businessName: string;
  isLoading: boolean;
  refetchSettings: () => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextData | undefined>(
  undefined,
);
