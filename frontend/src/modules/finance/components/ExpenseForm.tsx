import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormActions } from "@/components/shared/FormActions";
import { DatePicker } from "@/components/shared/DatePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FixedExpenseTemplateList } from "./FixedExpenseTemplateList";
import { expenseSchema, ExpenseFormValues } from "../schemas/expense.schemas";
import { ExpenseTypeEnum, PaymentStatusEnum } from "@/types";
import { FixedExpense } from "../types";
import { toIsoDate } from "@/utils";
import { useExpenseOptions } from "../hooks/useExpenseOptions";
import { EditableCombobox } from "./EditableCombobox";

type Props = {
  defaultValues?: Partial<ExpenseFormValues>;
  templates: FixedExpense[];
  onTemplatesRefetch: () => void;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  onCancel: () => void;
};

export function ExpenseForm({
  defaultValues,
  templates,
  onTemplatesRefetch,
  onSubmit,
  onCancel,
}: Props) {
  const { categories, vehicles, fuelSuppliers } = useExpenseOptions();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      type: ExpenseTypeEnum.VARIABLE,
      paymentStatus: PaymentStatusEnum.PAID,
      date: toIsoDate(new Date()),
      name: "",
      expenseValue: 0,
      category: "",
      dueDate: null,
      paymentDate: toIsoDate(new Date()),
      vehicle: "",
      kmDriven: null,
      liters: null,
      pricePerLiter: null,
      fuelSupplier: "",
      ...defaultValues,
    },
  });

  const type = useWatch({ control: form.control, name: "type" });
  const isPending =
    useWatch({ control: form.control, name: "paymentStatus" }) ===
    PaymentStatusEnum.PENDING;
  const liters = useWatch({ control: form.control, name: "liters" });
  const pricePerLiter = useWatch({
    control: form.control,
    name: "pricePerLiter",
  });
  const vehicle = useWatch({ control: form.control, name: "vehicle" });
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const paymentStatus = useWatch({
    control: form.control,
    name: "paymentStatus",
  });

  useEffect(() => {
    if (paymentStatus === PaymentStatusEnum.PENDING) {
      form.setValue("paymentDate", null);
    } else if (paymentStatus === PaymentStatusEnum.PAID) {
      const current = form.getValues("paymentDate");
      if (!current) {
        form.setValue("paymentDate", toIsoDate(new Date()));
      }
    }
  }, [paymentStatus, form]);

  useEffect(() => {
    if (type === ExpenseTypeEnum.FUEL && liters && pricePerLiter) {
      form.setValue(
        "expenseValue",
        parseFloat((liters * pricePerLiter).toFixed(2)),
      );
    }
  }, [liters, pricePerLiter, type, form]);

  useEffect(() => {
    if (type === ExpenseTypeEnum.FUEL) {
      form.setValue("category", "Combustível");
    }
  }, [type, form]);

  useEffect(() => {
    if (type === ExpenseTypeEnum.FUEL) {
      form.setValue("name", vehicle || "Combustível");
    }
  }, [vehicle, type, form]);

  function handleTemplateSelect(template: FixedExpense) {
    form.setValue("name", template.name);
    form.setValue("expenseValue", template.defaultValue);
    form.setValue("category", template.category);
    setSelectedTemplateId(template.id);
  }

  const isFuel = type === ExpenseTypeEnum.FUEL;
  const isFixed = type === ExpenseTypeEnum.FIXED;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 flex-1"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={
                    field.value
                      ? new Date(field.value + "T00:00:00")
                      : new Date()
                  }
                  onChange={(date) => date && field.onChange(toIsoDate(date))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo da saída</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  {[
                    { value: ExpenseTypeEnum.VARIABLE, label: "Variável" },
                    { value: ExpenseTypeEnum.FIXED, label: "Fixa" },
                    { value: ExpenseTypeEnum.FUEL, label: "Combustível" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label htmlFor={opt.value}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <div
          className={`grid gap-6 ${isFixed ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
        >
          <div className="space-y-4">
            {!isFuel && (
              <>
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
                  name="expenseValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value ?? ""}
                        />
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
                        <EditableCombobox
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
              </>
            )}

            {isFuel && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pricePerLiter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do litro</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.001"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="liters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Litros</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value ?? ""}
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
                      <FormLabel>Valor total</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kmDriven"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quilômetros rodados</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Veículo</FormLabel>
                      <FormControl>
                        <EditableCombobox
                          options={vehicles}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Selecionar ou digitar..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fuelSupplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estabelecimento</FormLabel>
                      <FormControl>
                        <EditableCombobox
                          options={fuelSuppliers}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Selecionar ou digitar..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {isFixed && (
            <div className="max-h-[246px] overflow-hidden">
              <FixedExpenseTemplateList
                templates={templates}
                selectedId={selectedTemplateId}
                onSelect={handleTemplateSelect}
                onRefetch={onTemplatesRefetch}
              />
            </div>
          )}
        </div>

        <div className="flex items-end gap-4">
          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status do pagamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PaymentStatusEnum.PAID}>Pago</SelectItem>
                    <SelectItem value={PaymentStatusEnum.PENDING}>
                      Pendente
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isPending && (
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do pagamento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isPending && (
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de vencimento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormActions onCancel={onCancel} />
      </form>
    </Form>
  );
}
