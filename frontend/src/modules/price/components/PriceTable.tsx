import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriceCategory } from "../types";
import { formatCurrency } from "@/utils/money";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PriceTableProps {
  prices: PriceCategory[];
}

export function PriceTable({ prices }: PriceTableProps) {
  const navigate = useNavigate();

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material / M³</TableHead>
          <TableHead>Depósito</TableHead>
          {volumes.map((v) => (
            <TableHead key={v}>{v}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {Object.values(grouped).map(({ name, prices: categoryPrices }) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>
              {formatCurrency(categoryPrices[0]?.price ?? 0)}
            </TableCell>
            {volumes.map((v) => (
              <TableCell key={v}>
                {categoryPrices[v]
                  ? formatCurrency(categoryPrices[v].price)
                  : "-"}
              </TableCell>
            ))}
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
                      onClick={() =>
                        navigate(`/categories/${prices[0]?.category.id}/prices`)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
