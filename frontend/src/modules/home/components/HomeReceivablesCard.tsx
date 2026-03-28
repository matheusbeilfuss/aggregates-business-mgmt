import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <Link to="/receivables" className="block">
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow ${className ?? ""}`}
        onClick={() => navigate("/receivables")}
      >
        <CardHeader>
          <CardTitle className="text-base font-medium">Cobranças</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : receivables.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhuma cobrança pendente este mês.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {receivables.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 md:flex-row md:items-center md:gap-3">
                    <span className="font-semibold text-base truncate">
                      {r.clientName}
                    </span>
                    <span className="text-base text-muted-foreground md:shrink-0">
                      {formatLocalDate(r.scheduledDate)}
                    </span>
                  </div>
                  <span className="font-semibold text-base text-orange-500 shrink-0">
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
