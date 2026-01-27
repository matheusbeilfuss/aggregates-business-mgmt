import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface UseApiOptions {
  immediate?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  setData: Dispatch<SetStateAction<T | null>>;
}

export function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  options: UseApiOptions = {},
): UseApiReturn<T> {
  const { immediate = true } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await fetcher(signal ?? new AbortController().signal);
        setState({ data, loading: false, error: null });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        let message =
          error instanceof Error ? error.message : "Erro desconhecido";

        if (message === "Failed to fetch") {
          message = "Não foi possível conectar ao servidor.";
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: message,
        }));
      }
    },
    [fetcher],
  );

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!immediate) return;

    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchData, immediate]);

  return {
    ...state,
    refetch,
    setData: (value) =>
      setState((prev) => ({
        ...prev,
        data:
          typeof value === "function"
            ? (value as (prevState: T | null) => T | null)(prev.data)
            : value,
      })),
  };
}
