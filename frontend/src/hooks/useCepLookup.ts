import { useState, useEffect } from "react";

const DEBOUNCE_MS = 500;

export interface CepAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface UseCepLookupResult {
  address: CepAddress | null;
  loading: boolean;
  error: string | null;
}

export function useCepLookup(cep: string): UseCepLookupResult {
  const [address, setAddress] = useState<CepAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const digits = cep.replace(/\D/g, "");

    if (digits.length < 8) {
      setAddress(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${digits}/json/`,
        );
        const data = await response.json();

        if (data.erro) {
          setAddress(null);
          setError("CEP não encontrado.");
        } else {
          setAddress({
            street: data.logradouro ?? "",
            neighborhood: data.bairro ?? "",
            city: data.localidade ?? "",
            state: data.uf ?? "",
          });
          setError(null);
        }
      } catch {
        setAddress(null);
        setError("Não foi possível buscar o CEP.");
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [cep]);

  return { address, loading, error };
}
