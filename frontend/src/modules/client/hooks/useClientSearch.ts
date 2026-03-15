import { useState, useEffect } from "react";
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

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await clientService.search(trimmed);
        setResults(data ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}
