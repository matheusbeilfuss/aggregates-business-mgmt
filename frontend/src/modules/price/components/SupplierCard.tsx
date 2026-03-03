import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/money";
import { ProductSupplier } from "@/modules/product-supplier/types";
import { SupplierActions } from "./SupplierActions";

interface SupplierCardProps {
  ps: ProductSupplier;
  categoryId: number;
  oneM3Price: number;
  fiveM3Price: number;
  onRename: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export function SupplierCard({
  ps,
  categoryId,
  oneM3Price,
  fiveM3Price,
  onRename,
  onDelete,
}: SupplierCardProps) {
  const oneM3Profit = oneM3Price - ps.costPerCubicMeter;
  const fiveM3Profit = fiveM3Price - (ps.costFor5CubicMeters ?? 0);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="space-y-0.5">
          <p className="font-medium leading-tight">{ps.supplierName}</p>
          <p className="text-sm text-muted-foreground">{ps.productName}</p>
          {ps.observations && (
            <Badge variant="secondary" className="mt-1 font-normal">
              {ps.observations}
            </Badge>
          )}
        </div>
        <SupplierActions
          ps={ps}
          categoryId={categoryId}
          onRename={onRename}
          onDelete={onDelete}
        />
      </CardHeader>

      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Densidade</dt>
          <dd>{ps.density.toLocaleString("pt-BR")}</dd>

          <dt className="text-muted-foreground">Custo / Ton</dt>
          <dd>{formatCurrency(ps.tonCost)}</dd>

          <dt className="text-muted-foreground">Custo m³</dt>
          <dd>{formatCurrency(ps.costPerCubicMeter)}</dd>

          <dt className="text-muted-foreground">Lucro m³</dt>
          <dd className={oneM3Profit >= 0 ? "text-green-600" : "text-red-500"}>
            {formatCurrency(oneM3Profit)}
          </dd>

          {ps.costFor5CubicMeters && (
            <>
              <dt className="text-muted-foreground">Custo 5m³</dt>
              <dd>{formatCurrency(ps.costFor5CubicMeters)}</dd>

              <dt className="text-muted-foreground">Lucro 5m³</dt>
              <dd
                className={
                  fiveM3Profit >= 0 ? "text-green-600" : "text-red-500"
                }
              >
                {formatCurrency(fiveM3Profit)}
              </dd>
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
