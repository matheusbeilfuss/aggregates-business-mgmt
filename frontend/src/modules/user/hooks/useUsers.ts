import { useCallback } from "react";
import { userService } from "../services/user.service";
import { User } from "../types";
import { useApi } from "@/hooks/useApi";

export function useUser() {
  const fetcher = useCallback(() => userService.getMe(), []);

  return useApi<User>(fetcher);
}

export function useUserAvatar() {
  const fetcher = useCallback(async () => {
    const blob = await userService.getAvatar();
    return URL.createObjectURL(blob);
  }, []);

  return useApi<string>(fetcher);
}
