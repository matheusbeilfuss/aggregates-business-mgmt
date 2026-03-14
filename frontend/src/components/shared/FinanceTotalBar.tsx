import { formatLocalCurrency } from "@/utils";

type Props = {
  label?: string;
  value: number;
  variant: "income" | "expense" | "receivable";
};

export function FinanceTotalBar({ label = "Total", value, variant }: Props) {
  const bg =
    variant === "income"
      ? "bg-blue-50"
      : variant === "expense"
        ? "bg-orange-50"
        : "bg-purple-50";

  return (
    <div
      className={`flex justify-between items-center px-4 py-3 mt-2 rounded-md ${bg}`}
    >
      <span className="font-medium">{label}</span>
      <span className="font-semibold">{formatLocalCurrency(value)}</span>
    </div>
  );
}
