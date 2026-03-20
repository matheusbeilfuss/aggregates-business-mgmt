export type MonthlyBalance = {
  month: number;
  monthLabel: string;
  expenses: number;
  income: number;
  profit: number;
};

export type BalanceSummary = {
  totalExpenses: number;
  totalIncome: number;
  totalProfit: number;
  avgExpenses: number;
  avgIncome: number;
  avgProfit: number;
};
