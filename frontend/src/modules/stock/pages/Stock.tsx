import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { List, MoreHorizontal, Pencil, Plus, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ConfirmDialog,
} from "@/components/shared";
import { CategorySelect } from "../components/CategorySelect";
import { useStocks, useCategories } from "../hooks";
import { productService } from "../services/stock.service";
import { productSchema, type ProductFormData } from "../schemas/stock.schemas";
import type { Product } from "../types";

export function Stock() {
  const navigate = useNavigate();

  const { data: stocks, loading, error, refetch } = useStocks();
  const { data: categories } = useCategories();

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: undefined,
      categoryName: "",
      isNewCategory: false,
    },
  });

  function openDeleteDialog(product: Product) {
    setOpenMenuId(null);
    requestAnimationFrame(() => {
      setProductToDelete(product);
    });
  }

  async function handleDeleteProduct() {
    if (!productToDelete) return;

    try {
      await productService.delete(productToDelete.id);
      toast.success("O produto foi excluído com sucesso.");
      await refetch();
    } catch {
      toast.error("Não foi possível excluir o produto.");
    } finally {
      setProductToDelete(null);
    }
  }

  async function onSubmit(data: ProductFormData) {
    const payload = {
      name: data.name,
      ...(data.isNewCategory
        ? { categoryName: data.categoryName?.trim() }
        : { categoryId: data.categoryId }),
    };

    try {
      await productService.create(payload);
      toast.success("O produto foi criado com sucesso.");
      await refetch();
      setIsAddProductDialogOpen(false);
      form.reset();
    } catch {
      toast.error("Não foi possível salvar o produto.");
    }
  }

  return (
    <PageContainer title="Estoque">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <LoadingState rows={5} />
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
            {stocks?.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.product.name}</TableCell>
                <TableCell>{stock.tonQuantity ?? "-"}</TableCell>
                <TableCell>
                  {stock.m3Quantity != null ? `${stock.m3Quantity} m³` : "-"}
                </TableCell>

                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu
                      open={openMenuId === stock.id}
                      onOpenChange={(open) =>
                        setOpenMenuId(open ? stock.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => navigate(`/stocks/${stock.id}`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer"
                          onSelect={(e) => {
                            e.preventDefault();
                            openDeleteDialog(stock.product);
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(`/stocks/${stock.id}/replenish`)
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {stocks?.length === 0 && (
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
        <Dialog
          open={isAddProductDialogOpen}
          onOpenChange={setIsAddProductDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base cursor-pointer">
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
                              <CategorySelect
                                value={field.value}
                                onChange={field.onChange}
                                categories={categories ?? []}
                              />
                            )}
                          />
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
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
                  <Button type="submit" className="cursor-pointer">
                    Salvar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <ConfirmDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="Você tem certeza de que deseja excluir o registro abaixo?"
        description={productToDelete?.name ?? ""}
        onConfirm={handleDeleteProduct}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
