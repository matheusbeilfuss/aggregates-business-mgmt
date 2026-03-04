import { useMemo } from "react";
import { Payment } from "../types";
import { PaymentMethodEnum } from "@/types";
import { FinanceAccordionGroup, AccordionGroup } from "./FinanceAccordionGroup";
import { PaymentRowActions } from "./PaymentRowActions";
import { paymentMethodLabel } from "../utils/labels";
import { PaymentRowLabel } from "./PaymentRowLabel";
import { FinanceTotalBar } from "./FinanceTotalBar";

type PaymentsTabProps = {
  payments: Payment[];
  onRefetch: () => void;
};

const PAYMENT_GROUP_ORDER: PaymentMethodEnum[] = [
  PaymentMethodEnum.PIX,
  PaymentMethodEnum.BANK_TRANSFER,
  PaymentMethodEnum.CASH,
  PaymentMethodEnum.CHECK,
  PaymentMethodEnum.CREDIT_CARD,
  PaymentMethodEnum.DEBIT_CARD,
  PaymentMethodEnum.BANK_SLIP,
];

export function PaymentsTab({ payments, onRefetch }: PaymentsTabProps) {
  const groups = useMemo<AccordionGroup[]>(() => {
    const map = new Map<PaymentMethodEnum, Payment[]>();

    for (const payment of payments) {
      const existing = map.get(payment.paymentMethod) ?? [];
      map.set(payment.paymentMethod, [...existing, payment]);
    }

    return PAYMENT_GROUP_ORDER.filter((key) => map.has(key)).map((key) => {
      const rows = map.get(key)!;
      const total = rows.reduce((acc, p) => acc + Number(p.paymentValue), 0);

      return {
        key,
        label: paymentMethodLabel[key],
        total,
        rows: rows.map((p) => ({
          id: p.id,
          label: <PaymentRowLabel payment={p} />,
          value: Number(p.paymentValue),
          extra: <PaymentRowActions payment={p} onSuccess={onRefetch} />,
        })),
      };
    });
  }, [payments, onRefetch]);

  const total = useMemo(
    () => payments.reduce((acc, p) => acc + Number(p.paymentValue), 0),
    [payments],
  );

  return (
    <div className="flex flex-col gap-2 py-4">
      <FinanceAccordionGroup
        groups={groups}
        defaultOpen={groups.map((g) => g.key)}
      />
      <FinanceTotalBar label="Total" value={total} variant="income" />
    </div>
  );
}
