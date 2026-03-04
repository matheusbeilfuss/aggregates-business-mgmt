import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageContainer, FormActions, LoadingState } from "@/components/shared";
import { DatePicker } from "@/components/shared/DatePicker";
import { UseFormReturn } from "react-hook-form";

import { OrderFormData } from "../schemas/order.schemas";
import { ProductSelect } from "./ProductSelect";
import { QuantityCombobox } from "./QuantityCombobox";
import { ClientCombobox } from "./ClientCombobox";
import { toIsoDate } from "@/utils/";
import { useEffect, useMemo } from "react";

import { selectPreferredPhone } from "../utils/selectPreferredPhone";
import { PhoneTypeSelect } from "./PhoneTypeSelect";
import { Product } from "@/modules/product/types";
import { Client } from "@/modules/client/types";
import { useClient } from "@/modules/client/hooks";
import { useCategoryPrices } from "@/modules/price/hooks";

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
  const m3Quantity = form.watch("m3Quantity");
  const clientId = form.watch("clientId");

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId],
  );

  const categoryId = selectedProduct?.category?.id;
  const { data: categoryPrices } = useCategoryPrices(categoryId);

  const { data: client } = useClient(clientId);

  useEffect(() => {
    if (!client) return;

    form.setValue("clientName", client.name);
    form.setValue("cpfCnpj", client.cpfCnpj);

    if (client.address) {
      form.setValue("state", client.address.state);
      form.setValue("city", client.address.city);
      form.setValue("neighborhood", client.address.neighborhood);
      form.setValue("street", client.address.street);
      form.setValue("number", client.address.number);
    }

    if (client.phones?.length) {
      const preferredPhone = selectPreferredPhone(client.phones);
      if (preferredPhone) {
        form.setValue("phone", preferredPhone.number);
        form.setValue("phoneType", preferredPhone.type);
      }
    }
  }, [client, form]);

  useEffect(() => {
    if (orderType === "SERVICE") {
      form.setValue("productId", undefined);
      form.setValue("m3Quantity", undefined);
      form.setValue("orderValue", undefined);
    }

    if (orderType === "MATERIAL") {
      form.setValue("service", "");
    }
  }, [orderType, form]);

  useEffect(() => {
    if (orderType !== "MATERIAL") return;

    if (m3Quantity == null) {
      form.setValue("orderValue", undefined);
      return;
    }

    const price = (categoryPrices ?? []).find(
      (p) => p.m3Volume === m3Quantity,
    )?.price;

    form.setValue("orderValue", price);
  }, [orderType, m3Quantity, categoryPrices, form]);

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
                      onChange={(date: Date) => field.onChange(toIsoDate(date))}
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
                      onChange={(value) => {
                        field.onChange(value);
                        form.setValue("clientId", undefined);
                      }}
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
            <div className="flex gap-4 w-full">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tipo</FormLabel>
                    <PhoneTypeSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
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
                      type="text"
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
                      type="text"
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
                      type="text"
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
                      type="text"
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
                      type="text"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
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
                        type="text"
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
                name="m3Quantity"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <QuantityCombobox
                        value={field.value}
                        prices={categoryPrices ?? []}
                        onChange={field.onChange}
                        disabled={!productId}
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
                    <Textarea {...field} onFocus={(e) => e.target.select()} />
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
