import { Badge } from "@/components/ui/badge";
import { formatLocalCurrency } from "@/utils";
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
    <div
      className="rounded-xl border bg-background overflow-hidden"
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: "var(--color-primary-40)",
      }}
    >
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3">
        <div className="space-y-0.5 min-w-0">
          <p className="font-semibold text-sm leading-tight">
            {ps.supplierName}
          </p>
          <p className="text-xs text-muted-foreground">{ps.productName}</p>
          {ps.observations && (
            <Badge variant="secondary" className="mt-1 font-normal text-xs">
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
      </div>

      <div
        className="grid grid-cols-2 gap-px border-t"
        style={{ backgroundColor: "var(--color-outline-variant)" }}
      >
        {[
          {
            label: "Densidade",
            value: ps.density.toLocaleString("pt-BR"),
            colored: false,
          },
          {
            label: "Custo / Ton",
            value: formatLocalCurrency(ps.tonCost),
            colored: false,
          },
          {
            label: "Custo m³",
            value: formatLocalCurrency(ps.costPerCubicMeter),
            colored: false,
          },
          {
            label: "Lucro m³",
            value: formatLocalCurrency(oneM3Profit),
            profit: oneM3Profit,
          },
          {
            label: "Custo 5m³",
            value: formatLocalCurrency(ps.costFor5CubicMeters ?? 0),
            colored: false,
          },
          {
            label: "Lucro 5m³",
            value: formatLocalCurrency(fiveM3Profit),
            profit: fiveM3Profit,
          },
        ].map(({ label, value, profit }) => (
          <div
            key={label}
            className="flex flex-col gap-0.5 px-4 py-3"
            style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
          >
            <span
              className="text-[10px] font-medium uppercase tracking-wide"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {label}
            </span>
            <span
              className="text-sm tabular-nums font-medium"
              style={{
                color:
                  profit !== undefined
                    ? profit >= 0
                      ? "#16a34a"
                      : "var(--color-error)"
                    : undefined,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
