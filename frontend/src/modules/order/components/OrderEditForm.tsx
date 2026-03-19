import { useNavigate } from "react-router-dom";
import { OrderFormData, orderSchema } from "../schemas/order.schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { orderService } from "../services/order.service";
import { OrderForm } from "./OrderForm";
import { CreateOrderPayload } from "../types";
import { orderFormDefaults } from "../utils/orderFormDefaults";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { useOrder } from "../hooks";
import { useProducts } from "@/modules/product/hooks";
import { useClient } from "@/modules/client/hooks";
import {
  selectPrimaryPhone,
  formatPhone,
  formatCpfCnpj,
  formatCep,
  stripNonDigits,
} from "@/utils";

interface OrderEditFormProps {
  orderId: number;
}

export function OrderEditForm({ orderId }: OrderEditFormProps) {
  const navigate = useNavigate();

  const { data: order, loading: orderLoading } = useOrder(orderId);
  const { data: products } = useProducts();
  const { data: client } = useClient(order?.client?.id);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: orderFormDefaults,
  });

  useEffect(() => {
    if (!order) return;

    const primaryPhone = client?.phones?.length
      ? selectPrimaryPhone(client.phones)
      : null;

    form.reset({
      type: order.type,
      scheduledDate: order.scheduledDate,
      scheduledTime: order.scheduledTime,
      observations: order.observations ?? "",
      orderValue: order.orderValue,

      clientId: order.client.id,
      clientName: order.client.name,
      phone: primaryPhone ? formatPhone(primaryPhone.number) : "",
      phoneType: primaryPhone?.type ?? "WHATSAPP",
      cpfCnpj: formatCpfCnpj(order.client.cpfCnpj ?? ""),

      cep: formatCep(order.orderAddress.cep ?? ""),
      state: order.orderAddress.state,
      city: order.orderAddress.city,
      neighborhood: order.orderAddress.neighborhood,
      street: order.orderAddress.street,
      number: order.orderAddress.number,
      complement: order.orderAddress.complement ?? "",

      productId: order.product?.id,
      m3Quantity: order.m3Quantity ?? undefined,
      service: order.service ?? "",
    });
  }, [order, client, form]);

  const onSubmit = async (data: OrderFormData) => {
    const payload: CreateOrderPayload = {
      type: data.type,
      clientId: data.clientId!,
      state: data.state,
      city: data.city,
      cep: data.cep ? stripNonDigits(data.cep) : undefined,
      street: data.street,
      number: data.number,
      neighborhood: data.neighborhood,
      complement: data.complement || undefined,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      observations: data.observations ?? null,
      orderValue: data.orderValue!,
      productId: data.type === "MATERIAL" ? data.productId! : null,
      m3Quantity: data.type === "MATERIAL" ? data.m3Quantity : undefined,
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
      loading={orderLoading}
      onSubmit={onSubmit}
      submitLabel="Salvar alterações"
    />
  );
}
