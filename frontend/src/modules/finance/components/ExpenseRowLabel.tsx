import { PaymentStatusEnum } from "@/types";
import { Expense } from "../types";
import { formatLocalDate } from "@/utils/";

type ExpenseRowLabelProps = {
  expense: Expense;
};

export function ExpenseRowLabel({ expense }: ExpenseRowLabelProps) {
  const isPending = expense.paymentStatus === PaymentStatusEnum.PENDING;

  return (
    <div className="flex flex-col gap-1 w-full text-sm md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:gap-x-4 md:items-center">
      <span className="font-medium">{expense.name}</span>

      <span className="text-muted-foreground">{expense.category ?? "—"}</span>

      <span className="text-muted-foreground">
        Criada em {formatLocalDate(expense.date)}
      </span>

      <span className="text-muted-foreground">
        {expense.paymentDate
          ? `Paga em ${formatLocalDate(expense.paymentDate)}`
          : "-"}
      </span>

      <span className="text-xs font-medium md:w-32 md:text-right">
        {isPending && expense.dueDate && (
          <span className="text-orange-500">
            Vence em {formatLocalDate(expense.dueDate)}
          </span>
        )}
      </span>
    </div>
  );
}
