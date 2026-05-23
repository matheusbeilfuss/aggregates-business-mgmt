import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriceCategory } from "../types";
import { formatLocalCurrency } from "@/utils";
import { CategoryActions } from "./CategoryActions";
import { TagsIcon } from "lucide-react";

interface PriceTableProps {
  prices: PriceCategory[];
  onRenameCategory: (id: number, currentName: string) => void;
  onDeleteCategory: (id: number, name: string) => void;
}

export function PriceTable({
  prices,
  onRenameCategory,
  onDeleteCategory,
}: PriceTableProps) {
  const grouped = prices.reduce<
    Record<number, { name: string; prices: Record<number, PriceCategory> }>
  >((acc, price) => {
    const { id, name } = price.category;
    if (!acc[id]) acc[id] = { name, prices: {} };
    acc[id].prices[price.m3Volume] = price;
    return acc;
  }, {});

  const volumes = [...new Set(prices.map((p) => p.m3Volume))]
    .filter((v) => v !== 0)
    .sort((a, b) => a - b);

  const totalCategories = Object.keys(grouped).length;

  if (prices.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 py-16
                   rounded-xl border border-dashed"
        style={{ borderColor: "var(--color-outline-variant)" }}
      >
        <TagsIcon
          className="h-6 w-6"
          style={{ color: "var(--color-on-surface-variant)" }}
        />
        <p
          className="text-sm"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Nenhuma categoria de preço cadastrada.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-x-auto overflow-y-auto max-h-[600px] w-full">
      <Table
        className="table-fixed"
        style={{ minWidth: `${140 + 110 + volumes.length * 100 + 44}px` }}
      >
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border [transition:none]">
            <TableHead
              className="sticky left-0 top-0 z-20 w-[140px] text-xs font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: "var(--color-primary-90)",
                color: "var(--color-primary-40)",
              }}
            >
              Categoria
            </TableHead>

            <TableHead
              className="sticky top-0 z-10 w-[110px] text-xs font-semibold uppercase tracking-wide text-right"
              style={{
                backgroundColor: "var(--color-primary-90)",
                color: "var(--color-primary-40)",
              }}
            >
              Depósito
            </TableHead>

            {volumes.map((v) => {
              const covered = Object.values(grouped).filter(
                (g) => g.prices[v],
              ).length;
              return (
                <TableHead
                  key={v}
                  className="sticky top-0 z-10 w-[100px] text-xs font-semibold uppercase tracking-wide text-right"
                  style={{
                    backgroundColor: "var(--color-primary-90)",
                    color: "var(--color-primary-40)",
                  }}
                >
                  <div className="flex flex-col items-end gap-0.5">
                    <span>{v} m³</span>
                    {covered < totalCategories && (
                      <span
                        className="text-[10px] font-normal normal-case tracking-normal"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        {covered}/{totalCategories}
                      </span>
                    )}
                  </div>
                </TableHead>
              );
            })}

            <TableHead
              className="sticky top-0 z-10 w-11"
              style={{
                backgroundColor: "var(--color-primary-90)",
                color: "var(--color-primary-40)",
              }}
            />
          </TableRow>
        </TableHeader>

        <TableBody>
          {Object.entries(grouped).map(
            ([categoryId, { name, prices: categoryPrices }]) => {
              const allPrices = [
                categoryPrices[0]?.price ?? 0,
                ...volumes.map((v) => categoryPrices[v]?.price ?? 0),
              ];
              const allZero = allPrices.every((p) => p === 0);

              return (
                <TableRow
                  key={categoryId}
                  className="cursor-default group bg-background hover:bg-transparent [transition:none]"
                >
                  <TableCell
                    className="sticky left-0 z-10 w-[140px] text-sm whitespace-normal
             break-words bg-background group-hover:bg-accent/50"
                  >
                    <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                      <span className="font-medium">{name}</span>
                      {allZero && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: "var(--color-secondary-90)",
                            color: "var(--color-secondary-40)",
                          }}
                        >
                          Sem preço
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right group-hover:bg-accent/50">
                    {(categoryPrices[0]?.price ?? 0) === 0 ? (
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {formatLocalCurrency(0)}
                      </span>
                    ) : (
                      <span className="text-sm tabular-nums">
                        {formatLocalCurrency(categoryPrices[0].price)}
                      </span>
                    )}
                  </TableCell>

                  {volumes.map((v) => {
                    const price = categoryPrices[v]?.price ?? 0;
                    return (
                      <TableCell
                        key={v}
                        className="text-right group-hover:bg-accent/50"
                      >
                        {categoryPrices[v] ? (
                          price === 0 ? (
                            <span className="text-sm tabular-nums text-muted-foreground">
                              {formatLocalCurrency(0)}
                            </span>
                          ) : (
                            <span className="text-sm tabular-nums">
                              {formatLocalCurrency(price)}
                            </span>
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                    );
                  })}

                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    className="w-11 group-hover:bg-accent/50"
                  >
                    <div className="flex justify-end">
                      <CategoryActions
                        categoryId={categoryId}
                        onRename={() =>
                          onRenameCategory(Number(categoryId), name)
                        }
                        onDelete={() =>
                          onDeleteCategory(Number(categoryId), name)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            },
          )}
        </TableBody>
      </Table>
    </div>
  );
}
