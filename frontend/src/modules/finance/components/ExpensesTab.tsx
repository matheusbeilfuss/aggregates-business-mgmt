import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Expense } from "../types";
import { ExpenseTypeEnum, PaymentStatusEnum } from "@/types";
import { formatCurrency } from "@/utils/money";
import { Button } from "@/components/ui/button";
import { FinanceAccordionGroup, AccordionGroup } from "./FinanceAccordionGroup";
import { ExpenseRowActions } from "./ExpenseRowActions";
import { expenseTypeLabel } from "../utils/labels";

type Props = {
  expenses: Expense[];
  onRefetch: () => void;
};

const PAID_TYPE_ORDER = [ExpenseTypeEnum.VARIABLE, ExpenseTypeEnum.FIXED];

function ExpenseRowLabel({ expense }: { expense: Expense }) {
  const isPending = expense.paymentStatus === PaymentStatusEnum.PENDING;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 w-full text-sm">
      <span className="font-medium flex items-center gap-2">
        {expense.name}
      </span>

      {expense.category && (
        <span className="text-muted-foreground">{expense.category}</span>
      )}

      <span className="text-muted-foreground">Criada em {expense.date}</span>

      {expense.paymentDate && (
        <span className="text-muted-foreground">
          Paga em {expense.paymentDate}
        </span>
      )}

      {isPending && expense.dueDate && (
        <span className="text-xs font-medium text-orange-500">
          Vence em {expense.dueDate}
        </span>
      )}
    </div>
  );
}

export function ExpensesTab({ expenses, onRefetch }: Props) {
  const navigate = useNavigate();

  const paidExpenses = useMemo(
    () => expenses.filter((e) => e.paymentStatus === PaymentStatusEnum.PAID),
    [expenses],
  );

  const pendingExpenses = useMemo(
    () => expenses.filter((e) => e.paymentStatus === PaymentStatusEnum.PENDING),
    [expenses],
  );

  const paidGroups = useMemo<AccordionGroup[]>(() => {
    const map = new Map<ExpenseTypeEnum, Expense[]>();

    for (const expense of paidExpenses) {
      const key =
        expense.type === ExpenseTypeEnum.FUEL
          ? ExpenseTypeEnum.VARIABLE
          : expense.type;

      const existing = map.get(key) ?? [];
      map.set(key, [...existing, expense]);
    }

    return PAID_TYPE_ORDER.filter((type) => map.has(type)).map((type) => {
      const rows = map.get(type)!;
      const total = rows.reduce((acc, e) => acc + Number(e.expenseValue), 0);

      return {
        key: type,
        label: expenseTypeLabel[type],
        total,
        rows: rows.map((e) => ({
          id: e.id,
          label: <ExpenseRowLabel expense={e} />,
          value: Number(e.expenseValue),
          extra: (
            <ExpenseRowActions
              expense={e}
              onSuccess={onRefetch}
              showMarkAsPaid={false}
            />
          ),
        })),
      };
    });
  }, [paidExpenses, onRefetch]);

  const pendingGroups = useMemo<AccordionGroup[]>(() => {
    if (pendingExpenses.length === 0) return [];

    const total = pendingExpenses.reduce(
      (acc, e) => acc + Number(e.expenseValue),
      0,
    );

    return [
      {
        key: "PENDING",
        label: "Pendentes",
        total,
        rows: pendingExpenses.map((e) => ({
          id: e.id,
          label: <ExpenseRowLabel expense={e} />,
          value: Number(e.expenseValue),
          extra: (
            <ExpenseRowActions
              expense={e}
              onSuccess={onRefetch}
              showMarkAsPaid={true}
            />
          ),
        })),
      },
    ];
  }, [pendingExpenses, onRefetch]);

  const total = useMemo(
    () => paidExpenses.reduce((acc, e) => acc + Number(e.expenseValue), 0),
    [paidExpenses],
  );

  return (
    <div className="flex flex-col gap-2 py-4">
      <FinanceAccordionGroup
        groups={paidGroups}
        defaultOpen={paidGroups.map((g) => g.key)}
      />

      {paidGroups.length > 0 && (
        <div className="flex justify-between items-center px-4 py-3 mt-2 rounded-md bg-orange-50">
          <span className="font-medium">Total</span>
          <span className="font-semibold">{formatCurrency(total)}</span>
        </div>
      )}

      {pendingGroups.length > 0 && (
        <div className="mt-4">
          <FinanceAccordionGroup
            groups={pendingGroups}
            defaultOpen={["PENDING"]}
          />
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button onClick={() => navigate("/expenses/add")}>
          Adicionar saída
        </Button>
      </div>
    </div>
  );
}
