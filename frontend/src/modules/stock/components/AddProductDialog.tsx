import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { List, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { CategorySelect } from "./CategorySelect";
import { productService } from "../services/stock.service";
import { productSchema, type ProductFormData } from "../schemas/stock.schemas";
import type { Category } from "../types";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess: () => void;
}

export function AddProductDialog({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: AddProductDialogProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: undefined,
      categoryName: "",
      isNewCategory: false,
    },
  });

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
      onOpenChange(false);
      form.reset();
      onSuccess();
    } catch {
      toast.error("Não foi possível salvar o produto.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base cursor-pointer">
          Adicionar Produto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo item que será inserido no estoque.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <Input placeholder="Nova categoria" {...field} />
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
                            categories={categories}
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
  );
}
