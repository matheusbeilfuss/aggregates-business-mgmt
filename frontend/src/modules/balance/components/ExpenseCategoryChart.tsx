import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ExpenseCategoryBalance } from "../types";
import { formatLocalCurrency } from "@/utils";
import { generateColors } from "../utils/generateColors";

type Props = {
  data: ExpenseCategoryBalance[];
};

export function ExpenseCategoryChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8 text-sm">
        Nenhuma despesa paga no período.
      </p>
    );
  }

  const colors = generateColors(data.length);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={90}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatLocalCurrency(value)} />
        <Legend
          formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
