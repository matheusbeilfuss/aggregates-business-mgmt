import { useEffect } from "react";
import { usePrices } from "../hooks/usePrices";
import { formatCurrency } from "@/utils/money";
import { PriceCategory } from "../types";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Navigate } from "react-router-dom";

export function PricePrint() {
  usePageTitle("Tabela de Preços - Impressão");

  const { isAuthenticated, isLoading } = useAuth();
  const { data: prices } = usePrices();

  useEffect(() => {
    if (prices && prices.length > 0) {
      window.print();
    }
  }, [prices]);

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!prices) return null;

  type GroupedPrices = Record<
    number,
    { name: string; prices: Record<number, PriceCategory> }
  >;

  const grouped = prices.reduce<GroupedPrices>((acc, price) => {
    const { id, name } = price.category;
    if (!acc[id]) acc[id] = { name, prices: {} };
    acc[id].prices[price.m3Volume] = price;
    return acc;
  }, {});

  const volumes = [...new Set(prices.map((p) => p.m3Volume))]
    .filter((v) => v !== 0)
    .sort((a, b) => a - b);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-xl font-semibold mb-1">Tabela de Preços</h1>
      <p className="text-sm text-gray-500 mb-6">
        Gerado em {new Date().toLocaleDateString("pt-BR")}
      </p>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left">
              Categoria
            </th>
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left">
              Depósito
            </th>
            {volumes.map((v) => (
              <th
                key={v}
                className="border border-gray-300 bg-gray-100 px-4 py-2 text-left"
              >
                {v} m³
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(grouped).map(({ name, prices: categoryPrices }) => (
            <tr key={name}>
              <td className="border border-gray-300 px-4 py-2">{name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {formatCurrency(categoryPrices[0]?.price ?? 0)}
              </td>
              {volumes.map((v) => (
                <td key={v} className="border border-gray-300 px-4 py-2">
                  {categoryPrices[v]
                    ? formatCurrency(categoryPrices[v].price)
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
