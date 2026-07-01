import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  LabelProps,
} from "recharts";
import { ProductBalance } from "../types";
import { formatLocalCurrency } from "@/utils";
import { generateColors } from "../utils/generateColors";

type Props = {
  data: ProductBalance[];
};

type ExtendedLabelProps = LabelProps & { payload?: ProductBalance };

export function ProductBalanceChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-16 rounded-xl border border-dashed"
        style={{ borderColor: "var(--color-outline-variant)" }}
      >
        <p
          className="text-sm"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Nenhuma venda registrada no período.
        </p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.totalValue - a.totalValue);
  const colors = generateColors(sorted.length);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 8, right: 80, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="productName" hide />
        <Tooltip
          formatter={(value: number) => formatLocalCurrency(value)}
          labelFormatter={(label) => `Produto: ${label}`}
        />
        <Bar dataKey="totalValue" name="Vendas" radius={4}>
          {sorted.map((entry, index) => (
            <Cell key={entry.productName} fill={colors[index]} />
          ))}
          <LabelList
            dataKey="productName"
            content={(props: LabelProps) => {
              const { x, y, width, height, value } = props;
              const name = String(value ?? "");
              const barWidth = Number(width ?? 0);
              const barX = Number(x ?? 0);
              const barY = Number(y ?? 0) + Number(height ?? 0) / 2;
              const charsPerPixel = 7;
              const fitsInside = barWidth > name.length * charsPerPixel + 16;

              if (fitsInside) {
                return (
                  <text
                    x={barX + 8}
                    y={barY}
                    fill="#fff"
                    fontSize={11}
                    dominantBaseline="middle"
                  >
                    {name}
                  </text>
                );
              }
              return null;
            }}
          />
          <LabelList
            dataKey="totalValue"
            content={(props: ExtendedLabelProps) => {
              const { x, y, width, height, value } = props;
              const barWidth = Number(width ?? 0);
              const barX = Number(x ?? 0);
              const barY = Number(y ?? 0) + Number(height ?? 0) / 2;
              const payload = props.payload;
              const name = payload?.productName ?? "";
              const charsPerPixel = 6.5;
              const fitsInside = barWidth > name.length * charsPerPixel + 16;
              const formattedValue =
                Number(value) >= 1000
                  ? `R$ ${(Number(value) / 1000).toFixed(1)}k`
                  : `R$ ${value}`;

              if (fitsInside) {
                return (
                  <text
                    x={barX + barWidth + 8}
                    y={barY}
                    fill="var(--color-muted-foreground)"
                    opacity={0.9}
                    fontSize={11}
                    dominantBaseline="middle"
                  >
                    {formattedValue}
                  </text>
                );
              }

              return (
                <text
                  x={barX + barWidth + 8}
                  y={barY}
                  fontSize={11}
                  dominantBaseline="middle"
                >
                  <tspan fill="var(--color-muted-foreground)" opacity={0.9}>
                    {name}
                  </tspan>
                  <tspan fill="var(--color-muted-foreground)" opacity={0.9}>
                    {" "}
                    · {formattedValue}
                  </tspan>
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
