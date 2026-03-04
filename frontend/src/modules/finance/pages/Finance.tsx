import { useMemo, useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";

import { PageContainer } from "@/components/shared/PageContainer";
import { LoadingState } from "@/components/shared/LoadingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/money";
import { usePageTitle } from "@/hooks/usePageTitle";

import { FinancePeriodPicker } from "../components/FinancePeriodPicker";
import { PaymentsTab } from "../components/PaymentsTab";
import { ExpensesTab } from "../components/ExpensesTab";
import { useFinanceExpenses, useFinancePayments } from "../hooks";
import { FinancePeriod } from "../types";

export default function Finance() {
  usePageTitle("Financeiro");

  const [period, setPeriod] = useState<FinancePeriod>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });
  const [activeTab, setActiveTab] = useState<"incomes" | "expenses">("incomes");

  const {
    data: payments,
    loading: loadingPayments,
    refetch: refetchPayments,
  } = useFinancePayments(period);

  const {
    data: expenses,
    loading: loadingExpenses,
    refetch: refetchExpenses,
  } = useFinanceExpenses(period);

  const totalIncome = useMemo(
    () => payments?.reduce((acc, p) => acc + Number(p.paymentValue), 0) ?? 0,
    [payments],
  );

  const totalExpenses = useMemo(
    () =>
      expenses
        ?.filter((e) => e.paymentStatus === "PAID")
        .reduce((acc, e) => acc + Number(e.expenseValue), 0) ?? 0,
    [expenses],
  );

  const balance = totalIncome - totalExpenses;

  const loading = loadingPayments || loadingExpenses;

  return (
    <PageContainer title="Financeiro">
      <div className="flex flex-col items-center gap-2 pb-7 px-4 mb-4">
        <FinancePeriodPicker period={period} onChange={setPeriod} />
        {!loading && (
          <span
            className={`text-3xl font-bold pt-7 ${balance >= 0 ? "text-blue-500" : "text-orange-500"}`}
          >
            {formatCurrency(balance)}
          </span>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="incomes" className="flex-1">
              Entradas
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex-1">
              Saídas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incomes">
            <PaymentsTab
              payments={payments ?? []}
              onRefetch={refetchPayments}
            />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpensesTab
              expenses={expenses ?? []}
              onRefetch={refetchExpenses}
            />
          </TabsContent>
        </Tabs>
      )}
    </PageContainer>
  );
}
