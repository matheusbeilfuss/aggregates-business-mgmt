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
import { ConfirmDialog } from "@/components/shared";
import { useState } from "react";

export function OrderAdd() {
  usePageTitle("Novo pedido");

  const navigate = useNavigate();
  const { data: products, loading: productsLoading } = useProducts();

  const [pendingFormData, setPendingFormData] = useState<OrderFormData | null>(
    null,
  );
  const [openReceivablesDialogOpen, setOpenReceivablesDialogOpen] =
    useState(false);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: "onSubmit",
    defaultValues: orderFormDefaults,
  });

  async function proceedWithOrder(data: OrderFormData) {
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

        if (newClient?.id) {
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
  }

  async function checkConflictAndProceed(data: OrderFormData) {
    try {
      const hasConflict = await orderService.hasConflict(
        data.scheduledDate,
        data.scheduledTime,
      );

      if (hasConflict) {
        setPendingFormData(data);
        setConflictDialogOpen(true);
        return;
      }

      await proceedWithOrder(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível salvar o pedido.");
      }
    }
  }

  const onSubmit = async (data: OrderFormData) => {
    try {
      if (data.clientId) {
        const hasOpenReceivables = await orderService.hasOpenReceivables(
          data.clientId,
        );

        if (hasOpenReceivables) {
          setPendingFormData(data);
          setOpenReceivablesDialogOpen(true);
          return;
        }
      }

      await checkConflictAndProceed(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível salvar o pedido.");
      }
    }
  };

  return (
    <>
      <OrderForm
        title="Novo pedido"
        form={form}
        products={products ?? []}
        loading={productsLoading}
        onSubmit={onSubmit}
        submitLabel="Salvar"
      />

      <ConfirmDialog
        open={openReceivablesDialogOpen}
        onOpenChange={(open) => {
          setOpenReceivablesDialogOpen(open);
          if (!open) setPendingFormData(null);
        }}
        title="Cliente com cobrança em aberto"
        description="Este cliente possui cobranças em aberto. Deseja cadastrar o pedido mesmo assim?"
        onConfirm={async () => {
          setOpenReceivablesDialogOpen(false);
          if (pendingFormData) await checkConflictAndProceed(pendingFormData);
        }}
        confirmLabel="Continuar mesmo assim"
        variant="destructive"
      />

      <ConfirmDialog
        open={conflictDialogOpen}
        onOpenChange={(open) => {
          setConflictDialogOpen(open);
          if (!open) setPendingFormData(null);
        }}
        title="Conflito de horário"
        description="Já existe um pedido agendado para este dia e horário. Deseja cadastrar o pedido mesmo assim?"
        onConfirm={async () => {
          setConflictDialogOpen(false);
          if (pendingFormData) await proceedWithOrder(pendingFormData);
          setPendingFormData(null);
        }}
        confirmLabel="Continuar mesmo assim"
        variant="destructive"
      />
    </>
  );
}
