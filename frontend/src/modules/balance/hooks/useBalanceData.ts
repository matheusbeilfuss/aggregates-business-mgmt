import { useMemo } from "react";
import { useFinanceExpenses } from "@/modules/finance/hooks/useFinanceExpenses";
import { useFinancePayments } from "@/modules/finance/hooks/useFinancePayments";
import { PaymentStatusEnum } from "@/types";
import { MonthlyBalance, BalanceSummary } from "../types";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

type Options = {
  startDate: Date;
  endDate: Date;
};

export function useBalanceData({ startDate, endDate }: Options) {
  const {
    data: expenses,
    loading: loadingExpenses,
    error: expensesError,
  } = useFinanceExpenses({ startDate, endDate });

  const {
    data: payments,
    loading: loadingPayments,
    error: paymentsError,
  } = useFinancePayments({ startDate, endDate });

  const monthlyData = useMemo<MonthlyBalance[]>(() => {
    if (!expenses || !payments) return [];

    const map = new Map<number, { expenses: number; income: number }>();

    for (let m = 1; m <= 12; m++) {
      map.set(m, { expenses: 0, income: 0 });
    }

    for (const expense of expenses) {
      if (expense.paymentStatus !== PaymentStatusEnum.PAID) continue;
      const month = new Date(expense.date + "T00:00:00").getMonth() + 1;
      const entry = map.get(month)!;
      entry.expenses += Number(expense.expenseValue);
    }

    for (const payment of payments) {
      const month = new Date(payment.date + "T00:00:00").getMonth() + 1;
      const entry = map.get(month)!;
      entry.income += Number(payment.paymentValue);
    }

    return Array.from(map.entries()).map(([month, data]) => ({
      month,
      monthLabel: MONTH_LABELS[month - 1],
      expenses: data.expenses,
      income: data.income,
      profit: data.income - data.expenses,
    }));
  }, [expenses, payments]);

  const summary = useMemo<BalanceSummary>(() => {
    const nonEmptyMonths =
      monthlyData.filter((m) => m.expenses > 0 || m.income > 0).length || 1;

    const totalExpenses = monthlyData.reduce((acc, m) => acc + m.expenses, 0);
    const totalIncome = monthlyData.reduce((acc, m) => acc + m.income, 0);
    const totalProfit = totalIncome - totalExpenses;

    return {
      totalExpenses,
      totalIncome,
      totalProfit,
      avgExpenses: totalExpenses / nonEmptyMonths,
      avgIncome: totalIncome / nonEmptyMonths,
      avgProfit: totalProfit / nonEmptyMonths,
    };
  }, [monthlyData]);

  return {
    monthlyData,
    summary,
    loading: loadingExpenses || loadingPayments,
    error: expensesError || paymentsError,
  };
}
