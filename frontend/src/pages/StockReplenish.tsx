import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

interface ProductSupplier {
  id: number;
  supplierId: number;
  supplierName: string;
  tonCost: number;
  costPerCubicMeter: number;
  costFor5CubicMeters?: number;
  density: number;
}

interface Product {
  id: number;
  name: string;
}

interface Stock {
  id: number;
  product: Product;
}

const replenishSchema = z.object({
  supplierId: z.number().min(1, "Selecione um fornecedor"),
  density: z.coerce.number().min(0.001, "Densidade inválida"),
  tonQuantity: z.coerce.number().min(0.01, "Quantidade inválida"),
  m3Quantity: z.coerce.number().min(0.01, "Quantidade inválida"),
  expenseValue: z.coerce.number().min(0, "Valor inválido"),
  paymentStatus: z.enum(["PAID", "PENDING"]),
});

type ReplenishFormData = z.infer<typeof replenishSchema>;

export function StockReplenish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState<Stock | null>(null);
  const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>(
    [],
  );

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

  async function loadData() {
    try {
      const stockRes = await fetch(`${apiUrl}/stocks/${id}`);
      if (!stockRes.ok) {
        throw new Error("Erro ao buscar estoque");
      }
      const stockData: Stock = await stockRes.json();
      setStock(stockData);

      const suppliersRes = await fetch(
        `${apiUrl}/product-suppliers/${stockData.product.id}`,
      );
      if (!suppliersRes.ok) {
        throw new Error("Erro ao buscar fornecedores do produto");
      }
      const suppliersData: ProductSupplier[] = await suppliersRes.json();
      setProductSuppliers(suppliersData);
    } catch (error) {
      toast.error("Erro ao carregar dados");
      navigate("/stocks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const calculateExpenseValue = (
    currentTon: number,
    currentM3: number,
    supplierData: ProductSupplier,
  ) => {
    if (userEditedExpenseValue || !supplierData) return;

    let cost = 0;

    if (supplierData.tonCost && supplierData.tonCost > 0) {
      cost = currentTon * supplierData.tonCost;
    } else if (
      supplierData.costPerCubicMeter &&
      supplierData.costPerCubicMeter > 0
    ) {
      cost = currentM3 * supplierData.costPerCubicMeter;
    }

    form.setValue("expenseValue", parseFloat(cost.toFixed(2)));
  };

  const handleSupplierChange = (supplierId: number) => {
    form.setValue("supplierId", supplierId);

    setUserEditedExpenseValue(false);
    setUserEditedM3(false);
    setUserEditedTon(false);

    const selected = productSuppliers.find(
      (ps) => ps.supplierId === supplierId,
    );

    form.reset({
      supplierId,
      density: selected?.density ?? 0,
      tonQuantity: 0,
      m3Quantity: 0,
      expenseValue: 0,
      paymentStatus: "PAID",
    });

    if (selected) {
      form.setValue("density", selected.density || 0);

      const currentTon = form.getValues("tonQuantity");

      if (currentTon > 0 && selected.density > 0) {
        const newM3 = currentTon / selected.density;
        form.setValue("m3Quantity", parseFloat(newM3.toFixed(2)));
        calculateExpenseValue(currentTon, newM3, selected);
      }
    }
  };

  const handleTonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tonQuantity = parseFloat(e.target.value) || 0;
    form.setValue("tonQuantity", tonQuantity);
    setUserEditedTon(true);
    setUserEditedM3(false);

    const density = form.getValues("density");
    if (density > 0) {
      const m3Quantity = tonQuantity / density;
      form.setValue("m3Quantity", parseFloat(m3Quantity.toFixed(2)));

      const supplierId = form.getValues("supplierId");
      const supplier = productSuppliers.find(
        (ps) => ps.supplierId === supplierId,
      );
      if (supplier) {
        calculateExpenseValue(tonQuantity, m3Quantity, supplier);
      }
    }
  };

  const handleM3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m3Quantity = parseFloat(e.target.value) || 0;
    form.setValue("m3Quantity", m3Quantity);
    setUserEditedM3(true);
    setUserEditedTon(false);

    const density = form.getValues("density");
    if (density > 0) {
      const newTon = m3Quantity * density;
      form.setValue("tonQuantity", parseFloat(newTon.toFixed(2)));

      const supplierId = form.getValues("supplierId");
      const supplier = productSuppliers.find(
        (ps) => ps.supplierId === supplierId,
      );
      if (supplier) {
        calculateExpenseValue(newTon, m3Quantity, supplier);
      }
    }
  };

  const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const density = parseFloat(e.target.value) || 0;
    form.setValue("density", density);

    const currentTon = form.getValues("tonQuantity");
    const currentM3 = form.getValues("m3Quantity");

    if (density > 0) {
      if (userEditedM3 && !userEditedTon) {
        const newTon = currentM3 * density;
        form.setValue("tonQuantity", parseFloat(newTon.toFixed(2)));
      } else {
        const newM3 = currentTon / density;
        form.setValue("m3Quantity", parseFloat(newM3.toFixed(2)));
      }

      const supplierId = form.getValues("supplierId");
      const supplier = productSuppliers.find(
        (ps) => ps.supplierId === supplierId,
      );
      if (supplier) {
        const tonQuantity = form.getValues("tonQuantity");
        const m3Quantity = form.getValues("m3Quantity");
        calculateExpenseValue(tonQuantity, m3Quantity, supplier);
      }
    }
  };

  const onSubmit = async (data: ReplenishFormData) => {
    if (!stock) return;

    try {
      const response = await fetch(`${apiUrl}/stocks/${stock.id}/replenish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tonQuantity: data.tonQuantity,
          m3Quantity: data.m3Quantity,
          expenseValue: data.expenseValue,
          paymentStatus: data.paymentStatus,
        }),
      });

      if (!response.ok) throw new Error();

      toast.success("Estoque reabastecido com sucesso!");
      navigate("/stocks");
    } catch {
      toast.error("Erro ao reabastecer o estoque.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col mx-auto w-[80%] h-full">
        <div className="py-15 text-center">
          <h1 className="text-3xl">Adicionar estoque</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ) : (
          <Fragment>
            <div className=" text-center">
              <h2 className="text-xl text-primary font-bold pb-12">
                {stock?.product.name}
              </h2>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <Select
                        value={field.value?.toString()}
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
                          {productSuppliers.map((ps) => (
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
          </Fragment>
        )}
        <div className="mt-auto flex justify-end gap-4 py-12">
          <Button
            type="button"
            className="box-border bg-white text-slate-500 border-2 border-slate-500 hover:bg-slate-100 px-6 py-6 text-base cursor-pointer"
            onClick={() => navigate("/stocks")}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            className="bg-slate-500 border-2 border-transparent hover:bg-slate-600 text-white px-6 py-6 text-base cursor-pointer"
            onClick={form.handleSubmit(onSubmit)}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </Layout>
  );
}
