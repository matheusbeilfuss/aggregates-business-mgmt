import { formatLocalCurrency } from "@/utils";

type Props = {
  label?: string;
  value: number;
  variant: "income" | "expense" | "receivable";
};

export function FinanceTotalBar({ label = "Total", value, variant }: Props) {
  const styles = {
    income: {
      bg: "#dcfce7",
      color: "#16a34a",
    },
    expense: {
      bg: "var(--color-secondary-90)",
      color: "var(--color-secondary-40)",
    },
    receivable: {
      bg: "var(--color-tertiary-90)",
      color: "var(--color-tertiary-40)",
    },
  }[variant];

  return (
    <div
      className="flex justify-between items-center px-4 py-3 mt-2 rounded-xl"
      style={{ backgroundColor: styles.bg }}
    >
      <span className="text-sm font-medium" style={{ color: styles.color }}>
        {label}
      </span>
      <span
        className="text-sm font-semibold tabular-nums"
        style={{ color: styles.color }}
      >
        {formatLocalCurrency(value)}
      </span>
    </div>
  );
}
