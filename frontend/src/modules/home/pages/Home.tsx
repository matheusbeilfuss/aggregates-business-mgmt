import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { HomeBalanceCard } from "../components/HomeBalanceCard";
import { HomeOrdersCard } from "../components/HomeOrdersCard";
import { HomeStockCard } from "../components/HomeStockCard";
import { HomeReceivablesCard } from "../components/HomeReceivablesCard";
import { useHomeData } from "../hooks/useHomeData";
import { toast } from "sonner";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function Home() {
  usePageTitle("Início");

  const { user, isLoading } = useAuth();
  const {
    monthLabel,
    topOrders,
    lowStocks,
    topReceivables,
    balance,
    loading,
    error,
  } = useHomeData();

  useEffect(() => {
    if (error)
      toast.error("Não foi possível carregar os dados da página inicial.");
  }, [error]);

  return (
    <div className="flex flex-col mx-auto w-full max-w-5xl h-full gap-16 py-12 px-6 md:py-16">
      {isLoading ? (
        <Skeleton className="h-9 w-48 rounded-md" />
      ) : (
        <div>
          <p
            className="text-sm font-medium uppercase tracking-widest mb-1"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Bem-vindo de volta
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--color-on-surface)" }}
          >
            {user?.firstName ?? ""}
          </h1>
        </div>
      )}
      <div className="flex flex-col gap-4 pb-8 md:pb-0">
        <HomeBalanceCard
          monthLabel={monthLabel}
          income={balance.income}
          expenses={balance.expenses}
          profit={balance.profit}
          loading={loading.balance}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HomeOrdersCard orders={topOrders} loading={loading.orders} />
          <HomeStockCard stocks={lowStocks} loading={loading.stocks} />
          <HomeReceivablesCard
            receivables={topReceivables}
            loading={loading.receivables}
          />
        </div>
      </div>
    </div>
  );
}
