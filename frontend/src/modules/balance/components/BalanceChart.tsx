import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlyBalance } from "../types";
import { formatLocalCurrency } from "@/utils";

type Props = {
  data: MonthlyBalance[];
};

export function BalanceChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="monthLabel"
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis
          tickFormatter={(value: number) => {
            if (value === 0) return "R$ 0";
            if (value >= 1_000_000)
              return `R$ ${(value / 1_000_000).toFixed(1)}M`;
            if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
            return `R$ ${value}`;
          }}
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
          width={72}
        />
        <Tooltip
          formatter={(value: number) => formatLocalCurrency(value)}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="expenses"
          name="Gastos"
          stroke="#f97316"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="income"
          name="Vendas"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="profit"
          name="Líquido"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
