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
    <Table
      className="table-fixed"
      style={{ minWidth: `${140 + 100 + volumes.length * 90 + 40}px` }}
    >
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 z-20 bg-background w-[140px] whitespace-normal">
            <div className="w-[140px]">Categoria</div>
          </TableHead>
          <TableHead className="w-[100px] min-w-[100px]">Depósito</TableHead>
          {volumes.map((v) => (
            <TableHead key={v} className="w-[90px] min-w-[90px]">
              {v} m³
            </TableHead>
          ))}
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {Object.entries(grouped).map(
          ([categoryId, { name, prices: categoryPrices }]) => (
            <TableRow key={categoryId}>
              <TableCell className="sticky left-0 z-10 bg-background font-medium w-[140px] max-w-0 whitespace-normal break-words">
                {name}
              </TableCell>
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
              <TableCell onClick={(e) => e.stopPropagation()}>
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
