import { SettingsProvider } from "@/modules/settings/context/SettingsProvider";
import { AuthProvider } from "@/modules/auth/context/AuthProvider";

export function Providers() {
  return (
    <SettingsProvider>
      <AuthProvider />
    </SettingsProvider>
  );
}
