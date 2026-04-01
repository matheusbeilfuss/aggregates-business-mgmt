import { PaymentStatusEnum } from "@/types";
import { Expense } from "../types";
import { formatLocalDate } from "@/utils";

type ExpenseRowLabelProps = {
  expense: Expense;
};

export function ExpenseRowLabel({ expense }: ExpenseRowLabelProps) {
  const isPending = expense.paymentStatus === PaymentStatusEnum.PENDING;

  return (
    <div className="flex flex-col gap-1 w-full text-sm md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:gap-x-4 md:items-center">
      <span className="font-medium text-foreground">{expense.name}</span>

      <span className="text-muted-foreground text-xs">
        {expense.category ?? "—"}
      </span>

      <span className="text-muted-foreground text-xs">
        Criada em {formatLocalDate(expense.date)}
      </span>

      <span className="text-muted-foreground text-xs">
        {expense.paymentDate
          ? `Paga em ${formatLocalDate(expense.paymentDate)}`
          : "—"}
      </span>

      <span className="text-xs font-medium md:text-right shrink-0">
        {isPending && expense.dueDate && (
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--color-secondary-90)",
              color: "var(--color-secondary-40)",
            }}
          >
            Vence em {formatLocalDate(expense.dueDate)}
          </span>
        )}
      </span>
    </div>
  );
}
