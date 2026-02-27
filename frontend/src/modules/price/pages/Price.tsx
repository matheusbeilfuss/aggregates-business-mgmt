import { usePageTitle } from "@/hooks/usePageTitle";
import { usePrices } from "../hooks/usePrices";
import { LoadingState, PageContainer } from "@/components/shared";
import { PriceTable } from "../components/PriceTable";

export function Price() {
  usePageTitle("Preços");

  const { data: prices, loading, error } = usePrices();

  return (
    <PageContainer title="Preços">
      {error && <p className="text-red-500 mb-4">{error.message}</p>}

      {loading ? <LoadingState rows={5} /> : <PriceTable prices={prices} />}
    </PageContainer>
  );
}
