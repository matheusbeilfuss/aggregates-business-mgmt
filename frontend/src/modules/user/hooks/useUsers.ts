import { useCallback } from "react";
import { userService } from "../services/user.service";
import { User } from "../types";
import { useApi } from "@/hooks/useApi";

export function useUsers() {
  const fetcher = useCallback(() => userService.getAll(), []);

  return useApi<User[]>(fetcher);
}
