import { useEffect, useState } from "react";
import { userService } from "../services/user.service";

export function useUserAvatar(version?: string) {
  const [avatarUrl, setAvatarUrl] = useState<string>();

  useEffect(() => {
    let objectUrl: string;

    async function fetchAvatar() {
      if (!version) return;

      try {
        const blob = await userService.getAvatar(version);
        objectUrl = URL.createObjectURL(blob);
        setAvatarUrl(objectUrl);
      } catch {
        setAvatarUrl(undefined);
      }
    }

    fetchAvatar();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [version]);

  return avatarUrl;
}
