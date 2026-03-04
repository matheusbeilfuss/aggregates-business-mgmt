import { useMemo } from "react";
import { Payment } from "../types";
import { PaymentMethodEnum, OrderTypeEnum, PaymentStatusEnum } from "@/types";
import { formatCurrency } from "@/utils/money";
import { FinanceAccordionGroup, AccordionGroup } from "./FinanceAccordionGroup";
import { PaymentRowActions } from "./PaymentRowActions";
import { paymentMethodLabel } from "../utils/labels";

type Props = {
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

function PaymentRowLabel({ payment }: { payment: Payment }) {
  const isService = payment.order.type === OrderTypeEnum.SERVICE;

  const description = isService
    ? (payment.order.service ?? `Pedido #${payment.order.id}`)
    : (payment.order.product?.name ?? `Pedido #${payment.order.id}`);

  const quantity =
    !isService && payment.order.m3Quantity != null
      ? `${payment.order.m3Quantity} m³`
      : null;

  const isPaid = payment.order.paymentStatus === PaymentStatusEnum.PAID;
  const isPartial = payment.order.paymentStatus === PaymentStatusEnum.PARTIAL;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 w-full text-sm">
      <span className="font-medium">{payment.order.client.name}</span>

      <span className="text-muted-foreground flex items-center gap-2">
        {description}
        {quantity && (
          <span className="text-xs rounded bg-muted px-2 py-0.5">
            {quantity}
          </span>
        )}
      </span>

      <span className="text-muted-foreground">Recebido em {payment.date}</span>

      <span className="text-muted-foreground">
        Agendado para {payment.order.scheduledDate}
      </span>

      {isPartial && (
        <span className="text-xs font-medium text-orange-500">
          Parcial · Total {formatCurrency(payment.order.orderValue)}
        </span>
      )}

      {isPaid && (
        <span className="text-xs font-medium text-green-500">
          Pedido quitado
        </span>
      )}
    </div>
  );
}

export function PaymentsTab({ payments, onRefetch }: Props) {
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
      <div className="flex justify-between items-center px-4 py-3 mt-2 rounded-md bg-blue-50">
        <span className="font-medium">Total</span>
        <span className="font-semibold">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
