import { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState } from "@/components/shared";
import { PeriodPicker } from "@/components/shared/PeriodPicker";
import { FinanceTotalBar } from "@/components/shared/FinanceTotalBar";
import { FuelRow } from "../components/FuelRow";
import { useFuelExpenses } from "../hooks/useFuelExpenses";
import { DatePeriod } from "@/types";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Fuel() {
  usePageTitle("Combustível");

  const [period, setPeriod] = useState<DatePeriod>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  const {
    data: expenses,
    loading,
    error,
  } = useFuelExpenses({
    startDate: period.startDate,
    endDate: period.endDate,
  });

  useEffect(() => {
    if (error) {
      toast.error("Não foi possível carregar os registros de combustível.");
    }
  }, [error]);

  const total =
    expenses?.reduce((acc, e) => acc + Number(e.expenseValue), 0) ?? 0;

  return (
    <PageContainer title="Combustível">
      <div className="flex flex-col gap-10">
        <div className="flex justify-center">
          <PeriodPicker period={period} onChange={setPeriod} />
        </div>

        {loading ? (
          <LoadingState />
        ) : !expenses?.length ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum registro de combustível no período selecionado.
          </p>
        ) : (
          <div className="flex flex-col gap-2 pb-4">
            {expenses.map((e) => (
              <FuelRow key={e.id} expense={e} />
            ))}
            <FinanceTotalBar
              label="Total gasto"
              value={total}
              variant="expense"
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
