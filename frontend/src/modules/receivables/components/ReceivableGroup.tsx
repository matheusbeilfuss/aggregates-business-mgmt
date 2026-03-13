import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReceivableGroup as ReceivableGroupType, Receivable } from "../types";
import { formatLocalCurrency, formatLocalDate } from "@/utils";
import { ReceivableRow } from "./ReceivableRow";

type Props = {
  group: ReceivableGroupType;
  onAddPayment: (receivable: Receivable) => void;
};

export function ReceivableGroup({ group, onAddPayment }: Props) {
  return (
    <Accordion type="single" collapsible className="border rounded-md">
      <AccordionItem value={group.clientName} className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex flex-1 items-center justify-between pr-4 text-sm md:grid md:grid-cols-[2fr_1fr_1fr] md:gap-x-4">
            <span className="font-medium text-left">{group.clientName}</span>
            <span className="text-muted-foreground text-left">
              Desde {formatLocalDate(group.oldestDate)}
            </span>
            <span className="font-semibold text-orange-500 text-right">
              {formatLocalCurrency(group.total)}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          {group.items.map((r) => (
            <ReceivableRow
              key={r.id}
              receivable={r}
              onAddPayment={onAddPayment}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
