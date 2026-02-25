import { useNavigate } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import { useProducts } from "@/modules/stock/hooks/useStocks";
import { useClient, useClients } from "../hooks/useClients";
import { OrderFormData, orderSchema } from "../schemas/order.schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { orderService } from "../services/order.service";
import { OrderForm } from "./OrderForm";
import { CreateOrderPayload } from "../types";
import { selectPreferredPhone } from "../utils/selectPreferredPhone";
import { orderFormDefaults } from "../utils/orderFormDefaults";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";

interface OrderEditFormProps {
  orderId: number;
}

export function OrderEditForm({ orderId }: OrderEditFormProps) {
  const navigate = useNavigate();

  const { data: order, loading: orderLoading } = useOrder(orderId);
  const { data: products } = useProducts();
  const { data: clients } = useClients();
  const { data: client } = useClient(
    order?.client ? String(order.client.id) : null,
  );

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: orderFormDefaults,
  });

  useEffect(() => {
    if (!order) return;

    form.reset({
      type: order.type,
      scheduledDate: order.scheduledDate,
      scheduledTime: order.scheduledTime,
      observations: order.observations ?? "",
      orderValue: order.orderValue,

      clientId: order.client.id,
      clientName: order.client.name,
      phone: client?.phones?.length
        ? (selectPreferredPhone(client.phones)?.number ?? "")
        : "",
      cpfCnpj: order.client.cpfCnpj,
      state: order.orderAddress.state,
      city: order.orderAddress.city,
      neighborhood: order.orderAddress.neighborhood,
      street: order.orderAddress.street,
      number: order.orderAddress.number,
      productId: order.product?.id,
      quantity: order.quantity ?? undefined,
      service: order.service ?? "",
    });
  }, [order, client, form]);

  const onSubmit = async (data: OrderFormData) => {
    const payload: CreateOrderPayload = {
      type: data.type,
      clientId: data.clientId!,
      state: data.state,
      city: data.city,
      street: data.street,
      number: data.number,
      neighborhood: data.neighborhood,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      observations: data.observations ?? null,
      orderValue: data.orderValue!,
      productId: data.type === "MATERIAL" ? data.productId! : null,
      quantity: data.type === "MATERIAL" ? data.quantity : undefined,
      service: data.type === "SERVICE" ? (data.service ?? null) : null,
    };

    try {
      await orderService.update(orderId, payload);

      toast.success("Pedido atualizado com sucesso.");
      navigate("/orders");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível atualizar o pedido.");
      }
    }
  };

  return (
    <OrderForm
      title="Editar pedido"
      form={form}
      products={products ?? []}
      clients={clients ?? []}
      loading={orderLoading}
      onSubmit={onSubmit}
      submitLabel="Salvar alterações"
    />
  );
}
