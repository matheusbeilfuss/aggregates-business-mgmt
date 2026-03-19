import { useForm } from "react-hook-form";
import { OrderFormData, orderSchema } from "../schemas/order.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateOrderPayload } from "../types";
import { orderService } from "../services/order.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { OrderForm } from "../components/OrderForm";
import { orderFormDefaults } from "../utils/orderFormDefaults";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useProducts } from "@/modules/product/hooks";
import { clientService } from "@/modules/client/services/client.service";
import { CreateClientPayload } from "@/modules/client/types";
import { stripNonDigits } from "@/utils";

export function OrderAdd() {
  usePageTitle("Adicionar pedido");

  const navigate = useNavigate();
  const { data: products, loading: productsLoading } = useProducts();

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
            { number: stripNonDigits(data.phone), type: data.phoneType },
          ],
          cpfCnpj: data.cpfCnpj ? stripNonDigits(data.cpfCnpj) : undefined,
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          cep: data.cep ? stripNonDigits(data.cep) : undefined,
          complement: data.complement || undefined,
        };

        const newClient = await clientService.insert(newClientPayload);

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
        cep: data.cep ? stripNonDigits(data.cep) : undefined,
        state: data.state,
        city: data.city,
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

      await orderService.insert(payload);
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
      loading={productsLoading}
      onSubmit={onSubmit}
      submitLabel="Adicionar"
    />
  );
}
