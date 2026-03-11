import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useExpenseOptions } from "../hooks/useExpenseOptions";
import { FixedExpense } from "../types";
import { DialogCombobox } from "./DialogCombobox";

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  defaultValue: z.coerce
    .number({ invalid_type_error: "O valor padrão é obrigatório." })
    .positive("O valor padrão deve ser maior que zero."),
  category: z.string().min(1, "A categoria é obrigatória."),
});

type Values = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialValues?: FixedExpense;
};

export function AddFixedExpenseDialog({
  open,
  onOpenChange,
  onSuccess,
  initialValues,
}: Props) {
  const { categories } = useExpenseOptions({
    enabled: open,
    includeVehicles: false,
    includeFuelSuppliers: false,
  });
  const isEditing = !!initialValues;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          defaultValue: initialValues.defaultValue,
          category: initialValues.category,
        }
      : { name: "", defaultValue: 0, category: "" },
  });

  const onSubmit = async (values: Values) => {
    try {
      if (isEditing) {
        await api.put(`/fixed-expenses/${initialValues!.id}`, values);
        toast.success("A despesa fixa foi atualizada.");
      } else {
        await api.post("/fixed-expenses", values);
        toast.success("A despesa fixa foi cadastrada.");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error(
          isEditing
            ? "Não foi possível atualizar a despesa fixa."
            : "Não foi possível cadastrar a despesa fixa.",
        );
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar despesa fixa" : "Adicionar despesa fixa"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite os detalhes da despesa fixa."
              : "Insira os detalhes da despesa fixa que deseja adicionar. O valor padrão pode ser usado para facilitar o cadastro de despesas recorrentes, mas pode ser alterado no momento do lançamento."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
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
              name="defaultValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor padrão</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <DialogCombobox
                      options={categories}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Selecionar ou digitar..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-slate-500 hover:bg-slate-600 text-white"
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
