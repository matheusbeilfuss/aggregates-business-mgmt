import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Toneladas</TableHead>
            <TableHead>M³</TableHead>
            <TableHead>Densidade</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground italic"
            >
              Nenhum item no estoque.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead>Toneladas</TableHead>
          <TableHead>M³</TableHead>
          <TableHead>Densidade</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>

      <TableBody>
        {Object.entries(grouped).map(
          ([categoryId, { categoryName, items }]) => (
            <Fragment key={categoryId}>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableCell
                  colSpan={5}
                  className="py-2 px-4 text-sm font-medium text-muted-foreground"
                >
                  {categoryName}
                </TableCell>
              </TableRow>

              {items.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.product.name}</TableCell>
                  <TableCell>{stock.tonQuantity?.toFixed(2) ?? "-"}</TableCell>
                  <TableCell>
                    {stock.m3Quantity != null
                      ? `${stock.m3Quantity.toFixed(2)} m³`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {stock.density != null
                      ? `${stock.density.toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={(e) => {
                              e.preventDefault();
                              navigate(`/stocks/${stock.id}`);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => onDeleteProduct(stock.product)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={(e) => {
                              e.preventDefault();
                              navigate(`/stocks/${stock.id}/replenish`);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ),
        )}
      </TableBody>
    </Table>
  );
}
