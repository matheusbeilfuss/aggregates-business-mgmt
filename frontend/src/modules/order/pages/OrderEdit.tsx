import { useNavigate, useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import { useProducts } from "@/modules/stock/hooks/useStocks";
import { useClient, useClients } from "../hooks/useClients";
import { OrderFormData, orderSchema } from "../schemas/order.schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { orderService } from "../services/order.service";
import { OrderForm } from "../components/OrderForm";
import { CreateOrderPayload } from "../types";
import { selectPreferredPhone } from "../utils/selectPreferredPhone";

export function OrderEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, loading: orderLoading } = useOrder(id!);
  const { data: products } = useProducts();
  const { data: clients } = useClients();
  const { data: client } = useClient(
    order?.client ? String(order.client.id) : null,
  );

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
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
  }, [order, form]);

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

    await orderService.update(id!, payload);
    navigate("/orders");
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
