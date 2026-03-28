import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockItem } from "@/modules/stock/types";

type Props = {
  stocks: StockItem[];
  loading: boolean;
  className?: string;
};

const LOW_STOCK_THRESHOLD = 5;

export function HomeStockCard({ stocks, loading, className }: Props) {
  const navigate = useNavigate();

  return (
    <Link to="/stock" className="block">
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow h-full ${className ?? ""}`}
        onClick={() => navigate("/stocks")}
      >
        <CardHeader>
          <CardTitle className="text-base font-medium">Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : stocks.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum produto cadastrado.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {stocks.map((stock) => {
                const isLow = stock.m3Quantity <= LOW_STOCK_THRESHOLD;
                return (
                  <li
                    key={stock.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="font-semibold text-base truncate">
                      {stock.product.name}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      {isLow && (
                        <Badge variant="destructive" className="bg-orange-300">
                          Baixo
                        </Badge>
                      )}
                      <span className="text-base text-muted-foreground">
                        {stock.m3Quantity.toFixed(2)} m³ ·{" "}
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
