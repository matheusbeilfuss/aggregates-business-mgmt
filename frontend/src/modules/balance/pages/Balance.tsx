import { useMemo, useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Printer, BarChart3 } from "lucide-react";
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

  const {
    monthlyData,
    summary,
    expensesByCategory,
    loading,
    error: balanceError,
  } = useBalanceData({ startDate, endDate });

  const {
    data: productBalance,
    loading: loadingProducts,
    error: productBalanceError,
  } = useProductBalance({ startDate, endDate });

  const error = balanceError || productBalanceError;

  useEffect(() => {
    if (error) toast.error("Não foi possível carregar os dados de balanço.");
  }, [error]);

  const hasData =
    !balanceError && monthlyData.some((m) => m.expenses > 0 || m.income > 0);
  const isLoading = loading || loadingProducts;

  return (
    <PageContainer
      title="Balanços"
      actions={
        <div className="flex items-center gap-2">
          <YearPicker year={year} onChange={setYear} />
          <Button
            variant="outline"
            className="h-9 px-4 text-sm gap-1.5"
            onClick={() =>
              window.open(
                `/balance/print?year=${year}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <Printer className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-8 pb-8">
        {error && (
          <p className="text-sm text-destructive text-center">
            Não foi possível carregar todos os dados. Tente novamente.
          </p>
        )}

        {isLoading ? (
          <LoadingState />
        ) : !hasData ? (
          <div
            className="flex flex-col items-center justify-center gap-2 py-16
                       rounded-xl border border-dashed"
            style={{ borderColor: "var(--color-outline-variant)" }}
          >
            <BarChart3
              className="h-6 w-6"
              style={{ color: "var(--color-on-surface-variant)" }}
            />
            <p
              className="text-sm"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Nenhum dado financeiro encontrado para {year}.
            </p>
          </div>
        ) : (
          <>
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  Visão geral
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "var(--color-outline-variant)" }}
                />
              </div>

              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                <div className="flex-1 min-w-0">
                  <BalanceChart data={monthlyData} />
                </div>
                <div className="shrink-0">
                  <BalanceSummaryTable summary={summary} />
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    Despesas por categoria
                  </h2>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--color-outline-variant)" }}
                  />
                </div>
                <ExpenseCategoryChart data={expensesByCategory} />
              </section>

              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    Vendas por produto
                  </h2>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--color-outline-variant)" }}
                  />
                </div>
                <ProductBalanceChart data={productBalance ?? []} />
              </section>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
