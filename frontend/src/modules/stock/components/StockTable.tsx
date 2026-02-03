import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Plus, X } from "lucide-react";

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

import type { StockItem, Product } from "../types";

interface StockTableProps {
  stocks: StockItem[];
  openMenuId: number | null;
  setOpenMenuId: (id: number | null) => void;
  onDeleteProduct: (product: Product) => void;
}

export function StockTable({
  stocks,
  openMenuId,
  setOpenMenuId,
  onDeleteProduct,
}: StockTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead>Toneladas</TableHead>
          <TableHead>M³</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>

      <TableBody>
        {stocks.map((stock) => (
          <TableRow key={stock.id}>
            <TableCell>{stock.product.name}</TableCell>
            <TableCell>{stock.tonQuantity?.toFixed(2) ?? "-"}</TableCell>
            <TableCell>
              {stock.m3Quantity != null
                ? `${stock.m3Quantity?.toFixed(2)} m³`
                : "-"}
            </TableCell>

            <TableCell>
              <div className="flex justify-end">
                <DropdownMenu
                  open={openMenuId === stock.id}
                  onOpenChange={(open) => setOpenMenuId(open ? stock.id : null)}
                >
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
                      onClick={() => navigate(`/stocks/${stock.id}`)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        onDeleteProduct(stock.product);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate(`/stocks/${stock.id}/replenish`)}
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

        {stocks.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center text-muted-foreground italic"
            >
              Nenhum item no estoque.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
