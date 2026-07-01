import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Plus, Trash2, PackageX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StockItem } from "../types";
import { Product } from "@/modules/product/types";
import { Fragment } from "react";

const LOW_STOCK_THRESHOLD = 5;

interface StockTableProps {
  stocks: StockItem[];
  onDeleteProduct: (product: Product) => void;
}

export function StockTable({ stocks, onDeleteProduct }: StockTableProps) {
  const navigate = useNavigate();

  const grouped = stocks.reduce<
    Record<number, { categoryName: string; items: StockItem[] }>
  >((acc, stock) => {
    const categoryId = stock.product.category?.id ?? -1;
    const categoryName = stock.product.category?.name ?? "Sem categoria";
    if (!acc[categoryId]) acc[categoryId] = { categoryName, items: [] };
    acc[categoryId].items.push(stock);
    return acc;
  }, {});

  const soloItems: StockItem[] = [];
  const normalGroups: { categoryName: string; items: StockItem[] }[] = [];

  Object.values(grouped).forEach(({ categoryName, items }) => {
    const isSolo =
      items.length === 1 &&
      items[0].product.category != null &&
      items[0].product.name === categoryName;

    if (isSolo) {
      soloItems.push(items[0]);
    } else {
      normalGroups.push({
        categoryName,
        items: [...items].sort((a, b) =>
          a.product.name.localeCompare(b.product.name, "pt-BR"),
        ),
      });
    }
  });

  normalGroups.sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName, "pt-BR"),
  );

  soloItems.sort((a, b) =>
    a.product.name.localeCompare(b.product.name, "pt-BR"),
  );

  const allGroups = [
    ...normalGroups,
    ...(soloItems.length > 0
      ? [{ categoryName: "Individuais", items: soloItems }]
      : []),
  ];

  if (stocks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 py-16
                   rounded-xl border border-dashed"
        style={{ borderColor: "var(--color-outline-variant)" }}
      >
        <PackageX
          className="h-6 w-6"
          style={{ color: "var(--color-on-surface-variant)" }}
        />
        <p
          className="text-sm"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Nenhum item no estoque.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-x-auto overflow-y-auto max-h-[600px] md:max-h-none">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead
              className="px-4 text-xs font-semibold uppercase tracking-wide sticky left-0 top-0 z-20 w-[140px] md:w-auto"
              style={{
                backgroundColor: "var(--color-primary-90)",
                color: "var(--color-primary-40)",
              }}
            >
              Material
            </TableHead>
            <TableHead
              className="px-4 text-xs font-semibold uppercase tracking-wide text-right sticky top-0 z-10"
              style={{
                backgroundColor: "var(--color-primary-90)",
                color: "var(--color-primary-40)",
              }}
            >
              Toneladas
            </TableHead>
            <TableHead
              className="px-4 text-xs font-semibold uppercase tracking-wide text-right sticky top-0 z-10"
              style={{
                backgroundColor: "var(--color-primary-90)",
                color: "var(--color-primary-40)",
              }}
            >
              M³
            </TableHead>
            <TableHead
              className="px-4 text-xs font-semibold uppercase tracking-wide text-right sticky top-0 z-10"
              style={{
                backgroundColor: "var(--color-primary-90)",
                color: "var(--color-primary-40)",
              }}
            >
              Densidade
            </TableHead>
            <TableHead
              className="w-10 sticky top-0 z-10"
              style={{ backgroundColor: "var(--color-primary-90)" }}
            />
          </TableRow>
        </TableHeader>

        <TableBody>
          {allGroups.map(({ categoryName, items }, groupIndex) => (
            <Fragment key={`${categoryName}-${groupIndex}`}>
              <TableRow className="hover:bg-transparent border-0">
                <TableCell
                  className="py-0 px-0 sticky left-0 z-10"
                  style={{ minWidth: 0 }}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-2 border-l-2"
                    style={{
                      borderLeftColor: "var(--color-primary-40)",
                      backgroundColor: "var(--color-surface-container)",
                    }}
                  >
                    <span
                      className="text-[11px] font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-primary-40)" }}
                    >
                      {categoryName}
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  colSpan={4}
                  className="py-0 px-0"
                  style={{ backgroundColor: "var(--color-surface-container)" }}
                />
              </TableRow>

              {items.map((stock) => (
                <TableRow
                  key={stock.id}
                  className="cursor-default table-row [transition:none]"
                >
                  <TableCell className="px-4 sticky left-0 z-10 w-[140px] md:w-auto whitespace-normal break-words [transition:none]">
                    <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {stock.product.name}
                      </span>
                      {stock.m3Quantity != null &&
                        stock.m3Quantity <= LOW_STOCK_THRESHOLD && (
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: "var(--color-secondary-90)",
                              color: "var(--color-secondary-40)",
                            }}
                          >
                            Estoque baixo
                          </span>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 text-right [transition:none]">
                    {stock.tonQuantity != null ? (
                      <span className="text-sm tabular-nums">
                        {stock.tonQuantity.toFixed(2)}{" "}
                        <span className="text-xs text-muted-foreground">
                          ton
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 text-right [transition:none]">
                    {stock.m3Quantity != null ? (
                      <span className="text-sm tabular-nums">
                        {stock.m3Quantity.toFixed(2)}{" "}
                        <span className="text-xs text-muted-foreground">
                          m³
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 text-right [transition:none]">
                    {stock.density != null ? (
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {stock.density.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 w-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer"
                          onSelect={() => navigate(`/stocks/${stock.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="gap-2 cursor-pointer"
                          onSelect={() =>
                            navigate(`/stocks/${stock.id}/replenish`)
                          }
                        >
                          <Plus className="h-4 w-4" />
                          Adicionar estoque
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-destructive
                                       focus:text-destructive focus:bg-destructive/10"
                          onSelect={() => onDeleteProduct(stock.product)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
