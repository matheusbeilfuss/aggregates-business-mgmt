import { useState, useEffect, useMemo } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageContainer, LoadingState, SummaryCard } from "@/components/shared";
import { PeriodPicker } from "@/components/shared/PeriodPicker";
import { FuelRow } from "../components/FuelRow";
import { useFuelExpenses } from "../hooks/useFuelExpenses";
import { DatePeriod } from "@/types";
import { toast } from "sonner";
import { Fuel as FuelIcon } from "lucide-react";
import { formatLocalCurrency } from "@/utils";

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
    if (error)
      toast.error("Não foi possível carregar os registros de combustível.");
  }, [error]);

  const sortedExpenses = useMemo(
    () => [...(expenses ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
    [expenses],
  );

  const total = sortedExpenses.reduce(
    (acc, e) => acc + Number(e.expenseValue),
    0,
  );

  return (
    <PageContainer
      title="Combustível"
      actions={<PeriodPicker period={period} onChange={setPeriod} />}
    >
      {loading ? (
        <LoadingState />
      ) : !sortedExpenses.length ? (
        <div
          className="flex flex-col items-center justify-center gap-2 py-16
                     rounded-xl border border-dashed"
          style={{ borderColor: "var(--color-outline-variant)" }}
        >
          <FuelIcon
            className="h-6 w-6"
            style={{ color: "var(--color-on-surface-variant)" }}
          />
          <p
            className="text-sm"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Nenhum registro de combustível no período selecionado.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="sm:w-[520px]">
            <SummaryCard
              label="Total gasto"
              value={formatLocalCurrency(total)}
              icon={FuelIcon}
              iconBg="var(--color-secondary-90)"
              iconColor="var(--color-secondary-40)"
              valueColor="var(--color-secondary-40)"
            />
          </div>

          <div className="flex flex-col gap-2">
            {sortedExpenses.map((e) => (
              <FuelRow key={e.id} expense={e} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
