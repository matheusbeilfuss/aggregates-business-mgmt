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
import { FormActions, FormSection, CurrencyInput } from "@/components/shared";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Tag, CreditCard, Fuel, FileText, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  defaultValues?: Partial<ExpenseFormValues>;
  templates: FixedExpense[];
  onTemplatesRefetch: () => void;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  onCancel: () => void;
};

const TYPE_OPTIONS = [
  { value: ExpenseTypeEnum.VARIABLE, label: "Variável" },
  { value: ExpenseTypeEnum.FIXED, label: "Fixa" },
  { value: ExpenseTypeEnum.FUEL, label: "Combustível" },
];

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
      vehicle: null,
      kmDriven: null,
      liters: null,
      pricePerLiter: null,
      fuelSupplier: null,
      ...defaultValues,
    },
  });

  const type = useWatch({ control: form.control, name: "type" });
  const paymentStatus = useWatch({
    control: form.control,
    name: "paymentStatus",
  });
  const liters = useWatch({ control: form.control, name: "liters" });
  const pricePerLiter = useWatch({
    control: form.control,
    name: "pricePerLiter",
  });
  const vehicle = useWatch({ control: form.control, name: "vehicle" });

  const isPending = paymentStatus === PaymentStatusEnum.PENDING;
  const isFuel = type === ExpenseTypeEnum.FUEL;
  const isFixed = type === ExpenseTypeEnum.FIXED;

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (paymentStatus === PaymentStatusEnum.PENDING) {
      form.setValue("paymentDate", null);
    } else if (paymentStatus === PaymentStatusEnum.PAID) {
      const current = form.getValues("paymentDate");
      if (!current) form.setValue("paymentDate", toIsoDate(new Date()));
    }
  }, [paymentStatus, form]);

  useEffect(() => {
    if (isFuel && liters && pricePerLiter) {
      form.setValue(
        "expenseValue",
        parseFloat((liters * pricePerLiter).toFixed(2)),
      );
    }
  }, [liters, pricePerLiter, isFuel, form]);

  useEffect(() => {
    if (isFuel) {
      form.setValue("category", "Combustível");
      form.setValue("name", vehicle || "Combustível");
    }
  }, [isFuel, vehicle, form]);

  function handleTemplateSelect(template: FixedExpense) {
    form.setValue("name", template.name);
    form.setValue("expenseValue", template.defaultValue);
    form.setValue("category", template.category);
    setSelectedTemplateId(template.id);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm font-medium">
                    Tipo da saída
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-3 mt-1"
                    >
                      {TYPE_OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border
                                     cursor-pointer transition-colors text-sm select-none"
                          style={{
                            borderColor:
                              field.value === opt.value
                                ? "var(--color-primary-40)"
                                : "var(--color-outline-variant)",
                            backgroundColor:
                              field.value === opt.value
                                ? "var(--color-primary-90)"
                                : "transparent",
                            color:
                              field.value === opt.value
                                ? "var(--color-primary-10)"
                                : "var(--color-on-surface-variant)",
                          }}
                        >
                          <RadioGroupItem
                            value={opt.value}
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="shrink-0">
                  <FormLabel className="text-sm font-medium">Data</FormLabel>
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
          </div>

          {isFuel && (
            <FormSection icon={Fuel} title="Abastecimento">
              <FormField
                control={form.control}
                name="pricePerLiter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Valor por litro{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value ?? undefined}
                        onChange={field.onChange}
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
                    <FormLabel>
                      Litros <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                        onFocus={(e) => e.target.select()}
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
                    <FormLabel>Km rodados</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onFocus={(e) => e.target.select()}
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
                    <FormLabel>
                      Veículo <span className="text-destructive">*</span>
                    </FormLabel>
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
            </FormSection>
          )}

          <div
            className={
              isFixed ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-start" : ""
            }
          >
            <FormSection icon={Tag} title="Saída">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      Nome <span className="text-destructive">*</span>
                      {isFuel && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info
                              className="h-3.5 w-3.5 cursor-default"
                              style={{
                                color: "var(--color-on-surface-variant)",
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="max-w-[200px] text-xs"
                          >
                            Preenchido automaticamente com o veículo
                            selecionado.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onFocus={(e) => e.target.select()}
                        readOnly={isFuel}
                        className={
                          isFuel
                            ? "bg-muted text-muted-foreground cursor-not-allowed select-none"
                            : ""
                        }
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
                    <FormLabel className="flex items-center gap-1.5">
                      Valor <span className="text-destructive">*</span>
                      {isFuel && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info
                              className="h-3.5 w-3.5 cursor-default"
                              style={{
                                color: "var(--color-on-surface-variant)",
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="max-w-[220px] text-xs"
                          >
                            Calculado automaticamente (litros × valor por
                            litro). Você pode editar manualmente se necessário.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </FormLabel>
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
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Categoria <span className="text-destructive">*</span>
                    </FormLabel>
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
            </FormSection>

            {isFixed && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                    style={{ backgroundColor: "var(--color-primary-90)" }}
                  >
                    <FileText
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--color-primary-40)" }}
                    />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Despesas fixas cadastradas
                  </h2>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--color-outline-variant)" }}
                  />
                </div>
                <div className="h-[280px]">
                  <FixedExpenseTemplateList
                    templates={templates}
                    selectedId={selectedTemplateId}
                    onSelect={handleTemplateSelect}
                    onRefetch={onTemplatesRefetch}
                  />
                </div>
              </div>
            )}
          </div>

          <FormSection icon={CreditCard} title="Pagamento">
            <div className="flex gap-3 md:col-span-1">
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PaymentStatusEnum.PAID}>
                          Pago
                        </SelectItem>
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
                    <FormItem className="flex-1">
                      <FormLabel>Data do pagamento</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
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
                    <FormItem className="flex-1">
                      <FormLabel>Data de vencimento</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </FormSection>
        </div>

        <FormActions onCancel={onCancel} />
      </form>
    </Form>
  );
}
