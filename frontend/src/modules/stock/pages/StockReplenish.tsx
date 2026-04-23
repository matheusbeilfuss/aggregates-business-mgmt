import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Truck, Package, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PageContainer,
  LoadingState,
  FormActions,
  FormSection,
  CurrencyInput,
} from "@/components/shared";
import { useStock } from "../hooks";
import { stockService } from "../services/stock.service";
import {
  replenishSchema,
  type ReplenishFormData,
} from "../schemas/stock.schemas";
import {
  tonToM3,
  m3ToTon,
  calculateExpenseValue,
  parseInputNumber,
} from "../utils/calculations";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useProductSuppliersByProductId } from "@/modules/product-supplier/hooks";
import type { ProductSupplier } from "@/modules/product-supplier/types";

export function StockReplenish() {
  usePageTitle("Adicionar estoque");

  const navigate = useNavigate();
  const { id: rawStockId } = useParams<{ id: string }>();
  const stockId = Number(rawStockId);
  const validId = Number.isFinite(stockId) && stockId > 0;

  const {
    data: stock,
    loading: stockLoading,
    error: stockError,
  } = useStock(stockId, { enabled: validId });
  const { data: productSuppliers, loading: suppliersLoading } =
    useProductSuppliersByProductId(stock?.product.id, {
      enabled: !!stock?.product.id,
    });

  const [userEditedM3, setUserEditedM3] = useState(false);
  const [userEditedTon, setUserEditedTon] = useState(false);
  const [userEditedExpenseValue, setUserEditedExpenseValue] = useState(false);

  const form = useForm<ReplenishFormData>({
    resolver: zodResolver(replenishSchema),
    defaultValues: {
      supplierId: undefined,
      density: 0,
      tonQuantity: 0,
      m3Quantity: 0,
      expenseValue: 0,
      paymentStatus: "PAID",
    },
  });

  const loading = stockLoading || (!!stock && suppliersLoading);

  useEffect(() => {
    if (stockError) {
      toast.error("Não foi possível carregar o estoque.");
      navigate("/stocks");
    }
  }, [stockError, navigate]);

  if (!validId) return <Navigate to="/stocks" replace />;

  const getSelectedSupplier = (): ProductSupplier | undefined => {
    const supplierId = form.getValues("supplierId");
    return productSuppliers?.find((ps) => ps.supplierId === supplierId);
  };

  const updateExpenseValue = (tonQty: number, m3Qty: number) => {
    if (userEditedExpenseValue) return;
    const supplier = getSelectedSupplier();
    if (supplier) {
      form.setValue(
        "expenseValue",
        calculateExpenseValue(tonQty, m3Qty, supplier),
      );
    }
  };

  const handleSupplierChange = (supplierId: number) => {
    const selected = productSuppliers?.find(
      (ps) => ps.supplierId === supplierId,
    );
    setUserEditedExpenseValue(false);
    setUserEditedM3(false);
    setUserEditedTon(false);
    form.reset({
      supplierId,
      density: selected?.density ?? 0,
      tonQuantity: 0,
      m3Quantity: 0,
      expenseValue: 0,
      paymentStatus: "PAID",
    });
  };

  const handleTonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tonQuantity = parseInputNumber(e.target.value);
    setUserEditedTon(true);
    setUserEditedM3(false);
    const density = form.getValues("density");

    if (tonQuantity !== null && density > 0) {
      const m3Quantity = tonToM3(tonQuantity, density);
      form.setValue("m3Quantity", m3Quantity);
      updateExpenseValue(tonQuantity, m3Quantity);
    } else {
      form.setValue("m3Quantity", 0);
      updateExpenseValue(0, 0);
    }
  };

  const handleM3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m3Quantity = parseInputNumber(e.target.value);
    setUserEditedM3(true);
    setUserEditedTon(false);
    const density = form.getValues("density");

    if (m3Quantity !== null && density > 0) {
      const tonQuantity = m3ToTon(m3Quantity, density);
      form.setValue("tonQuantity", tonQuantity);
      updateExpenseValue(tonQuantity, m3Quantity);
    } else {
      form.setValue("tonQuantity", 0);
      updateExpenseValue(0, 0);
    }
  };

  const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const density = parseInputNumber(e.target.value);
    if (density === null || density <= 0) return;

    const currentTon = form.getValues("tonQuantity");
    const currentM3 = form.getValues("m3Quantity");

    if (userEditedM3 && !userEditedTon) {
      const newTon = m3ToTon(currentM3, density);
      form.setValue("tonQuantity", newTon);
      updateExpenseValue(newTon, currentM3);
    } else {
      const newM3 = tonToM3(currentTon, density);
      form.setValue("m3Quantity", newM3);
      updateExpenseValue(currentTon, newM3);
    }
  };

  const onSubmit = async (data: ReplenishFormData) => {
    if (!stock || !stockId) return;
    try {
      await stockService.replenish(stockId, {
        tonQuantity: data.tonQuantity,
        m3Quantity: data.m3Quantity,
        density: data.density,
        expenseValue: data.expenseValue,
        paymentStatus: data.paymentStatus,
      });
      toast.success("Estoque reabastecido com sucesso.");
      navigate("/stocks");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível reabastecer o estoque.",
      );
    }
  };

  if (loading) {
    return (
      <PageContainer title="Adicionar estoque">
        <LoadingState rows={6} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Adicionar estoque" subtitle={stock?.product.name}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-3xl mx-auto space-y-8">
            <FormSection icon={Truck} title="Fornecedor">
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Fornecedor</FormLabel>
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        handleSupplierChange(Number(value));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fornecedor..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productSuppliers?.map((ps) => (
                          <SelectItem
                            key={ps.id}
                            value={ps.supplierId.toString()}
                          >
                            {ps.supplierName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection icon={Package} title="Quantidades">
              <FormField
                control={form.control}
                name="density"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Densidade (Ton/m³)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDensityChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tonQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Toneladas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTonChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="m3Quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume (m³)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          field.onChange(e);
                          handleM3Change(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expenseValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor total</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          setUserEditedExpenseValue(true);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status do pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="PAID">Pago</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: "var(--color-error-container)" }}
            >
              <TriangleAlert
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: "var(--color-error)" }}
              />
              <div
                className="space-y-1 text-sm"
                style={{ color: "var(--color-on-error-container)" }}
              >
                <p className="font-semibold">Atenção</p>
                <p>
                  Uma{" "}
                  <strong>saída financeira será criada automaticamente</strong>{" "}
                  com o valor informado nesta tela.
                </p>
                <p>
                  A densidade informada aqui será salva no estoque e usada para
                  calcular a conversão entre toneladas e m³ nos{" "}
                  <strong>próximos pedidos criados</strong>.
                </p>
              </div>
            </div>
          </div>

          <FormActions
            cancelPath="/stocks"
            submitLabel="Adicionar"
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </form>
      </Form>
    </PageContainer>
  );
}
