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
import {
  PageContainer,
  FormActions,
  LoadingState,
  PhoneTypeSelect,
} from "@/components/shared";
import { DatePicker } from "@/components/shared/DatePicker";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { OrderFormData } from "../schemas/order.schemas";
import { ProductSelect } from "./ProductSelect";
import { QuantityCombobox } from "./QuantityCombobox";
import { ClientCombobox } from "./ClientCombobox";
import {
  toIsoDate,
  selectPrimaryPhone,
  formatPhone,
  formatCpfCnpj,
  formatCep,
} from "@/utils";
import { useEffect, useMemo } from "react";

import { Product } from "@/modules/product/types";
import { useClient } from "@/modules/client/hooks";
import { useCategoryPrices } from "@/modules/price/hooks";
import { useCepLookup } from "@/hooks/useCepLookup";

interface OrderFormProps {
  title: string;
  form: UseFormReturn<OrderFormData>;
  products: Product[];
  loading?: boolean;
  onSubmit: (data: OrderFormData) => void;
  submitLabel: string;
}

export function OrderForm({
  title,
  form,
  products,
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

  const cep = useWatch({ control: form.control, name: "cep" });
  const {
    address: cepAddress,
    loading: cepLoading,
    error: cepError,
  } = useCepLookup(cep ?? "");

  useEffect(() => {
    if (!client) return;

    form.setValue("clientName", client.name);
    form.setValue("cpfCnpj", formatCpfCnpj(client.cpfCnpj ?? ""));

    if (client.address) {
      form.setValue("cep", formatCep(client.address.cep ?? ""));
      form.setValue("street", client.address.street);
      form.setValue("number", client.address.number);
      form.setValue("complement", client.address.complement ?? "");
      form.setValue("neighborhood", client.address.neighborhood);
      form.setValue("city", client.address.city);
      form.setValue("state", client.address.state);
    }

    if (client.phones?.length) {
      const primaryPhone = selectPrimaryPhone(client.phones);
      if (primaryPhone) {
        form.setValue("phone", formatPhone(primaryPhone.number));
        form.setValue("phoneType", primaryPhone.type);
      }
    }
  }, [client, form]);

  useEffect(() => {
    if (!cepAddress) return;
    form.setValue("street", cepAddress.street, { shouldValidate: true });
    form.setValue("neighborhood", cepAddress.neighborhood, {
      shouldValidate: true,
    });
    form.setValue("city", cepAddress.city, { shouldValidate: true });
    form.setValue("state", cepAddress.state, { shouldValidate: true });
  }, [cepAddress, form]);

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
                        onChange={(e) =>
                          field.onChange(formatPhone(e.target.value))
                        }
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
                      {...field}
                      type="text"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        field.onChange(formatCpfCnpj(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CEP{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="text"
                        placeholder="00000-000"
                        onChange={(e) =>
                          field.onChange(formatCep(e.target.value))
                        }
                      />
                      {cepLoading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </FormControl>
                  {cepError && (
                    <p className="text-sm text-destructive">{cepError}</p>
                  )}
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
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
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
              name="complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Complemento{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Apto, bloco, sala..."
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
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
                        {...field}
                        type="text"
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
                      {...field}
                      value={field.value ?? ""}
                      type="number"
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
                      {...field}
                      type="time"
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
                  <FormLabel>
                    Informações adicionais{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </FormLabel>
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
