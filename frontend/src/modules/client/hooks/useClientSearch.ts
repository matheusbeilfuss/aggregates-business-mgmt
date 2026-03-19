import { useState, useEffect, useRef } from "react";
import { Client } from "../types";
import { clientService } from "../services/client.service";

const DEBOUNCE_MS = 300;
const MIN_CHARS = 3;

interface UseClientSearchResult {
  results: Client[];
  loading: boolean;
}

export function useClientSearch(query: string): UseClientSearchResult {
  const [results, setResults] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < MIN_CHARS) {
      setResults([]);
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await clientService.search(trimmed);
        if (!ignore) setResults(data ?? []);
      } catch {
        if (!ignore) setResults([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { results, loading };
}
