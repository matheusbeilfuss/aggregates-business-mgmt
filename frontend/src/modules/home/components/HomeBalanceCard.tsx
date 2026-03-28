import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const balance = income - expenses;

  return (
    <Link to="/balance" className="block">
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow h-full ${className ?? ""}`}
      >
        <CardHeader>
          <CardTitle className="text-base font-medium text-muted-foreground">
            {monthLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:gap-6">
              <div className="flex flex-col gap-1 md:flex-1">
                <span className="text-sm text-muted-foreground">Saldo</span>
                <p
                  className={`text-4xl font-bold ${balance >= 0 ? "text-blue-500" : "text-orange-500"}`}
                >
                  {formatLocalCurrency(balance)}
                </p>
              </div>

              <div className="hidden md:block w-px self-stretch bg-border" />

              <div className="flex flex-col gap-2 mt-4 md:mt-0 md:flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base text-muted-foreground">
                    Entradas
                  </span>
                  <span className="text-base font-semibold">
                    {formatLocalCurrency(income)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base text-muted-foreground">
                    Saídas
                  </span>
                  <span className="text-base font-semibold">
                    {formatLocalCurrency(expenses)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base text-muted-foreground">Lucro</span>
                  <span className="text-base font-semibold">
                    {formatLocalCurrency(profit)}
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
