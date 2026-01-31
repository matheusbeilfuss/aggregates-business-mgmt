import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

import { PageContainer, LoadingState, FormActions } from "@/components/shared";
import { useStock } from "../hooks";
import { useProductSuppliers } from "../hooks/useProductSuppliers";
import { stockService } from "../services/stock.service";
import {
  replenishSchema,
  type ReplenishFormData,
} from "../schemas/stock.schemas";
import { tonToM3, m3ToTon, calculateExpenseValue } from "../utils/calculations";
import type { ProductSupplier } from "../types";

export function StockReplenish() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: stock, loading: stockLoading } = useStock(id!);
  const { data: productSuppliers, loading: suppliersLoading } =
    useProductSuppliers(stock?.product.id ?? null);

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

  const loading = stockLoading || suppliersLoading;

  const getSelectedSupplier = (): ProductSupplier | undefined => {
    const supplierId = form.getValues("supplierId");
    return productSuppliers?.find((ps) => ps.supplierId === supplierId);
  };

  const updateExpenseValue = (tonQty: number, m3Qty: number) => {
    if (userEditedExpenseValue) return;
    const supplier = getSelectedSupplier();
    if (supplier) {
      const value = calculateExpenseValue(tonQty, m3Qty, supplier);
      form.setValue("expenseValue", value);
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
    const tonQuantity = parseFloat(e.target.value) || 0;
    form.setValue("tonQuantity", tonQuantity);
    setUserEditedTon(true);
    setUserEditedM3(false);

    const density = form.getValues("density");
    if (density > 0) {
      const m3Quantity = tonToM3(tonQuantity, density);
      form.setValue("m3Quantity", m3Quantity);
      updateExpenseValue(tonQuantity, m3Quantity);
    }
  };

  const handleM3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m3Quantity = parseFloat(e.target.value) || 0;
    form.setValue("m3Quantity", m3Quantity);
    setUserEditedM3(true);
    setUserEditedTon(false);

    const density = form.getValues("density");
    if (density > 0) {
      const tonQuantity = m3ToTon(m3Quantity, density);
      form.setValue("tonQuantity", tonQuantity);
      updateExpenseValue(tonQuantity, m3Quantity);
    }
  };

  const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const density = parseFloat(e.target.value) || 0;
    form.setValue("density", density);

    const currentTon = form.getValues("tonQuantity");
    const currentM3 = form.getValues("m3Quantity");

    if (density > 0) {
      if (userEditedM3 && !userEditedTon) {
        const newTon = m3ToTon(currentM3, density);
        form.setValue("tonQuantity", newTon);
        updateExpenseValue(newTon, currentM3);
      } else {
        const newM3 = tonToM3(currentTon, density);
        form.setValue("m3Quantity", newM3);
        updateExpenseValue(currentTon, newM3);
      }
    }
  };

  const onSubmit = async (data: ReplenishFormData) => {
    if (!stock || !id) return;

    try {
      await stockService.replenish(id, {
        tonQuantity: data.tonQuantity,
        m3Quantity: data.m3Quantity,
        expenseValue: data.expenseValue,
        paymentStatus: data.paymentStatus,
      });

      toast.success("Estoque reabastecido com sucesso!");
      navigate("/stocks");
    } catch {
      toast.error("Erro ao reabastecer o estoque.");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
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
                      <SelectItem key={ps.id} value={ps.supplierId.toString()}>
                        {ps.supplierName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="density"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Densidade (Ton/m³)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
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
                  <FormLabel>Valor Total (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        field.onChange(e);
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
                  <FormLabel>Status do Pagamento</FormLabel>
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
          </div>
        </form>
      </Form>

      <FormActions
        cancelPath="/stocks"
        submitLabel="Adicionar"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </PageContainer>
  );
}
