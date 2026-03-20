import { useMemo, useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { YearPicker } from "../components/YearPicker";
import { BalanceChart } from "../components/BalanceChart";
import { BalanceSummaryTable } from "../components/BalanceSummaryTable";
import { useBalanceData } from "../hooks/useBalanceData";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Balance() {
  usePageTitle("Balanços");

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const startDate = useMemo(() => new Date(year, 0, 1), [year]);
  const endDate = useMemo(() => new Date(year, 11, 31), [year]);

  const { monthlyData, summary, loading, error } = useBalanceData({
    startDate,
    endDate,
  });

  useEffect(() => {
    if (error) {
      toast.error("Não foi possível carregar os dados de balanço.");
    }
  }, [error]);

  const hasData = monthlyData.some((m) => m.expenses > 0 || m.income > 0);

  return (
    <PageContainer title="Balanços">
      <div className="flex flex-col gap-8">
        <div className="flex justify-center">
          <YearPicker year={year} onChange={setYear} />
        </div>

        {loading ? (
          <LoadingState />
        ) : !hasData ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum dado financeiro encontrado para {year}.
          </p>
        ) : (
          <>
            <BalanceChart data={monthlyData} />

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
