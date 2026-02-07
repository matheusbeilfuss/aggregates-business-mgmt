import { useForm } from "react-hook-form";
import { OrderFormData, orderSchema } from "../schemas/order.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "@/modules/stock/hooks/useStocks";
import { useClients } from "../hooks/useClients";
import { CreateOrderPayload } from "../types";
import { orderService } from "../services/order.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { toISODate } from "../utils/toIsoDate";
import { OrderForm } from "../components/OrderForm";

export function OrderAdd() {
  const navigate = useNavigate();
  const { data: products, loading: productsLoading } = useProducts();
  const { data: clients, loading: clientsLoading } = useClients();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: "onSubmit",
    defaultValues: {
      scheduledDate: toISODate(new Date()),
      type: "MATERIAL",
      clientName: "",
      clientId: undefined,
      phone: "",
      cpfCnpj: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      productId: undefined,
      service: "",
      quantity: undefined,
      orderValue: undefined,
      scheduledTime: "",
      observations: "",
    },
  });

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
      await orderService.create(payload);
      toast.success("O pedido foi criado com sucesso.");
      navigate("/orders");
    } catch {
      toast.error("Não foi possível salvar o pedido.");
    }
  };

  return (
    <OrderForm
      title="Adicionar pedido"
      form={form}
      products={products ?? []}
      clients={clients ?? []}
      loading={productsLoading || clientsLoading}
      onSubmit={onSubmit}
      submitLabel="Adicionar"
    />
  );
}
