import { PaymentStatusEnum } from "@/types";
import { Expense } from "../types";
import { formatLocalDate } from "@/utils/";

type ExpenseRowLabelProps = {
  expense: Expense;
};

export function ExpenseRowLabel({ expense }: ExpenseRowLabelProps) {
  const isPending = expense.paymentStatus === PaymentStatusEnum.PENDING;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 w-full text-sm">
      <span className="font-medium flex items-center gap-2">
        {expense.name}
      </span>

      {expense.category && (
        <span className="text-muted-foreground">{expense.category}</span>
      )}

      <span className="text-muted-foreground">
        Criada em {formatLocalDate(expense.date)}
      </span>

      {expense.paymentDate && (
        <span className="text-muted-foreground">
          Paga em {formatLocalDate(expense.paymentDate)}
        </span>
      )}

      {isPending && expense.dueDate && (
        <span className="text-xs font-medium text-orange-500">
          Vence em {formatLocalDate(expense.dueDate)}
        </span>
      )}
    </div>
  );
}
