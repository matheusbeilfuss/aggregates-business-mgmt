import { OrderItem } from "@/modules/order/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { orderService } from "@/modules/order/services/order.service";
import { Loader2 } from "lucide-react";
import {
  formatLocalCurrency,
  formatLocalDate,
  formatTime,
  toIsoDate,
} from "@/utils";
import { Input } from "../ui/input";
import { ApiError } from "@/lib/api";
import { PaymentMethodSelect } from "@/modules/finance/components/PaymentMethodSelect";
import {
  PaymentFormData,
  paymentSchema,
} from "@/modules/finance/schemas/payment.schemas";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderItem;
  onSuccess: () => void;
}

export function AddPaymentDialog({
  open,
  onOpenChange,
  order,
  onSuccess,
}: AddPaymentDialogProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: undefined,
      paymentValue: 0,
      date: toIsoDate(new Date()),
    },
  });

  async function onSubmit(data: PaymentFormData) {
    try {
      await orderService.addPayment(
        order.id,
        data.paymentValue,
        data.paymentMethod,
        data.date,
      );

      toast.success("Pagamento adicionado com sucesso");
      form.reset();
      onSuccess();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível adicionar o pagamento");
      }
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  const orderLabel = order.product ? order.product.name : order.service;

  const remaining = order.remainingValue;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar pagamento</DialogTitle>
          <DialogDescription>
            Insira os detalhes do pagamento para o pedido abaixo
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
                className={`text-sm font-medium ${remaining <= 0 ? "text-green-500" : "text-orange-500"}`}
              >
                {formatLocalCurrency(Math.max(remaining, 0))}
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full gap-4 pt-4"
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
                      value={field.value}
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

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
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
