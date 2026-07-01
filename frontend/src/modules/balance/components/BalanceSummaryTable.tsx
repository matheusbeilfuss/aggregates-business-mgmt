import { BalanceSummary } from "../types";
import { formatLocalCurrency } from "@/utils";

type Props = { summary: BalanceSummary };

export function BalanceSummaryTable({ summary }: Props) {
  const data = [
    {
      label: "Gastos",
      total: summary.totalExpenses,
      avg: summary.avgExpenses,
      color: "#c25000",
    },
    {
      label: "Vendas",
      total: summary.totalSales,
      avg: summary.avgSales,
      color: "#0061a4",
    },
    {
      label: "Recebimentos",
      total: summary.totalIncome,
      avg: summary.avgIncome,
      color: "#16a34a",
    },
    {
      label: "Lucro",
      total: summary.totalProfit,
      avg: summary.avgProfit,
      color: summary.totalProfit >= 0 ? "#2563eb" : "var(--color-error)",
    },
  ];

  return (
    <div className="rounded-xl border overflow-x-auto w-full">
      <table className="text-sm w-full">
        <thead>
          <tr style={{ backgroundColor: "var(--color-primary-90)" }}>
            <th
              className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-primary-40)" }}
            >
              Tipo
            </th>
            <th
              className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-primary-40)" }}
            >
              Total
            </th>
            <th
              className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-primary-40)" }}
            >
              Média/mês
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.label}
              className="border-t transition-colors hover:bg-accent/50 bg-background"
            >
              <td
                className="px-4 py-2.5 font-semibold text-sm"
                style={{ color: row.color }}
              >
                {row.label}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-sm text-foreground whitespace-nowrap">
                {formatLocalCurrency(row.total)}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">
                {formatLocalCurrency(row.avg)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
