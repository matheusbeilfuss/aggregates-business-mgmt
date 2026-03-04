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
import { toIsoDate } from "../../../utils/toIsoDate";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { orderService } from "../services/order.service";
import { toast } from "sonner";
import { AddPaymentDialog } from "@/components/shared/AddPaymentDialog";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";

export function Order() {
  usePageTitle("Pedidos");

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [orderToMarkAsDelivered, setOrderToMarkAsDelivered] =
    useState<OrderItem | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false);
  const [orderToAddPayment, setOrderToAddPayment] = useState<OrderItem | null>(
    null,
  );

  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useOrders(toIsoDate(selectedDate));

  function openDeliveredDialog(order: OrderItem) {
    setOrderToMarkAsDelivered(order);
  }

  function openDeleteDialog(order: OrderItem) {
    setOrderToDelete(order);
  }

  function openAddPaymentDialog(order: OrderItem) {
    setOrderToAddPayment(order);
    setIsAddPaymentDialogOpen(true);
  }

  async function handleMarkOrderAsDelivered() {
    if (!orderToMarkAsDelivered) return;

    try {
      await orderService.markAsDelivered(orderToMarkAsDelivered.id);
      toast.success("O pedido foi marcado como entregue.");
      setOrderToMarkAsDelivered(null);
      refetch();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível marcar o pedido como entregue.");
      }
    }
  }

  async function handleDeleteOrder() {
    if (!orderToDelete) return;

    try {
      await orderService.delete(orderToDelete.id);
      toast.success("O pedido foi excluído com sucesso.");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível excluir o pedido.");
      }
    } finally {
      setOrderToDelete(null);
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
            onMarkAsDelivered={openDeliveredDialog}
            onAddPayment={openAddPaymentDialog}
            onDeleteOrder={openDeleteDialog}
          />

          <OrderSection
            title="Entregues"
            orders={completedOrders}
            onAddPayment={openAddPaymentDialog}
            onDeleteOrder={openDeleteDialog}
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
        open={!!orderToMarkAsDelivered}
        onOpenChange={(open) => !open && setOrderToMarkAsDelivered(null)}
        title="Você tem certeza que deseja marcar este pedido como entregue?"
        description={
          orderToMarkAsDelivered ? `Pedido #${orderToMarkAsDelivered.id}` : ""
        }
        onConfirm={handleMarkOrderAsDelivered}
        confirmLabel="Confirmar"
        variant="default"
      />

      <ConfirmDialog
        open={!!orderToDelete}
        onOpenChange={(open) => !open && setOrderToDelete(null)}
        title="Você tem certeza de que deseja excluir o pedido abaixo?"
        description={orderToDelete ? `Pedido #${orderToDelete.id}` : ""}
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
