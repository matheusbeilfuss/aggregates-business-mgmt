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
import { productSchema, type ProductFormData } from "../schemas/stock.schemas";
import { ApiError } from "@/lib/api";
import { Category } from "@/modules/category/types";
import { productService } from "@/modules/product/services/product.service";

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
      await productService.insert(payload);
      toast.success(
        "Produto criado com sucesso. Lembre-se de atualizar o estoque e os preços do produto.",
      );
      onOpenChange(false);
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível salvar o produto.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) form.reset();
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Preencha as informações do produto a ser inserido no estoque.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome <span className="text-destructive">*</span>
                  </FormLabel>
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
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Categoria <span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="flex gap-2">
                    {field.value ? (
                      <FormField
                        control={form.control}
                        name="categoryName"
                        render={({ field: categoryNameField }) => (
                          <FormControl>
                            <Input
                              placeholder="Nome da nova categoria"
                              {...categoryNameField}
                              className={
                                fieldState.error ? "!border-destructive" : ""
                              }
                            />
                          </FormControl>
                        )}
                      />
                    ) : (
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field: categoryField }) => (
                          <div className="flex-1">
                            <CategorySelect
                              value={categoryField.value}
                              onChange={categoryField.onChange}
                              categories={categories}
                              className={
                                fieldState.error ? "!border-destructive" : ""
                              }
                            />
                          </div>
                        )}
                      />
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0 cursor-pointer"
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

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 text-sm cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 text-sm font-medium text-white cursor-pointer
                           hover:opacity-90 active:opacity-80 transition-opacity"
                style={{ backgroundColor: "var(--color-primary-40)" }}
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
