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
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/shared";
import { api, ApiError } from "@/lib/api";
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
        toast.success("Despesa fixa atualizada.");
      } else {
        await api.post("/fixed-expenses", values);
        toast.success("Despesa fixa cadastrada.");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : isEditing
            ? "Não foi possível atualizar a despesa fixa."
            : "Não foi possível cadastrar a despesa fixa.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[400px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar despesa fixa" : "Nova despesa fixa"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite os detalhes da despesa fixa."
              : "O valor padrão pode ser alterado no momento do lançamento."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4 pt-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} onFocus={(e) => e.target.select()} />
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
                    <CurrencyInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <DialogCombobox
                      options={categories}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Selecionar ou digitar..."
                      className={fieldState.error ? "border-destructive" : ""}
                    />
                  </FormControl>
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
