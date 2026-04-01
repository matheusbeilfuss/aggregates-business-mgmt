import { useMemo, useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { PageContainer } from "@/components/shared/PageContainer";
import { LoadingState } from "@/components/shared/LoadingState";
import { SummaryCard } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatLocalCurrency } from "@/utils";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PeriodPicker } from "@/components/shared/PeriodPicker";
import { PaymentsTab } from "../components/PaymentsTab";
import { ExpensesTab } from "../components/ExpensesTab";
import { useFinanceExpenses, useFinancePayments } from "../hooks";
import { DatePeriod, PaymentStatusEnum } from "@/types";
import { useSearchParams } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function Finance() {
  usePageTitle("Financeiro");

  const [searchParams, setSearchParams] = useSearchParams();

  const VALID_TABS = ["incomes", "expenses"] as const;
  type Tab = (typeof VALID_TABS)[number];

  function parseTab(value: string | null): Tab {
    if (value && (VALID_TABS as readonly string[]).includes(value))
      return value as Tab;
    return "incomes";
  }

  const activeTab = parseTab(searchParams.get("tab"));

  const [period, setPeriod] = useState<DatePeriod>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  const {
    data: payments,
    loading: loadingPayments,
    error: paymentsError,
    refetch: refetchPayments,
  } = useFinancePayments(period);

  const {
    data: expenses,
    loading: loadingExpenses,
    error: expensesError,
    refetch: refetchExpenses,
  } = useFinanceExpenses(period);

  const totalIncome = useMemo(
    () => payments?.reduce((acc, p) => acc + Number(p.paymentValue), 0) ?? 0,
    [payments],
  );

  const totalExpenses = useMemo(
    () =>
      expenses
        ?.filter((e) => e.paymentStatus === PaymentStatusEnum.PAID)
        .reduce((acc, e) => acc + Number(e.expenseValue), 0) ?? 0,
    [expenses],
  );

  const balance = totalIncome - totalExpenses;
  const error = paymentsError || expensesError;
  const loading = loadingPayments || loadingExpenses;

  return (
    <PageContainer
      title="Financeiro"
      actions={<PeriodPicker period={period} onChange={setPeriod} />}
    >
      {error && (
        <p className="text-sm text-destructive mb-4">{error.message}</p>
      )}

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-6">
          <SummaryCard
            label="Entradas"
            value={formatLocalCurrency(totalIncome)}
            icon={TrendingUp}
            iconBg="#dcfce7"
            iconColor="#15803d"
            valueColor="#15803d"
          />

          <SummaryCard
            label="Saídas"
            value={formatLocalCurrency(totalExpenses)}
            icon={TrendingDown}
            iconBg="var(--color-secondary-90)"
            iconColor="var(--color-secondary-40)"
            valueColor="var(--color-secondary-40)"
          />

          <SummaryCard
            label="Saldo"
            value={formatLocalCurrency(balance)}
            icon="="
            iconBg={
              balance >= 0
                ? "var(--color-primary-90)"
                : "var(--color-error-container)"
            }
            iconColor={
              balance >= 0 ? "var(--color-primary-40)" : "var(--color-error)"
            }
            valueColor={
              balance >= 0 ? "var(--color-primary-40)" : "var(--color-error)"
            }
            className="col-span-2 md:col-span-1"
          />
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setSearchParams({ tab: v })}
        >
          <TabsList className="w-full border border-border p-0.5 rounded-lg">
            <TabsTrigger
              value="incomes"
              className="flex-1 data-[state=inactive]:text-muted-foreground
                         data-[state=active]:shadow-sm"
            >
              Entradas
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="flex-1 data-[state=inactive]:text-muted-foreground
                         data-[state=active]:shadow-sm"
            >
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
