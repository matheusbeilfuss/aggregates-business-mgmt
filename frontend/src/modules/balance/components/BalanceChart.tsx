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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarChart2, TrendingUp } from "lucide-react";

type Props = {
  data: MonthlyBalance[];
};

const SERIES = [
  { key: "expenses", name: "Gastos", color: "#f97316" },
  { key: "income", name: "Vendas", color: "#22c55e" },
  { key: "profit", name: "Líquido", color: "#3b82f6" },
] as const;

const tooltipFormatter = (value: number) => formatLocalCurrency(value);
const labelFormatter = (label: string) => `Mês : ${label}`;

export function BalanceChart({ data }: Props) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const yAxisProps = {
    tickFormatter: (value: number) => {
      if (value === 0) return "R$ 0";
      if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
      return `R$ ${value}`;
    },
    tick: { fontSize: 12 },
    width: 54,
  };

  const commonProps = {
    data,
    margin: { top: 8, right: 16, left: 16, bottom: 8 },
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={chartType}
          onValueChange={(v) => v && setChartType(v as "line" | "bar")}
        >
          <ToggleGroupItem value="line">
            <TrendingUp className="h-4 w-4 mr-1" />
            Linhas
          </ToggleGroupItem>
          <ToggleGroupItem value="bar">
            <BarChart2 className="h-4 w-4 mr-1" />
            Barras
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        {chartType === "line" ? (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
            <YAxis {...yAxisProps} />
            <Tooltip
              formatter={tooltipFormatter}
              labelFormatter={labelFormatter}
            />
            <Legend />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
            <YAxis {...yAxisProps} />
            <Tooltip
              formatter={tooltipFormatter}
              labelFormatter={labelFormatter}
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
