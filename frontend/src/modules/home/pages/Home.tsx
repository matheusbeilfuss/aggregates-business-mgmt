import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { HomeBalanceCard } from "../components/HomeBalanceCard";
import { HomeOrdersCard } from "../components/HomeOrdersCard";
import { HomeStockCard } from "../components/HomeStockCard";
import { HomeReceivablesCard } from "../components/HomeReceivablesCard";
import { useHomeData } from "../hooks/useHomeData";
import { toast } from "sonner";
import { useEffect } from "react";

export function Home() {
  usePageTitle("Início");

  const { user } = useAuth();
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
    if (error) {
      toast.error("Não foi possível carregar os dados da página inicial.");
    }
  }, [error]);

  return (
    <div className="flex flex-col mx-auto w-[80%] h-full gap-16 py-16 md:gap-24 md:py-24">
      <h1 className="text-3xl">Olá, {user?.firstName ?? ""}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16 md:pb-0">
        <HomeBalanceCard
          monthLabel={monthLabel}
          income={balance.income}
          expenses={balance.expenses}
          profit={balance.profit}
          loading={loading.balance}
        />

        <HomeOrdersCard orders={topOrders} loading={loading.orders} />

        <HomeStockCard stocks={lowStocks} loading={loading.stocks} />

        <HomeReceivablesCard
          receivables={topReceivables}
          loading={loading.receivables}
        />
      </div>
    </div>
  );
}
