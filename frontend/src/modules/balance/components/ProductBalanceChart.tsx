import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ProductBalance } from "../types";
import { formatLocalCurrency } from "@/utils";
import { generateColors } from "../utils/generateColors";

type Props = {
  data: ProductBalance[];
};

export function ProductBalanceChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8 text-sm">
        Nenhuma venda registrada no período.
      </p>
    );
  }

  const sorted = [...data].sort((a, b) => b.totalValue - a.totalValue);
  const colors = generateColors(sorted.length);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 8, right: 32, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(value: number) => {
            if (value === 0) return "R$ 0";
            if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
            return `R$ ${value}`;
          }}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="productName"
          tick={{ fontSize: 12 }}
          width={70}
        />
        <Tooltip
          formatter={(value: number) => formatLocalCurrency(value)}
          labelFormatter={(label) => `Produto: ${label}`}
        />
        <Bar dataKey="totalValue" name="Vendas">
          {sorted.map((_, index) => (
            <Cell key={index} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
