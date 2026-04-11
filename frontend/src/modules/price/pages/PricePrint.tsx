import { useEffect, useRef } from "react";
import { usePrices } from "../hooks/usePrices";
import { formatLocalCurrency } from "@/utils";
import { PriceCategory } from "../types";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useSettings } from "@/modules/settings/hooks/useSettings";
import { Navigate } from "react-router-dom";
import { useFavicon } from "@/hooks/useFavicon";

export function PricePrint() {
  useFavicon();
  usePageTitle("Tabela de Preços");

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { businessName } = useSettings();
  const { data: prices, loading: pricesLoading } = usePrices({
    enabled: isAuthenticated,
  });

  const hasPrinted = useRef(false);

  useEffect(() => {
    if (prices && prices.length > 0 && !hasPrinted.current) {
      hasPrinted.current = true;
      window.print();
    }
  }, [prices]);

  if (authLoading || pricesLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!prices || prices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-muted-foreground">
          Nenhum preço cadastrado.
        </p>
      </div>
    );
  }

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
    <>
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-header { border-bottom: 2px solid #0061a4 !important; }
          thead tr th {
            background-color: #d1e4ff !important;
            color: #001d36 !important;
          }
          tbody tr:nth-child(even) {
            background-color: #f4f3f7 !important;
          }
        }

        @media screen {
          body { background-color: #f4f3f7; }
        }
      `}</style>

      <div className="min-h-screen flex items-start justify-center py-10 px-4">
        <div
          className="w-full max-w-5xl bg-white rounded-2xl shadow-sm overflow-hidden"
          style={{ border: "1px solid var(--color-outline-variant)" }}
        >
          {/* Cabeçalho */}
          <div
            className="print-header flex items-end justify-between px-8 py-6"
            style={{ borderBottom: "2px solid var(--color-primary-40)" }}
          >
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "var(--color-primary-40)" }}
              >
                {businessName}
              </p>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--color-on-surface)" }}
              >
                Tabela de Preços
              </h1>
            </div>
            <p
              className="text-sm pb-1"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Tabela */}
          <div className="px-8 py-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: "var(--color-primary-90)",
                      color: "var(--color-primary-40)",
                      borderBottom: "1px solid var(--color-outline-variant)",
                    }}
                  >
                    Categoria
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: "var(--color-primary-90)",
                      color: "var(--color-primary-40)",
                      borderBottom: "1px solid var(--color-outline-variant)",
                    }}
                  >
                    Depósito
                  </th>
                  {volumes.map((v) => (
                    <th
                      key={v}
                      className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
                      style={{
                        backgroundColor: "var(--color-primary-90)",
                        color: "var(--color-primary-40)",
                        borderBottom: "1px solid var(--color-outline-variant)",
                      }}
                    >
                      {v} m³
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(
                  (
                    [categoryId, { name, prices: categoryPrices }],
                    rowIndex,
                  ) => (
                    <tr
                      key={categoryId}
                      style={{
                        backgroundColor:
                          rowIndex % 2 === 0 ? "#ffffff" : "#f4f3f7",
                        borderBottom: "1px solid var(--color-outline-variant)",
                      }}
                    >
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {name}
                      </td>
                      <td
                        className="px-4 py-3 text-right tabular-nums"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {formatLocalCurrency(categoryPrices[0]?.price ?? 0)}
                      </td>
                      {volumes.map((v) => (
                        <td
                          key={v}
                          className="px-4 py-3 text-right tabular-nums"
                          style={{ color: "var(--color-on-surface)" }}
                        >
                          {categoryPrices[v] ? (
                            formatLocalCurrency(categoryPrices[v].price)
                          ) : (
                            <span
                              style={{
                                color: "var(--color-on-surface-variant)",
                              }}
                            >
                              —
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
