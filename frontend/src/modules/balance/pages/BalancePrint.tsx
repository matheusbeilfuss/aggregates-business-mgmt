import { useEffect, useMemo, useRef } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useBalanceData } from "../hooks/useBalanceData";
import { formatLocalCurrency } from "@/utils";
import { usePageTitle } from "@/hooks/usePageTitle";

export function BalancePrint() {
  usePageTitle("Balanço - Impressão");

  const [searchParams] = useSearchParams();
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const startDate = useMemo(() => new Date(year, 0, 1), [year]);
  const endDate = useMemo(() => new Date(year, 11, 31), [year]);

  const { monthlyData, summary, loading } = useBalanceData({
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
  if (!hasRealData)
    return (
      <div className="p-8 font-sans">
        <h1 className="text-xl font-semibold mb-4">Balanço {year}</h1>
        <p className="text-gray-500">
          Nenhum dado disponível para este período.
        </p>
      </div>
    );

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

  return (
    <div className="p-8 font-sans">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          th { background-color: #f3f4f6 !important; }
        }
      `}</style>

      <h1 className="text-xl font-semibold mb-1">Balanço {year}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Gerado em {new Date().toLocaleDateString("pt-BR")}
      </p>

      <table className="w-full border-collapse text-sm mb-8">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left">
              Mês
            </th>
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-right">
              Gastos
            </th>
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-right">
              Recebimentos
            </th>
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-right">
              Líquido
            </th>
          </tr>
        </thead>
        <tbody>
          {monthlyData.map((row) => (
            <tr key={row.month}>
              <td className="border border-gray-300 px-4 py-2">
                {MONTH_LABELS[row.month - 1]}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {formatLocalCurrency(row.expenses)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {formatLocalCurrency(row.income)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {formatLocalCurrency(row.profit)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-medium">
            <td className="border border-gray-300 px-4 py-2">Total</td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              {formatLocalCurrency(summary.totalExpenses)}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              {formatLocalCurrency(summary.totalIncome)}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              {formatLocalCurrency(summary.totalProfit)}
            </td>
          </tr>
          <tr className="text-gray-500">
            <td className="border border-gray-300 px-4 py-2">Média/mês</td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              {formatLocalCurrency(summary.avgExpenses)}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              {formatLocalCurrency(summary.avgIncome)}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              {formatLocalCurrency(summary.avgProfit)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
