import { FormActions, LoadingState, PageContainer } from "@/components/shared";
import { DatePicker } from "@/components/shared/DatePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { OrderFormData, orderSchema } from "../schemas/order.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProducts } from "@/modules/stock/hooks/useStocks";
import { ProductSelect } from "../components/ProductSelect";
import { useClients } from "../hooks/useClients";
import { ClientCombobox } from "../components/ClientCombobox";

export function OrderAdd() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: products, loading: productsLoading } = useProducts();
  const { data: clients, loading: clientsLoading } = useClients();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      type: "MATERIAL",
    },
  });

  const orderType = form.watch("type");

  useEffect(() => {
    if (orderType === "MATERIAL") {
      form.setValue("service", undefined);
    }

    if (orderType === "SERVICE") {
      form.setValue("productId", undefined);
      form.setValue("quantity", undefined);
    }
  }, [orderType, form]);

  const loading = productsLoading || clientsLoading;

  if (loading) {
    return (
      <PageContainer title="Adicionar pedido">
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Adicionar pedido">
      <Form {...form}>
        <form>
          <div className="mb-10">
            <DatePicker
              value={selectedDate}
              onChange={function (date: Date): void {
                setSelectedDate(date);
              }}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>

                  <ClientCombobox
                    value={field.value ?? ""}
                    clientId={form.watch("clientId")}
                    clients={clients ?? []}
                    onChange={(value) => {
                      form.setValue("clientId", undefined);
                      field.onChange(value);
                    }}
                    onClientSelect={(client) => {
                      field.onChange(client.name);
                      form.setValue("clientId", client.id);
                      form.setValue("cpfCnpj", client.cpfCnpj);
                    }}
                  />

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
                      type="number"
                      value={field.value ?? ""}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <ProductSelect
                      value={field.value}
                      onChange={field.onChange}
                      products={products ?? []}
                    />
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
                        value={field.value ?? ""}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      value={field.value ?? ""}
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade (m³)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      value={field.value ?? ""}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      onFocus={(e) => e.target.select()}
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
                      type="string"
                      value={field.value ?? ""}
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
                      value={field.value ?? ""}
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <FormActions cancelPath="/orders" submitLabel="Adicionar" />
    </PageContainer>
  );
}
