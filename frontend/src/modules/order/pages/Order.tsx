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
import { toIsoDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { orderService } from "../services/order.service";
import { toast } from "sonner";
import { PaymentDialog } from "@/components/shared/PaymentDialog";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";

export function Order() {
  usePageTitle("Pedidos");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [orderToMarkAsDelivered, setOrderToMarkAsDelivered] =
    useState<OrderItem | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [orderForPayment, setOrderForPayment] = useState<OrderItem | null>(
    null,
  );

  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useOrders(toIsoDate(selectedDate));

  const sortByTime = (a: OrderItem, b: OrderItem) =>
    a.scheduledTime.localeCompare(b.scheduledTime);

  const pendingOrders = (orders ?? [])
    .filter((o: OrderItem) => o.status === "PENDING")
    .sort(sortByTime);

  const completedOrders = (orders ?? []).filter(
    (o: OrderItem) => o.status === "DELIVERED",
  );

  async function handleMarkOrderAsDelivered() {
    if (!orderToMarkAsDelivered) return;
    try {
      await orderService.markAsDelivered(orderToMarkAsDelivered.id);
      toast.success("Pedido marcado como entregue.");
      setOrderToMarkAsDelivered(null);
      refetch();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível marcar o pedido como entregue.",
      );
    }
  }

  async function handleDeleteOrder() {
    if (!orderToDelete) return;
    try {
      await orderService.delete(orderToDelete.id);
      toast.success("Pedido excluído com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir o pedido.",
      );
    } finally {
      setOrderToDelete(null);
      refetch();
    }
  }

  return (
    <PageContainer
      title="Pedidos"
      actions={
        <Button
          className="h-9 px-4 text-sm font-medium text-white gap-1.5
                     hover:opacity-90 active:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--color-primary-40)" }}
          onClick={() => navigate("/orders/add")}
        >
          <Plus className="h-4 w-4" />
          Novo pedido
        </Button>
      }
    >
      {error && (
        <p className="text-sm text-destructive mb-4">{error.message}</p>
      )}

      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <OrderSection
              title="Pendentes"
              orders={pendingOrders}
              onMarkAsDelivered={setOrderToMarkAsDelivered}
              onAddPayment={(order) => {
                setOrderForPayment(order);
                setIsPaymentDialogOpen(true);
              }}
              onDeleteOrder={setOrderToDelete}
            />

            <OrderSection
              title="Entregues"
              orders={completedOrders}
              onAddPayment={(order) => {
                setOrderForPayment(order);
                setIsPaymentDialogOpen(true);
              }}
              onDeleteOrder={setOrderToDelete}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!orderToMarkAsDelivered}
        onOpenChange={(open) => !open && setOrderToMarkAsDelivered(null)}
        title="Marcar pedido como entregue?"
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
        title="Excluir este pedido?"
        description={orderToDelete ? `Pedido #${orderToDelete.id}` : ""}
        onConfirm={handleDeleteOrder}
        confirmLabel="Excluir"
        variant="destructive"
      />

      {orderForPayment && (
        <PaymentDialog
          mode="add"
          open={isPaymentDialogOpen}
          onOpenChange={(open) => {
            setIsPaymentDialogOpen(open);
            if (!open) setOrderForPayment(null);
          }}
          order={orderForPayment}
          onSuccess={() => {
            setIsPaymentDialogOpen(false);
            setOrderForPayment(null);
            refetch();
          }}
        />
      )}
    </PageContainer>
  );
}
