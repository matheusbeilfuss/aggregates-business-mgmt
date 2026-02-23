import { useCallback, useEffect, useState } from "react";
import { userService } from "../services/user.service";
import { User } from "../types";
import { useApi } from "@/hooks/useApi";

export function useUserAvatar(version?: string) {
  const [avatarUrl, setAvatarUrl] = useState<string>();

  useEffect(() => {
    let objectUrl: string;

    async function fetchAvatar() {
      if (!version) return;

      const blob = await userService.getAvatar(version);
      objectUrl = URL.createObjectURL(blob);
      setAvatarUrl(objectUrl);
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

export function useUsers() {
  const fetcher = useCallback(() => userService.getAll(), []);

  return useApi<User[]>(fetcher);
}
