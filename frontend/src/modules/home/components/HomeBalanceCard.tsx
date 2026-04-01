import { Card, CardContent } from "@/components/ui/card";
import { formatLocalCurrency } from "@/utils";
import { Link } from "react-router-dom";

type Props = {
  monthLabel: string;
  income: number;
  expenses: number;
  profit: number;
  loading: boolean;
  className?: string;
};

export function HomeBalanceCard({
  monthLabel,
  income,
  expenses,
  profit,
  loading,
  className,
}: Props) {
  return (
    <Link to="/balance" className="block">
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow h-full ${className ?? ""}`}
      >
        <CardContent className="p-6">
          {loading ? (
            <p
              className="text-sm"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Carregando...
            </p>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:gap-8">
              <div className="flex flex-col gap-0.5 md:flex-1">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {monthLabel}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Saldo
                </span>
                <p
                  className="text-4xl font-bold tabular-nums"
                  style={{ color: profit >= 0 ? "#2563eb" : "#c25000" }}
                >
                  {formatLocalCurrency(profit)}
                </p>
              </div>

              <div
                className="hidden md:block w-px self-stretch"
                style={{ backgroundColor: "var(--color-outline-variant)" }}
              />

              <div className="flex gap-8 mt-4 md:mt-0 md:flex-1">
                <div className="flex flex-col gap-0.5 flex-1">
                  <span
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    Entradas
                  </span>
                  <span
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: "#16a34a" }}
                  >
                    {formatLocalCurrency(income)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <span
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    Saídas
                  </span>
                  <span
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: "#c25000" }}
                  >
                    {formatLocalCurrency(expenses)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
