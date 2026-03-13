import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { OrderForPayment } from "@/modules/order/types";
import { Payment } from "@/modules/finance/types";
import { PaymentMethodSelect } from "@/modules/finance/components/PaymentMethodSelect";
import {
  paymentSchema,
  PaymentFormData,
} from "@/modules/finance/schemas/payment.schemas";
import {
  formatLocalCurrency,
  formatLocalDate,
  formatTime,
  toIsoDate,
} from "@/utils";

type AddMode = { mode: "add"; order: OrderForPayment };
type EditMode = { mode: "edit"; payment: Payment };

type Props = (AddMode | EditMode) & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function PaymentDialog({
  open,
  onOpenChange,
  onSuccess,
  ...props
}: Props) {
  const isEdit = props.mode === "edit";
  const order = isEdit ? props.payment.order : props.order;
  const orderLabel = order.product ? order.product.name : order.service;

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: isEdit
      ? undefined
      : {
          paymentMethod: undefined,
          paymentValue: 0,
          date: toIsoDate(new Date()),
        },
    values: isEdit
      ? {
          paymentValue: props.payment.paymentValue,
          paymentMethod: props.payment.paymentMethod,
          date: props.payment.date,
        }
      : undefined,
  });

  const onSubmit = async (values: PaymentFormData) => {
    try {
      if (isEdit) {
        await api.put(`/payments/${props.payment.id}`, values);
        toast.success("Entrada atualizada com sucesso.");
      } else {
        await api.post("/payments", { ...values, orderId: order.id });
        toast.success("Pagamento adicionado com sucesso.");
      }
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error(
          isEdit
            ? "Não foi possível atualizar a entrada."
            : "Não foi possível adicionar o pagamento.",
        );
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar entrada" : "Adicionar pagamento"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edite os detalhes do pagamento para o pedido abaixo"
              : "Insira os detalhes do pagamento para o pedido abaixo"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start justify-between gap-6 rounded-lg border bg-muted/40 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Pedido #{order.id}</p>
            <p className="text-sm text-muted-foreground">
              {order.client.name} - {orderLabel}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatLocalDate(order.scheduledDate)} às{" "}
              {formatTime(order.scheduledTime)}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div>
              <p className="text-xs text-muted-foreground">Valor total</p>
              <p className="text-lg font-semibold">
                {formatLocalCurrency(order.orderValue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Falta pagar</p>
              <p
                className={`text-sm font-medium ${order.remainingValue <= 0 ? "text-green-500" : "text-orange-500"}`}
              >
                {formatLocalCurrency(order.remainingValue)}
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 pt-4"
          >
            <FormField
              control={form.control}
              name="paymentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do pagamento</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de pagamento</FormLabel>
                  <FormControl>
                    <PaymentMethodSelect
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do pagamento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
