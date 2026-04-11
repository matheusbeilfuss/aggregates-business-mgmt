import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockItem } from "@/modules/stock/types";

type Props = {
  stocks: StockItem[];
  loading: boolean;
  className?: string;
};

const LOW_STOCK_THRESHOLD = 5;

export function HomeStockCard({ stocks, loading, className }: Props) {
  return (
    <Link to="/stocks" className="block">
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow h-full ${className ?? ""}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Estoque baixo
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
          ) : stocks.length === 0 ? (
            <p
              className="text-sm"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Nenhum produto com estoque baixo.
            </p>
          ) : (
            <ul
              className="flex flex-col divide-y"
              style={{ borderColor: "var(--color-outline-variant)" }}
            >
              {stocks.map((stock) => {
                const isLow = stock.m3Quantity <= LOW_STOCK_THRESHOLD;
                return (
                  <li
                    key={stock.id}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="font-semibold text-sm truncate"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {stock.product.name}
                      </span>
                      {isLow && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: "var(--color-secondary-90)",
                            color: "var(--color-secondary-40)",
                          }}
                        >
                          Baixo
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className="text-xs tabular-nums"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        {stock.m3Quantity.toFixed(2)} m³
                      </span>
                      <span
                        className="text-xs tabular-nums"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        {stock.tonQuantity.toFixed(2)} ton
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
