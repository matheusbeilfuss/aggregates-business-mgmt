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
      <AccordionItem value={String(group.clientId)} className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex flex-1 items-center justify-between pr-4 text-sm md:grid md:grid-cols-[2fr_1fr_1fr] md:gap-x-4">
            <div className="flex flex-col gap-0.5 text-left md:contents">
              <span className="font-medium">{group.clientName}</span>
              <span className="text-xs text-muted-foreground md:text-sm">
                Desde {formatLocalDate(group.oldestDate)}
              </span>
            </div>
            <span className="font-semibold text-orange-500 text-right md:text-right">
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
