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
  CurrencyInput,
  FormSection,
} from "@/components/shared";
import { DatePicker } from "@/components/shared/DatePicker";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Loader2, User, MapPin, Package, Clock } from "lucide-react";
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
  stripNonDigits,
} from "@/utils";
import { useEffect, useMemo, useRef } from "react";
import { Product } from "@/modules/product/types";
import { useClient } from "@/modules/client/hooks";
import { useCategoryPrices } from "@/modules/price/hooks";
import { useCepLookup } from "@/hooks/useCepLookup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFormProps {
  title: string;
  form: UseFormReturn<OrderFormData>;
  products: Product[];
  loading?: boolean;
  isEditing?: boolean;
  onSubmit: (data: OrderFormData) => void;
  submitLabel: string;
}

export function OrderForm({
  title,
  form,
  products,
  loading = false,
  isEditing = false,
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

  const quantityChangedByUser = useRef(!isEditing);

  const prevClientId = useRef<number | undefined>(undefined);
  const cepSetByClient = useRef(false);

  useEffect(() => {
    if (!client) return;

    const isClientSwitch =
      prevClientId.current !== undefined && prevClientId.current !== client.id;
    prevClientId.current = client.id;

    form.setValue("clientName", client.name);
    form.setValue("cpfCnpj", formatCpfCnpj(client.cpfCnpj ?? ""));

    if (!isEditing || isClientSwitch) {
      if (client.address) {
        const clientCepDigits = stripNonDigits(client.address.cep ?? "");
        if (clientCepDigits.length === 8) {
          cepSetByClient.current = true;
        }
        form.setValue("cep", formatCep(client.address.cep ?? ""));
        form.setValue("street", client.address.street);
        form.setValue("number", client.address.number);
        form.setValue("complement", client.address.complement ?? "");
        form.setValue("neighborhood", client.address.neighborhood);
        form.setValue("city", client.address.city);
        form.setValue("state", client.address.state);
      } else if (isClientSwitch) {
        cepSetByClient.current = false;
        form.setValue("cep", "");
        form.setValue("street", "");
        form.setValue("number", "");
        form.setValue("complement", "");
        form.setValue("neighborhood", "");
        form.setValue("city", "");
        form.setValue("state", "");
      }
    }

    if (client.phones?.length) {
      const primaryPhone = selectPrimaryPhone(client.phones);
      if (primaryPhone) {
        form.setValue("phone", formatPhone(primaryPhone.number));
        form.setValue("phoneType", primaryPhone.type);
      }
    }
  }, [client, form, isEditing]);

  useEffect(() => {
    if (!cepAddress) return;

    if (cepSetByClient.current) {
      cepSetByClient.current = false;
      return;
    }

    const addressFields = [
      { name: "street" as const, value: cepAddress.street },
      { name: "neighborhood" as const, value: cepAddress.neighborhood },
      { name: "city" as const, value: cepAddress.city },
      { name: "state" as const, value: cepAddress.state },
    ];

    addressFields.forEach(({ name, value }) => {
      if (value) form.setValue(name, value, { shouldValidate: true });
    });
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
    if (!quantityChangedByUser.current) return;
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
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-medium">
                      Tipo do pedido
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-3 mt-1"
                      >
                        {[
                          { value: "MATERIAL", label: "Material" },
                          { value: "SERVICE", label: "Serviço" },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border
                                       cursor-pointer transition-colors text-sm select-none"
                            style={{
                              borderColor:
                                field.value === opt.value
                                  ? "var(--color-primary-40)"
                                  : "var(--color-outline-variant)",
                              backgroundColor:
                                field.value === opt.value
                                  ? "var(--color-primary-90)"
                                  : "transparent",
                              color:
                                field.value === opt.value
                                  ? "var(--color-primary-10)"
                                  : "var(--color-on-surface-variant)",
                            }}
                          >
                            <RadioGroupItem
                              value={opt.value}
                              className="sr-only"
                            />
                            {opt.label}
                          </label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="shrink-0">
                    <FormLabel className="text-sm font-medium">
                      Status
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="DELIVERED">Entregue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormSection icon={User} title="Cliente">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field, fieldState }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Nome <span className="text-destructive">*</span>
                    </FormLabel>
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
                            ? "border border-destructive rounded-md"
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
                name="cpfCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      CPF / CNPJ{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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

              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Telefone <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
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
                    <FormItem className="w-32 shrink-0">
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
            </FormSection>

            <FormSection icon={MapPin} title="Endereço">
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      CEP{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="00000-000"
                          onChange={(e) =>
                            field.onChange(formatCep(e.target.value))
                          }
                        />
                        {cepLoading && (
                          <Loader2
                            className="absolute right-3 top-1/2 -translate-y-1/2
                                       h-4 w-4 animate-spin text-muted-foreground"
                          />
                        )}
                      </div>
                    </FormControl>
                    {cepError && (
                      <p className="text-xs text-destructive">{cepError}</p>
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
                    <FormLabel>
                      Rua <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
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
                    <FormLabel>
                      Número <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
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
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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
                    <FormLabel>
                      Bairro <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
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
                    <FormLabel>
                      Cidade <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
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
                    <FormLabel>
                      Estado <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection icon={Package} title="Pedido">
              {orderType === "MATERIAL" && (
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Material <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <ProductSelect
                          value={field.value}
                          onChange={field.onChange}
                          products={products ?? []}
                          className={
                            fieldState.error
                              ? "border border-destructive rounded-md"
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
                      <FormLabel>
                        Serviço <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} onFocus={(e) => e.target.select()} />
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
                      <FormLabel>
                        Quantidade <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <QuantityCombobox
                          value={field.value}
                          prices={categoryPrices ?? []}
                          onChange={(val) => {
                            quantityChangedByUser.current = true;
                            field.onChange(val);
                          }}
                          disabled={!productId}
                          className={
                            fieldState.error
                              ? "border border-destructive rounded-md"
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
                    <FormLabel>
                      Valor <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection icon={Clock} title="Agendamento">
              <div className="flex gap-3 md:col-span-1 md:max-w-sm">
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Data <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={
                            field.value
                              ? new Date(`${field.value}T00:00:00`)
                              : new Date()
                          }
                          onChange={(date: Date) =>
                            field.onChange(toIsoDate(date))
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
                    <FormItem className="flex-1">
                      <FormLabel>
                        Horário <span className="text-destructive">*</span>
                      </FormLabel>
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

              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Informações adicionais{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        onFocus={(e) => e.target.select()}
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>
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
