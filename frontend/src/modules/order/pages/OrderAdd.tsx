import { useForm } from "react-hook-form";
import { OrderFormData, orderSchema } from "../schemas/order.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "@/modules/stock/hooks/useStocks";
import { useClients } from "../hooks/useClients";
import { CreateClientPayload, CreateOrderPayload } from "../types";
import { clientService, orderService } from "../services/order.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { OrderForm } from "../components/OrderForm";
import { orderFormDefaults } from "../utils/orderFormDefaults";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";

export function OrderAdd() {
  usePageTitle("Adicionar pedido");

  const navigate = useNavigate();
  const { data: products, loading: productsLoading } = useProducts();
  const { data: clients, loading: clientsLoading } = useClients();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: "onSubmit",
    defaultValues: orderFormDefaults,
  });

  const onSubmit = async (data: OrderFormData) => {
    try {
      let clientId = data.clientId;

      if (!clientId) {
        const newClientPayload: CreateClientPayload = {
          name: data.clientName!,
          phones: [
            {
              number: data.phone,
              type: data.phoneType,
            },
          ],
          cpfCnpj: data.cpfCnpj,
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        };

        const newClient = await clientService.create(newClientPayload);

        if (newClient && newClient.id) {
          clientId = newClient.id;
          toast.success(
            `Cliente "${newClient.name}" cadastrado automaticamente.`,
          );
        } else {
          throw new Error("Falha ao recuperar ID do novo cliente.");
        }
      }

      const payload: CreateOrderPayload = {
        type: data.type,
        clientId: clientId!,
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

      await orderService.create(payload);
      toast.success("O pedido foi criado com sucesso.");
      navigate("/orders");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível salvar o pedido.");
      }
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
