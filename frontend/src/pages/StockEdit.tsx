import { Layout } from "@/components/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

interface Category {
  id: number;
  name: string;
}

const editStockSchema = z.object({
  productName: z.string().min(1, "Nome obrigatório"),
  categoryId: z.number(),
  tonQuantity: z.coerce.number().nonnegative(),
  m3Quantity: z.coerce.number().nonnegative(),
});

type EditStockFormData = z.infer<typeof editStockSchema>;

export function StockEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState<Category[]>([]);
  const [productId, setProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<EditStockFormData>({
    resolver: zodResolver(editStockSchema),
  });

  async function loadData() {
    try {
      const [stockRes, categoriesRes] = await Promise.all([
        fetch(`${apiUrl}/stocks/${id}`),
        fetch(`${apiUrl}/categories`),
      ]);

      if (!stockRes.ok || !categoriesRes.ok) {
        throw new Error();
      }

      const stock = await stockRes.json();
      const categories = await categoriesRes.json();

      form.reset({
        productName: stock.product.name,
        categoryId: stock.product.category.id,
        tonQuantity: stock.tonQuantity,
        m3Quantity: stock.m3Quantity,
      });

      setProductId(stock.product.id);
      setCategories(categories);
    } catch {
      toast.error("Erro ao carregar os dados do estoque.");
      navigate("/stocks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function onSubmit(data: EditStockFormData) {
    if (!productId) return;

    try {
      await fetch(`${apiUrl}/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.productName,
          categoryId: data.categoryId,
        }),
      });

      await fetch(`${apiUrl}/stocks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tonQuantity: data.tonQuantity,
          m3Quantity: data.m3Quantity,
          productId,
        }),
      });

      toast.success("Estoque atualizado com sucesso!");
      navigate("/stocks");
    } catch {
      toast.error("Não foi possível atualizar o estoque.");
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="text-center mt-10 text-muted-foreground">
          Carregando dados...
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col mx-auto w-[80%] h-full">
        <div className="py-15 text-center">
          <h1 className="text-3xl">Editar estoque</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            <FormField
              name="productName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              name="tonQuantity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toneladas</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="m3Quantity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>M³</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Alert variant="destructive" className="md:col-span-2">
              <TriangleAlert />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Ao realizar esta edição, lembre-se de checar as últimas
                saídas{" "}
              </AlertDescription>
            </Alert>
          </form>
        </Form>
        <div className="mt-auto flex justify-end py-12 gap-2">
          <Button
            className="px-6 py-6 text-base"
            variant="outline"
            onClick={() => navigate("/stocks")}
          >
            Cancelar
          </Button>

          <Button
            className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base"
            onClick={form.handleSubmit(onSubmit)}
          >
            Salvar
          </Button>
        </div>
      </div>
    </Layout>
  );
}
