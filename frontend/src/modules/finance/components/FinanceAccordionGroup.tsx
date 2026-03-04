import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatLocalCurrency } from "@/utils";

export type AccordionRow = {
  id: number;
  label: React.ReactNode;
  value: number;
  extra?: React.ReactNode;
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

export function FinanceAccordionGroup({ groups, defaultOpen }: Props) {
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
          className="border !border-b rounded-md px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="flex justify-between w-full pr-2">
              <span className="font-medium">{group.label}</span>
              <span className="text-muted-foreground font-normal text-sm">
                {formatLocalCurrency(group.total)}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="divide-y">
              {group.rows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-4 py-3" // items-center, gap maior
                >
                  <div className="flex-1 min-w-0">{row.label}</div>

                  <div className="flex items-center gap-2 shrink-0">
                    {" "}
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
