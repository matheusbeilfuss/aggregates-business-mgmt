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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { toast } from "sonner";

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

export function Stock() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const apiUrl = import.meta.env.VITE_API_URL;

  const productSchema = z
    .object({
      name: z.string().min(1, "O nome do produto é obrigatório."),
      categoryId: z.number().optional(),
      categoryName: z.string().optional(),
    })
    .refine(
      (data) =>
        (data.categoryId && !data.categoryName) ||
        (!data.categoryId && data.categoryName),
      {
        message:
          "Informe uma categoria existente ou o nome de uma nova categoria.",
        path: ["categoryId", "categoryName"],
      }
    );

  async function handleCreateProduct() {
    setFormErrors({});

    const payload: {
      name: string;
      categoryId?: number;
      categoryName?: string;
    } = {
      name: newProductName,
    };

    if (isNewCategory) {
      if (!newCategoryName.trim()) {
        setFormErrors({ category: "Informe o nome da nova categoria." });
        return;
      }
      payload.categoryName = newCategoryName.trim();
    } else {
      const parsedCategoryId = Number(selectedCategoryId);
      if (!parsedCategoryId) {
        setFormErrors({ category: "Selecione uma categoria." });
        return;
      }
      payload.categoryId = parsedCategoryId;
    }

    const result = productSchema.safeParse(payload);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar produto");
      }

      toast.success("O produto foi criado com sucesso.");
      await loadStocksandCategories();

      setIsDialogOpen(false);
      setNewProductName("");
      setSelectedCategoryId("");
      setNewCategoryName("");
      setIsNewCategory(false);
    } catch (error) {
      toast.error("Não foi possível salvar o produto.");
      console.error(error);
    }
  }

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

    const stocksData = await stocksResponse.json();
    const categoriesData = await categoriesResponse.json();

    setStocks(stocksData);
    setCategories(categoriesData);
  }

  useEffect(() => {
    const controller = new AbortController();

    loadStocksandCategories(controller.signal)
      .then(() => setLoading(false))
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
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
            <Skeleton className="h-12 w-full rounded-md"></Skeleton>
            <Skeleton className="h-12 w-full rounded-md"></Skeleton>
            <Skeleton className="h-12 w-full rounded-md"></Skeleton>
          </div>
        ) : (
          <div>
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
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => console.log("Editar", stock.id)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => console.log("Excluir", stock.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => console.log("Adicionar", stock.id)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              <span>Adicionar</span>
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
                      className="text-center text-muted-foreground italic"
                      colSpan={4}
                    >
                      Nenhum item no estoque.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-auto flex justify-end py-12">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base shadow-sm">
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

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                  />
                  {formErrors.name && (
                    <p className="col-span-4 text-sm text-red-500">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Categoria
                  </Label>

                  <div className="col-span-3 flex gap-2 w-full">
                    {isNewCategory ? (
                      <Input
                        id="new-category-name"
                        placeholder="Nome da nova categoria"
                        className="flex-1"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    ) : (
                      <div className="flex-1">
                        <Select
                          value={selectedCategoryId}
                          onValueChange={setSelectedCategoryId}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
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
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setIsNewCategory(!isNewCategory)}
                    >
                      {isNewCategory ? (
                        <List className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={handleCreateProduct}>
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
