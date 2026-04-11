import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receivable } from "@/modules/receivables/types";
import { formatLocalCurrency, formatLocalDate } from "@/utils";

type Props = {
  receivables: Receivable[];
  loading: boolean;
  className?: string;
};

export function HomeReceivablesCard({
  receivables,
  loading,
  className,
}: Props) {
  return (
    <Link to="/receivables" className="block h-full">
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow h-full ${className ?? ""}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Cobranças pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p
              className="text-sm"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Carregando...
            </p>
          ) : receivables.length === 0 ? (
            <p
              className="text-sm"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Nenhuma cobrança pendente este mês.
            </p>
          ) : (
            <ul
              className="flex flex-col divide-y"
              style={{ borderColor: "var(--color-outline-variant)" }}
            >
              {receivables.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span
                      className="font-semibold text-sm truncate"
                      style={{ color: "var(--color-on-surface)" }}
                    >
                      {r.clientName}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      {formatLocalDate(r.scheduledDate)}
                    </span>
                  </div>
                  <span
                    className="font-semibold text-sm shrink-0 tabular-nums"
                    style={{ color: "var(--color-tertiary-40)" }}
                  >
                    {formatLocalCurrency(r.remainingValue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
