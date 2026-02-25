import { useEffect } from "react";
import { useSettings } from "@/modules/settings/hooks/useSettings";

export function usePageTitle(title: string) {
  const { businessName } = useSettings();

  useEffect(() => {
    document.title = `${title} | ${businessName}`;
  }, [title, businessName]);
}
