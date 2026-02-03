import { useCallback, useEffect, useState } from "react";

interface UseApiOptions {
  enabled?: boolean;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  { enabled = true }: UseApiOptions = {},
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  }, [fetcher, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
