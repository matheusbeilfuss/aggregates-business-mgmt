import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlyBalance } from "../types";
import { formatLocalCurrency } from "@/utils";
import { BarChart2, TrendingUp } from "lucide-react";

type Props = { data: MonthlyBalance[] };

const SERIES = [
  { key: "expenses", name: "Gastos", color: "#c25000" },
  { key: "sales", name: "Vendas", color: "#0061a4" },
  { key: "income", name: "Recebimentos", color: "#16a34a" },
  { key: "profit", name: "Líquido", color: "#2563eb" },
] as const;

export function BalanceChart({ data }: Props) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const yAxisProps = {
    tickFormatter: (value: number) => {
      if (value === 0) return "R$ 0";
      const abs = Math.abs(value);
      const prefix = value < 0 ? "-R$ " : "R$ ";
      if (abs >= 1_000_000) return `${prefix}${(abs / 1_000_000).toFixed(1)}M`;
      if (abs >= 1000) return `${prefix}${(abs / 1000).toFixed(1)}k`;
      return `${prefix}${abs}`;
    },
    tick: { fontSize: 12 },
    width: 54,
  };

  const commonProps = {
    data,
    margin: { top: 16, right: 16, left: 0, bottom: 8 },
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end gap-2">
        {(["line", "bar"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                       text-xs font-medium transition-colors select-none cursor-pointer"
            style={{
              borderColor:
                chartType === type
                  ? "var(--color-primary-40)"
                  : "var(--color-outline-variant)",
              backgroundColor:
                chartType === type ? "var(--color-primary-90)" : "transparent",
              color:
                chartType === type
                  ? "var(--color-primary-10)"
                  : "var(--color-on-surface-variant)",
            }}
          >
            {type === "line" ? (
              <>
                <TrendingUp className="h-3.5 w-3.5" /> Linhas
              </>
            ) : (
              <>
                <BarChart2 className="h-3.5 w-3.5" /> Barras
              </>
            )}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        {chartType === "line" ? (
          <LineChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-outline-variant)"
            />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
            <YAxis {...yAxisProps} />
            <Tooltip
              formatter={(value: number) => formatLocalCurrency(value)}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-outline-variant)"
            />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
            <YAxis {...yAxisProps} />
            <Tooltip
              formatter={(value: number) => formatLocalCurrency(value)}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend />
            {SERIES.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
