import { ExpenseTypeEnum } from "@/types";

export const expenseTypeLabel: Record<ExpenseTypeEnum, string> = {
  [ExpenseTypeEnum.VARIABLE]: "Variáveis",
  [ExpenseTypeEnum.FIXED]: "Fixas",
  [ExpenseTypeEnum.FUEL]: "Combustível",
};
