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
    if (!acc[categoryId]) {
      acc[categoryId] = { categoryName, items: [] };
    }
    acc[categoryId].items.push(stock);
    return acc;
  }, {});

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
    <div className="rounded-xl border overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow
            className="hover:bg-transparent"
            style={{ backgroundColor: "var(--color-surface-container-low)" }}
          >
            <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide">
              Material
            </TableHead>
            <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-right">
              Toneladas
            </TableHead>
            <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-right">
              M³
            </TableHead>
            <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-right">
              Densidade
            </TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {Object.entries(grouped).map(
            ([categoryId, { categoryName, items }]) => (
              <Fragment key={categoryId}>
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={5} className="py-0 px-0">
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
                </TableRow>

                {items.map((stock) => (
                  <TableRow
                    key={stock.id}
                    className="transition-colors hover:bg-accent/50 cursor-default"
                  >
                    <TableCell className="px-4">
                      <span className="text-sm font-medium text-foreground">
                        {stock.product.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 text-right">
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
                    <TableCell className="px-4 text-right">
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
                    <TableCell className="px-4 text-right">
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
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}
