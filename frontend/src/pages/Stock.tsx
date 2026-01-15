import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { List, MoreHorizontal, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

interface StockItem {
  id: number;
  tonQuantity: number;
  m3Quantity: number;
  product: Product;
}

const productSchema = z
  .object({
    name: z.string().min(1, "O nome do produto é obrigatório."),
    categoryId: z.number().optional(),
    categoryName: z.string().optional(),
    isNewCategory: z.boolean(),
  })
  .refine(
    (data) =>
      (data.isNewCategory && !!data.categoryName) ||
      (!data.isNewCategory && !!data.categoryId),
    {
      message:
        "Informe uma categoria existente ou o nome de uma nova categoria.",
      path: ["category"],
    },
  );

type ProductFormData = z.infer<typeof productSchema>;

export function Stock() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: undefined,
      categoryName: "",
      isNewCategory: false,
    },
  });

  async function loadStocksandCategories(signal?: AbortSignal) {
    const [stocksResponse, categoriesResponse] = await Promise.all([
      fetch(`${apiUrl}/stocks`, { signal }),
      fetch(`${apiUrl}/categories`, { signal }),
    ]);

    if (!stocksResponse.ok) {
      throw new Error("Erro ao buscar estoque");
    }

    if (!categoriesResponse.ok) {
      throw new Error("Erro ao buscar categorias");
    }

    setStocks(await stocksResponse.json());
    setCategories(await categoriesResponse.json());
  }

  async function onSubmit(data: ProductFormData) {
    const payload: {
      name: string;
      categoryId?: number;
      categoryName?: string;
    } = {
      name: data.name,
    };

    if (data.isNewCategory) {
      payload.categoryName = data.categoryName?.trim();
    } else {
      payload.categoryId = data.categoryId;
    }

    try {
      const response = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();

      toast.success("O produto foi criado com sucesso.");
      await loadStocksandCategories();

      setIsDialogOpen(false);
      form.reset();
    } catch {
      toast.error("Não foi possível salvar o produto.");
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadStocksandCategories(controller.signal)
      .then(() => setLoading(false))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("Não foi possível carregar os dados.");
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col mx-auto w-[80%] h-full">
        <div className="py-15 text-center">
          <h1 className="text-3xl">Estoque</h1>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Toneladas</TableHead>
                <TableHead>M³</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.product.name}</TableCell>
                  <TableCell>{stock.tonQuantity ?? "-"}</TableCell>
                  <TableCell>{stock.m3Quantity} m³</TableCell>

                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/stocks/${stock.id}`)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <X className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {stocks.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground italic"
                  >
                    Nenhum item no estoque.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <div className="mt-auto flex justify-end py-12">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base">
                Adicionar Produto
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo produto</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo item que será inserido no
                  estoque.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNewCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>

                        <div className="flex gap-2">
                          {field.value ? (
                            <FormField
                              control={form.control}
                              name="categoryName"
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    placeholder="Nova categoria"
                                    {...field}
                                  />
                                </FormControl>
                              )}
                            />
                          ) : (
                            <FormField
                              control={form.control}
                              name="categoryId"
                              render={({ field }) => (
                                <Select
                                  value={field.value?.toString()}
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
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
                              )}
                            />
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              form.setValue("isNewCategory", !field.value)
                            }
                          >
                            {field.value ? (
                              <List className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
