import { useMemo, useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { YearPicker } from "../components/YearPicker";
import { BalanceChart } from "../components/BalanceChart";
import { BalanceSummaryTable } from "../components/BalanceSummaryTable";
import { ExpenseCategoryChart } from "../components/ExpenseCategoryChart";
import { ProductBalanceChart } from "../components/ProductBalanceChart";
import { useBalanceData } from "../hooks/useBalanceData";
import { useProductBalance } from "../hooks/useProductBalance";
import { toast } from "sonner";

export default function Balance() {
  usePageTitle("Balanços");

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const startDate = useMemo(() => new Date(year, 0, 1), [year]);
  const endDate = useMemo(() => new Date(year, 11, 31), [year]);

  const { monthlyData, summary, expensesByCategory, loading, error } =
    useBalanceData({ startDate, endDate });

  const { data: productBalance, loading: loadingProducts } = useProductBalance({
    startDate,
    endDate,
  });

  useEffect(() => {
    if (error) {
      toast.error("Não foi possível carregar os dados de balanço.");
    }
  }, [error]);

  const hasData = monthlyData.some((m) => m.expenses > 0 || m.income > 0);
  const isLoading = loading || loadingProducts;

  return (
    <PageContainer title="Balanços">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex justify-center">
          <YearPicker year={year} onChange={setYear} />
        </div>

        {isLoading ? (
          <LoadingState />
        ) : !hasData ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum dado financeiro encontrado para {year}.
          </p>
        ) : (
          <>
            <section className="flex flex-col gap-4">
              <h2 className="text-base font-semibold">Visão geral</h2>
              <BalanceChart data={monthlyData} />
            </section>

            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <BalanceSummaryTable summary={summary} />
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `/balance/print?year=${year}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <Printer className="mr-2 h-4 w-4" />
                Exportar balanço
              </Button>
            </section>

            <Separator />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <section className="flex flex-col gap-4">
                <h2 className="text-base font-semibold">
                  Despesas por categoria
                </h2>
                <ExpenseCategoryChart data={expensesByCategory} />
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="text-base font-semibold">Vendas por produto</h2>
                <ProductBalanceChart data={productBalance ?? []} />
              </section>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
