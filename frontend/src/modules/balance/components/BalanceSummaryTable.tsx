import { BalanceSummary } from "../types";
import { formatLocalCurrency } from "@/utils";

type Props = {
  summary: BalanceSummary;
};

export function BalanceSummaryTable({ summary }: Props) {
  const data = [
    {
      label: "Gastos",
      total: summary.totalExpenses,
      avg: summary.avgExpenses,
      colorClass: "text-orange-500",
    },
    {
      label: "Recebimentos",
      total: summary.totalIncome,
      avg: summary.avgIncome,
      colorClass: "text-green-500",
    },
    {
      label: "Lucro",
      total: summary.totalProfit,
      avg: summary.avgProfit,
      colorClass: summary.totalProfit >= 0 ? "text-blue-500" : "text-red-500",
    },
  ];

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th
              scope="col"
              className="px-4 py-3 text-left font-medium text-muted-foreground"
            >
              <span className="sr-only">Tipo</span>
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right font-medium text-muted-foreground"
            >
              Total
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right font-medium text-muted-foreground"
            >
              Média/mês
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.label} className="border-t">
              <td className={`px-4 py-3 font-medium ${row.colorClass}`}>
                {row.label}
              </td>
              <td className="px-4 py-3 text-right">
                {formatLocalCurrency(row.total)}
              </td>
              <td className="px-4 py-3 text-right">
                {formatLocalCurrency(row.avg)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
