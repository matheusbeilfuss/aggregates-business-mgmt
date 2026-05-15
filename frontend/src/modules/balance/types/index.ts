export type MonthlyBalance = {
  month: number;
  monthLabel: string;
  expenses: number;
  income: number;
  profit: number;
  sales: number;
};

export type BalanceSummary = {
  totalExpenses: number;
  totalIncome: number;
  totalProfit: number;
  totalSales: number;
  avgExpenses: number;
  avgIncome: number;
  avgProfit: number;
  avgSales: number;
};

export type ExpenseCategoryBalance = {
  category: string;
  total: number;
};

export type ProductBalance = {
  productName: string;
  categoryName: string;
  totalValue: number;
};

export type MonthlySales = {
  month: number;
  totalSales: number;
};
