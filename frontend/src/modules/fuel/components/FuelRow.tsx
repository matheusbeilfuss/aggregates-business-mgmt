import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FuelExpense } from "../types";
import {
  formatLocalCurrency,
  formatLocalDate,
  paymentStatusLabel,
  paymentStatusStyle,
} from "@/utils";

type Props = {
  expense: FuelExpense;
};

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 bg-background">
      <span
        className="text-[10px] font-medium uppercase tracking-wide"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        {label}
      </span>
      <span className="text-sm font-medium tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

export function FuelRow({ expense }: Props) {
  const litersLabel = expense.liters != null ? `${expense.liters} L` : null;
  const statusStyle = paymentStatusStyle[expense.paymentStatus];

  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-xl border overflow-hidden bg-background"
    >
      <AccordionItem value={String(expense.id)} className="border-0">
        <AccordionTrigger
          className="px-4 py-3 hover:no-underline [&>svg]:self-center"
          style={{ backgroundColor: "var(--color-primary-90)" }}
        >
          <div className="flex flex-1 items-center justify-between pr-2 text-sm">
            <div className="flex flex-col gap-0.5 text-left sm:flex-row sm:items-center sm:gap-1 min-w-0">
              <span
                className="font-semibold shrink-0"
                style={{ color: "var(--color-primary-40)" }}
              >
                {formatLocalDate(expense.date)}
              </span>
              {expense.vehicle && (
                <span
                  className="text-xs truncate"
                  style={{ color: "var(--color-primary-40)" }}
                >
                  <span className="hidden sm:inline"> · </span>{" "}
                  {expense.vehicle}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-4">
              {litersLabel && (
                <span
                  className="text-xs hidden sm:block"
                  style={{ color: "var(--color-primary-40)" }}
                >
                  {litersLabel}
                </span>
              )}
              <span
                className="font-semibold tabular-nums"
                style={{ color: "var(--color-primary-40)" }}
              >
                {formatLocalCurrency(expense.expenseValue)}
              </span>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pb-0">
          <div
            className="grid grid-cols-2 md:grid-cols-3 divide-y
             [&>*]:border-r
             [&>*:nth-child(2n)]:border-r-0
             md:[&>*:nth-child(2n)]:border-r
             md:[&>*:nth-child(3n)]:border-r-0"
            style={{ borderColor: "var(--color-outline-variant)" }}
          >
            {expense.pricePerLiter != null && (
              <Metric
                label="Preço por litro"
                value={formatLocalCurrency(expense.pricePerLiter)}
              />
            )}
            {expense.liters != null && (
              <Metric label="Litros" value={`${expense.liters} L`} />
            )}
            {expense.kmDriven != null && (
              <Metric label="Km rodados" value={`${expense.kmDriven} km`} />
            )}
            {expense.fuelSupplier && (
              <Metric label="Estabelecimento" value={expense.fuelSupplier} />
            )}
            {expense.vehicle && (
              <Metric label="Veículo" value={expense.vehicle} />
            )}
            <Metric
              label="Valor total"
              value={formatLocalCurrency(expense.expenseValue)}
            />
            <div className="flex flex-col gap-0.5 px-4 py-3 bg-background !border-r-0">
              <span
                className="text-[10px] font-medium uppercase tracking-wide"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Status
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full w-fit"
                style={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color,
                }}
              >
                {paymentStatusLabel[expense.paymentStatus] ??
                  expense.paymentStatus}
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
