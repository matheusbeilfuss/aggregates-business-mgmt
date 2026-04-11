import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatLocalCurrency } from "@/utils";
import type { ReactNode } from "react";

export type AccordionRow = {
  id: number;
  label: ReactNode;
  value: number;
  extra?: ReactNode;
};

export type AccordionGroup = {
  key: string;
  label: string;
  total: number;
  rows: AccordionRow[];
};

type Props = {
  groups: AccordionGroup[];
  defaultOpen?: string[];
};

export function FinanceAccordionGroup({ groups, defaultOpen = [] }: Props) {
  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpen}
      className="w-full space-y-2"
    >
      {groups.map((group) => (
        <AccordionItem
          key={group.key}
          value={group.key}
          className="border rounded-xl overflow-hidden !border-b bg-background"
        >
          <AccordionTrigger
            className="hover:no-underline px-4 py-3"
            style={{ backgroundColor: "var(--color-primary-90)" }}
          >
            <span className="flex justify-between w-full pr-2">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--color-primary-40)" }}
              >
                {group.label}
              </span>
              <span
                className="text-sm tabular-nums font-medium"
                style={{ color: "var(--color-primary-40)" }}
              >
                {formatLocalCurrency(group.total)}
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="pb-0">
            <div className="divide-y">
              {group.rows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-4 px-4 py-3
                             transition-colors hover:bg-accent/50"
                >
                  <div className="flex-1 min-w-0">{row.label}</div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-medium tabular-nums">
                      {formatLocalCurrency(row.value)}
                    </span>
                    {row.extra}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
