import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Expense } from "../types";
import { ExpenseTypeEnum, PaymentStatusEnum } from "@/types";
import { Button } from "@/components/ui/button";
import { FinanceAccordionGroup, AccordionGroup } from "./FinanceAccordionGroup";
import { ExpenseRowActions } from "./ExpenseRowActions";
import { expenseTypeLabel } from "../utils/labels";
import { ExpenseRowLabel } from "./ExpenseRowLabel";

type Props = {
  expenses: Expense[];
  onRefetch: () => void;
};

const PAID_TYPE_ORDER = [ExpenseTypeEnum.VARIABLE, ExpenseTypeEnum.FIXED];

export function ExpensesTab({ expenses, onRefetch }: Props) {
  const navigate = useNavigate();

  const sortedExpenses = useMemo(
    () => [...expenses].sort((a, b) => a.date.localeCompare(b.date)),
    [expenses],
  );

  const paidExpenses = useMemo(
    () =>
      sortedExpenses.filter((e) => e.paymentStatus === PaymentStatusEnum.PAID),
    [sortedExpenses],
  );

  const pendingExpenses = useMemo(
    () =>
      sortedExpenses.filter(
        (e) => e.paymentStatus === PaymentStatusEnum.PENDING,
      ),
    [sortedExpenses],
  );

  const paidGroups = useMemo<AccordionGroup[]>(() => {
    const map = new Map<ExpenseTypeEnum, Expense[]>();

    for (const expense of paidExpenses) {
      const key =
        expense.type === ExpenseTypeEnum.FUEL
          ? ExpenseTypeEnum.VARIABLE
          : expense.type;
      const existing = map.get(key);
      if (existing) existing.push(expense);
      else map.set(key, [expense]);
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

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex justify-end mb-2">
        <Button
          onClick={() => navigate("expenses/add")}
          className="h-9 px-4 text-sm font-medium text-white gap-1.5
                   hover:opacity-90 active:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--color-primary-40)" }}
        >
          <Plus className="h-4 w-4" />
          Adicionar saída
        </Button>
      </div>

      <FinanceAccordionGroup groups={paidGroups} />

      {pendingGroups.length > 0 && (
        <div>
          <FinanceAccordionGroup
            groups={pendingGroups}
            defaultOpen={["PENDING"]}
          />
        </div>
      )}
    </div>
  );
}
