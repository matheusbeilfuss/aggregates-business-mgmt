import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Expense } from "../types";
import { ExpenseTypeEnum, PaymentStatusEnum } from "@/types";
import { Button } from "@/components/ui/button";
import { FinanceAccordionGroup, AccordionGroup } from "./FinanceAccordionGroup";
import { ExpenseRowActions } from "./ExpenseRowActions";
import { expenseTypeLabel } from "../utils/labels";
import { ExpenseRowLabel } from "./ExpenseRowLabel";
import { FinanceTotalBar } from "@/components/shared";

type Props = {
  expenses: Expense[];
  onRefetch: () => void;
};

const PAID_TYPE_ORDER = [ExpenseTypeEnum.VARIABLE, ExpenseTypeEnum.FIXED];

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

      const existing = map.get(key);
      if (existing) {
        existing.push(expense);
      } else {
        map.set(key, [expense]);
      }
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
        <FinanceTotalBar label="Total" value={total} variant="expense" />
      )}

      {pendingGroups.length > 0 && (
        <div className="mt-4">
          <FinanceAccordionGroup
            groups={pendingGroups}
            defaultOpen={["PENDING"]}
          />
        </div>
      )}

      <div className="flex justify-end py-5">
        <Button
          onClick={() => navigate("expenses/add")}
          className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base cursor-pointer"
        >
          Adicionar saída
        </Button>
      </div>
    </div>
  );
}
