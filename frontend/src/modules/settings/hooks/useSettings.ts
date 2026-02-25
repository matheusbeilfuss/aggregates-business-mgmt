import { useContext } from "react";
import { SettingsContext } from "../context/settings.context";

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings deve ser usado dentro de um SettingsProvider");
  }
  return context;
}
