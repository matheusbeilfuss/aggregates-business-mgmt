import {
  ConfirmDialog,
  LoadingState,
  PageContainer,
} from "@/components/shared";
import { DatePicker } from "@/components/shared/DatePicker";
import { useOrders } from "../hooks/useOrders";
import { OrderSection } from "../components/OrderSection";
import { OrderItem } from "../types";
import { useState } from "react";
import { toISODate } from "../utils/toIsoDate";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { orderService } from "../services/order.service";
import { toast } from "sonner";
import { AddPaymentDialog } from "@/components/shared/AddPaymentDialog";

export function Order() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [orderToConfirm, setOrderToConfirm] = useState<OrderItem | null>(null);
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false);
  const [orderToAddPayment, setOrderToAddPayment] = useState<OrderItem | null>(
    null,
  );

  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useOrders(toISODate(selectedDate));

  function openConfirmDialog(order: OrderItem) {
    setOrderToConfirm(order);
  }

  function openAddPaymentDialog(order: OrderItem) {
    setOrderToAddPayment(order);
    setIsAddPaymentDialogOpen(true);
  }

  async function handleMarkOrderAsDelivered() {
    if (!orderToConfirm) return;

    try {
      await orderService.markAsDelivered(orderToConfirm.id);
      toast.success("O pedido foi marcado como entregue.");
      setOrderToConfirm(null);
      refetch();
    } catch {
      toast.error("Não foi possível marcar o pedido como entregue.");
    }
  }

  async function handleDeleteOrder() {
    if (!orderToConfirm) return;

    try {
      await orderService.delete(orderToConfirm.id);
      toast.success("O pedido foi excluído com sucesso.");
    } catch {
      toast.error("Não foi possível excluir o pedido.");
    } finally {
      setOrderToConfirm(null);
      refetch();
    }
  }

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

          <OrderSection
            title="Pendentes"
            orders={pendingOrders}
            onMarkAsDelivered={openConfirmDialog}
            onAddPayment={openAddPaymentDialog}
            onDeleteOrder={openConfirmDialog}
          />

          <OrderSection
            title="Entregues"
            orders={completedOrders}
            onAddPayment={openAddPaymentDialog}
            onDeleteOrder={openConfirmDialog}
          />
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

      <ConfirmDialog
        open={!!orderToConfirm}
        onOpenChange={(open) => !open && setOrderToConfirm(null)}
        title="Você tem certeza que deseja marcar este pedido como entregue?"
        description={orderToConfirm ? `Pedido #${orderToConfirm.id}` : ""}
        onConfirm={handleMarkOrderAsDelivered}
        confirmLabel="Confirmar"
        variant="default"
      />

      <ConfirmDialog
        open={!!orderToConfirm}
        onOpenChange={(open) => !open && setOrderToConfirm(null)}
        title="Você tem certeza de que deseja excluir o pedido abaixo?"
        description={orderToConfirm ? `Pedido #${orderToConfirm.id}` : ""}
        onConfirm={handleDeleteOrder}
        confirmLabel="Excluir"
        variant="destructive"
      />

      {orderToAddPayment && (
        <AddPaymentDialog
          open={isAddPaymentDialogOpen}
          onOpenChange={(open) => {
            setIsAddPaymentDialogOpen(open);
            if (!open) setOrderToAddPayment(null);
          }}
          order={orderToAddPayment}
          onSuccess={() => {
            setIsAddPaymentDialogOpen(false);
            setOrderToAddPayment(null);
            refetch();
          }}
        />
      )}
    </PageContainer>
  );
}
