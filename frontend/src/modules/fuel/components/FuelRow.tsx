import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FuelExpense } from "@/modules/finance/types";
import {
  formatLocalCurrency,
  formatLocalDate,
  paymentStatusColor,
  paymentStatusLabel,
} from "@/utils";

type Props = {
  expense: FuelExpense;
};

export function FuelRow({ expense }: Props) {
  const litersLabel = expense.liters != null ? `${expense.liters} L` : null;

  return (
    <Accordion type="single" collapsible className="border rounded-md">
      <AccordionItem value={String(expense.id)} className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex flex-1 items-center justify-between pr-4 text-sm md:grid md:grid-cols-4 md:gap-x-4">
            <div className="flex flex-col gap-0.5 text-left md:contents">
              <span>{formatLocalDate(expense.date)}</span>
              <span>{expense.vehicle ?? "-"}</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right md:contents">
              <span className="text-right">{litersLabel ?? "-"}</span>
              <span className="text-right">
                {formatLocalCurrency(expense.expenseValue)}
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3 text-sm md:grid-cols-3">
            {expense.pricePerLiter != null && (
              <div>
                <p className="text-xs text-muted-foreground">Preço por litro</p>
                <p>{formatLocalCurrency(expense.pricePerLiter)}</p>
              </div>
            )}
            {expense.liters != null && (
              <div>
                <p className="text-xs text-muted-foreground">Litros</p>
                <p>{expense.liters} L</p>
              </div>
            )}
            {expense.kmDriven != null && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Quilômetros rodados
                </p>
                <p>{expense.kmDriven} km</p>
              </div>
            )}
            {expense.fuelSupplier && (
              <div>
                <p className="text-xs text-muted-foreground">Estabelecimento</p>
                <p>{expense.fuelSupplier}</p>
              </div>
            )}
            {expense.vehicle && (
              <div>
                <p className="text-xs text-muted-foreground">Veículo</p>
                <p>{expense.vehicle}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p
                className={`font-medium ${paymentStatusColor[expense.paymentStatus] ?? ""}`}
              >
                {paymentStatusLabel[expense.paymentStatus] ??
                  expense.paymentStatus}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Valor total</p>
              <p className="font-medium">
                {formatLocalCurrency(expense.expenseValue)}
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
