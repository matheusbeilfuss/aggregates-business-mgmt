import { useMemo } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useOrders } from "@/modules/order/hooks/useOrders";
import { useStocks } from "@/modules/stock/hooks";
import { useReceivables } from "@/modules/receivables/hooks/useReceivables";
import { useFinanceExpenses } from "@/modules/finance/hooks/useFinanceExpenses";
import { useFinancePayments } from "@/modules/finance/hooks/useFinancePayments";
import { PaymentStatusEnum } from "@/types";
import { toIsoDate } from "@/utils";

export function useHomeData() {
  const today = useMemo(() => new Date(), []);
  const startDate = useMemo(() => startOfMonth(today), [today]);
  const endDate = useMemo(() => endOfMonth(today), [today]);

  const monthLabel = format(today, "MMMM 'de' yyyy", { locale: ptBR });
  const monthLabelCapitalized =
    monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const { data: orders, loading: loadingOrders } = useOrders(toIsoDate(today));

  const { data: stocks, loading: loadingStocks } = useStocks();

  const { data: receivables, loading: loadingReceivables } = useReceivables({
    startDate,
    endDate,
  });

  const { data: expenses, loading: loadingExpenses } = useFinanceExpenses({
    startDate,
    endDate,
  });

  const { data: payments, loading: loadingPayments } = useFinancePayments({
    startDate,
    endDate,
  });

  const topOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders]
      .filter((o) => o.status === "PENDING")
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
      .slice(0, 3);
  }, [orders]);

  const lowStocks = useMemo(() => {
    if (!stocks) return [];
    return [...stocks].sort((a, b) => a.m3Quantity - b.m3Quantity).slice(0, 3);
  }, [stocks]);

  const topReceivables = useMemo(() => {
    if (!receivables) return [];
    return [...receivables]
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
      .slice(0, 3);
  }, [receivables]);

  const balance = useMemo(() => {
    const totalIncome =
      payments?.reduce((acc, p) => acc + Number(p.paymentValue), 0) ?? 0;
    const totalExpenses =
      expenses
        ?.filter((e) => e.paymentStatus === PaymentStatusEnum.PAID)
        .reduce((acc, e) => acc + Number(e.expenseValue), 0) ?? 0;

    return {
      income: totalIncome,
      expenses: totalExpenses,
      profit: totalIncome - totalExpenses,
    };
  }, [payments, expenses]);

  return {
    monthLabel: monthLabelCapitalized,
    topOrders,
    lowStocks,
    topReceivables,
    balance,
    loading: {
      orders: loadingOrders,
      stocks: loadingStocks,
      receivables: loadingReceivables,
      balance: loadingExpenses || loadingPayments,
    },
  };
}
