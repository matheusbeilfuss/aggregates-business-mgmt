import { LoadingState, PageContainer } from "@/components/shared";
import { DatePicker } from "@/components/shared/DatePicker";
import { useOrders } from "../hooks/useOrders";
import { OrderSection } from "../components/OrderSection";
import { OrderItem } from "../types";
import { useState } from "react";
import { toISODate } from "../utils/toIsoDate";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function Order() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: orders, loading, error } = useOrders(toISODate(selectedDate));

  const pendingOrders = orders?.filter(
    (o: OrderItem) => o.status === "PENDING",
  );

  const completedOrders = orders?.filter(
    (o: OrderItem) => o.status === "DELIVERED",
  );

  return (
    <PageContainer title="Pedidos">
      {error && <p className="text-red-500 mb-4">{error.message}</p>}

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <div className="space-y-6">
          <DatePicker value={selectedDate} onChange={setSelectedDate} />

          <OrderSection title="Pendentes" orders={pendingOrders} />
          <OrderSection title="Entregues" orders={completedOrders} />
        </div>
      )}

      <div className="mt-auto flex justify-end py-12">
        <Button
          className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base cursor-pointer"
          onClick={() => navigate("/orders/new")}
        >
          Adicionar Pedido
        </Button>
      </div>
    </PageContainer>
  );
}
