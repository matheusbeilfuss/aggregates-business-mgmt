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
    <Accordion
      type="single"
      collapsible
      className="rounded-xl border overflow-hidden bg-background"
    >
      <AccordionItem value={String(group.clientId)} className="border-0">
        <AccordionTrigger
          className="px-4 py-3 hover:no-underline [&>svg]:self-center [&>svg]:mt-0"
          style={{ backgroundColor: "var(--color-primary-90)" }}
        >
          <div className="flex flex-1 items-center justify-between pr-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 min-w-0">
              <span
                className="font-semibold truncate"
                style={{ color: "var(--color-primary-10)" }}
              >
                {group.clientName}
              </span>
              <span
                className="text-xs shrink-0"
                style={{ color: "var(--color-primary-40)" }}
              >
                <span className="hidden sm:inline">&middot; </span>desde{" "}
                {formatLocalDate(group.oldestDate)}
              </span>
            </div>
            <span
              className="font-semibold tabular-nums text-right shrink-0 ml-4"
              style={{ color: "var(--color-primary-40)" }}
            >
              {formatLocalCurrency(group.total)}
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pb-0">
          <div className="divide-y">
            {group.items.map((r) => (
              <ReceivableRow
                key={r.id}
                receivable={r}
                onAddPayment={onAddPayment}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
