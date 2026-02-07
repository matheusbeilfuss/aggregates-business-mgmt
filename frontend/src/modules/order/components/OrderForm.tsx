import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageContainer, FormActions, LoadingState } from "@/components/shared";
import { DatePicker } from "@/components/shared/DatePicker";
import { UseFormReturn } from "react-hook-form";

import { OrderFormData } from "../schemas/order.schemas";
import { ProductSelect } from "./ProductSelect";
import { QuantitySelect } from "./QuantitySelect";
import { ClientCombobox } from "./ClientCombobox";
import { toISODate } from "../utils/toIsoDate";
import { Product } from "@/modules/stock/types";
import { Client } from "../types";
import { useEffect, useMemo } from "react";

import { usePrices } from "../hooks/useOrders";
import { useClient } from "../hooks/useClients";
import { selectPreferredPhone } from "../utils/selectPreferredPhone";

interface OrderFormProps {
  title: string;
  form: UseFormReturn<OrderFormData>;
  products: Product[];
  clients: Client[];
  loading?: boolean;
  onSubmit: (data: OrderFormData) => void;
  submitLabel: string;
}

export function OrderForm({
  title,
  form,
  products,
  clients,
  loading = false,
  onSubmit,
  submitLabel,
}: OrderFormProps) {
  const orderType = form.watch("type");
  const productId = form.watch("productId");
  const quantity = form.watch("quantity");
  const clientId = form.watch("clientId");

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId],
  );

  const categoryId = selectedProduct?.category?.id ?? null;
  const { data: categoryPrices = [] } = usePrices(categoryId);

  const { data: client } = useClient(clientId ? String(clientId) : null);

  useEffect(() => {
    if (!client) return;

    form.setValue("clientName", client.name);
    form.setValue("cpfCnpj", client.cpfCnpj);
    form.setValue("state", client.state);
    form.setValue("city", client.city);
    form.setValue("neighborhood", client.neighborhood);
    form.setValue("street", client.street);
    form.setValue("number", client.number);

    if (client.phones?.length) {
      form.setValue("phone", selectPreferredPhone(client.phones)?.number ?? "");
    }
  }, [client, form]);

  const calculatedOrderValue = useMemo(() => {
    if (orderType !== "MATERIAL" || quantity == null) return 0;
    return categoryPrices.find((p) => p.m3Volume === quantity)?.price ?? 0;
  }, [orderType, quantity, categoryPrices]);

  useEffect(() => {
    form.setValue("orderValue", calculatedOrderValue);
  }, [calculatedOrderValue, form]);

  if (loading) {
    return (
      <PageContainer title={title}>
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title={title}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-10">
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePicker
                      value={
                        field.value
                          ? new Date(`${field.value}T00:00:00`)
                          : new Date()
                      }
                      onChange={(date: Date) => field.onChange(toISODate(date))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo do pedido</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-6"
                    >
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="MATERIAL" />
                        </FormControl>
                        <FormLabel className="font-normal">Material</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="SERVICE" />
                        </FormControl>
                        <FormLabel className="font-normal">Serviço</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <ClientCombobox
                      value={field.value ?? ""}
                      clientId={form.watch("clientId")}
                      clients={clients ?? []}
                      onChange={field.onChange}
                      onClientSelect={(client) => {
                        field.onChange(client.name);
                        form.setValue("clientId", client.id);
                      }}
                      className={
                        fieldState.error
                          ? "border border-red-500 rounded-md"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="string"
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      {...field}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      {...field}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      {...field}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      {...field}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
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
            {orderType === "MATERIAL" && (
              <FormField
                control={form.control}
                name="productId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <ProductSelect
                        value={field.value}
                        onChange={field.onChange}
                        products={products ?? []}
                        className={
                          fieldState.error
                            ? "border border-red-500 rounded-md"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {orderType === "SERVICE" && (
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serviço</FormLabel>
                    <FormControl>
                      <Input
                        type="string"
                        {...field}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {orderType === "MATERIAL" && (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <QuantitySelect // TROCAR PARA COMBOBOX
                        value={field.value}
                        prices={categoryPrices}
                        onChange={field.onChange}
                        disabled={categoryPrices.length === 0}
                        className={
                          fieldState.error
                            ? "border border-red-500 rounded-md"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="orderValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
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
              name="scheduledTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full mt-6">
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informações adicionais</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      {...field}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormActions
            cancelPath="/orders"
            submitLabel={submitLabel}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </form>
      </Form>
    </PageContainer>
  );
}
