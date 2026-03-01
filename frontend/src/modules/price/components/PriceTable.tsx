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
import { CategoryActions } from "./CategoryActions";

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Categoria / M³</TableHead>
          <TableHead>Depósito</TableHead>
          {volumes.map((v) => (
            <TableHead key={v}>{v}</TableHead>
          ))}
          <TableHead />
        </TableRow>
      </TableHeader>

      <TableBody>
        {Object.entries(grouped).map(
          ([categoryId, { name, prices: categoryPrices }]) => (
            <TableRow key={categoryId}>
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
                  <CategoryActions
                    categoryId={categoryId}
                    onRename={() => onRenameCategory(Number(categoryId), name)}
                    onDelete={() => onDeleteCategory(Number(categoryId), name)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
}
