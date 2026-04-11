import { useEffect, useMemo, useRef } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useBalanceData } from "../hooks/useBalanceData";
import { formatLocalCurrency } from "@/utils";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useSettings } from "@/modules/settings/hooks/useSettings";
import { useFavicon } from "@/hooks/useFavicon";

const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function BalancePrint() {
  useFavicon();
  usePageTitle("Balanço - Impressão");

  const [searchParams] = useSearchParams();
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { businessName } = useSettings();

  const startDate = useMemo(() => new Date(year, 0, 1), [year]);
  const endDate = useMemo(() => new Date(year, 11, 31), [year]);

  const { monthlyData, summary, loading, error } = useBalanceData({
    startDate,
    endDate,
    enabled: isAuthenticated,
  });

  const hasRealData = useMemo(
    () => monthlyData.some((m) => m.expenses > 0 || m.income > 0),
    [monthlyData],
  );

  const hasPrinted = useRef(false);

  useEffect(() => {
    if (hasRealData && !hasPrinted.current) {
      hasPrinted.current = true;
      window.print();
    }
  }, [hasRealData]);

  if (authLoading || loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-destructive">
          Não foi possível carregar os dados. Tente novamente.
        </p>
      </div>
    );
  }

  if (!hasRealData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-muted-foreground">
          Nenhum dado disponível para este período.
        </p>
      </div>
    );
  }

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
          tfoot tr td {
            background-color: #d1e4ff !important;
            color: #001d36 !important;
          }
        }

        @media screen {
          body { background-color: #f4f3f7; }
        }
      `}</style>

      <div className="min-h-screen flex items-start justify-center py-10 px-4">
        <div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-sm overflow-hidden"
          style={{ border: "1px solid var(--color-outline-variant)" }}
        >
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
                Balanço {year}
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

          <div className="px-8 py-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {["Mês", "Gastos", "Recebimentos", "Líquido"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${i === 0 ? "text-left" : "text-right"}`}
                      style={{
                        backgroundColor: "var(--color-primary-90)",
                        color: "var(--color-primary-40)",
                        borderBottom: "1px solid var(--color-outline-variant)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {monthlyData.map((row, index) => (
                  <tr
                    key={row.month}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f4f3f7",
                      borderBottom: "1px solid var(--color-outline-variant)",
                    }}
                  >
                    <td
                      className="px-4 py-2.5 font-medium"
                      style={{ color: "var(--color-on-surface)" }}
                    >
                      {MONTH_LABELS[row.month - 1]}
                    </td>
                    <td
                      className="px-4 py-2.5 text-right tabular-nums"
                      style={{ color: "#c25000" }}
                    >
                      {formatLocalCurrency(row.expenses)}
                    </td>
                    <td
                      className="px-4 py-2.5 text-right tabular-nums"
                      style={{ color: "#16a34a" }}
                    >
                      {formatLocalCurrency(row.income)}
                    </td>
                    <td
                      className="px-4 py-2.5 text-right tabular-nums font-medium"
                      style={{
                        color:
                          row.profit >= 0 ? "#2563eb" : "var(--color-error)",
                      }}
                    >
                      {formatLocalCurrency(row.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr
                  style={{
                    backgroundColor: "var(--color-primary-90)",
                    borderTop: "2px solid var(--color-primary-40)",
                  }}
                >
                  <td
                    className="px-4 py-2.5 font-semibold text-xs uppercase tracking-wide"
                    style={{ color: "var(--color-primary-40)" }}
                  >
                    Total
                  </td>
                  <td
                    className="px-4 py-2.5 text-right tabular-nums font-semibold text-xs"
                    style={{ color: "var(--color-primary-40)" }}
                  >
                    {formatLocalCurrency(summary.totalExpenses)}
                  </td>
                  <td
                    className="px-4 py-2.5 text-right tabular-nums font-semibold text-xs"
                    style={{ color: "var(--color-primary-40)" }}
                  >
                    {formatLocalCurrency(summary.totalIncome)}
                  </td>
                  <td
                    className="px-4 py-2.5 text-right tabular-nums font-semibold text-xs"
                    style={{ color: "var(--color-primary-40)" }}
                  >
                    {formatLocalCurrency(summary.totalProfit)}
                  </td>
                </tr>
                <tr
                  style={{
                    backgroundColor: "var(--color-surface-container-low)",
                    borderTop: "1px solid var(--color-outline-variant)",
                  }}
                >
                  <td
                    className="px-4 py-2.5 text-xs"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    Média/mês
                  </td>
                  <td
                    className="px-4 py-2.5 text-right tabular-nums text-xs"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {formatLocalCurrency(summary.avgExpenses)}
                  </td>
                  <td
                    className="px-4 py-2.5 text-right tabular-nums text-xs"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {formatLocalCurrency(summary.avgIncome)}
                  </td>
                  <td
                    className="px-4 py-2.5 text-right tabular-nums text-xs"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {formatLocalCurrency(summary.avgProfit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
