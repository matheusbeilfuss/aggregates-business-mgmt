import { Control, UseFormSetValue } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput, FormSection } from "@/components/shared";
import {
  ProductSupplierAddFormData,
  ProductSupplierEditFormData,
} from "../schemas/productSupplier.schema";
import { Product } from "@/modules/product/types";
import { Supplier } from "@/modules/supplier/types";
import { ProductSupplierCombobox } from "./ProductSupplierCombobox";
import { Truck, DollarSign } from "lucide-react";

type AddControl = Control<ProductSupplierAddFormData>;
type EditControl = Control<ProductSupplierEditFormData>;

interface BaseProps {
  control: AddControl | EditControl;
}

interface AddProps extends BaseProps {
  mode: "add";
  control: AddControl;
  setValue: UseFormSetValue<ProductSupplierAddFormData>;
  supplierId: number | undefined;
  suppliers: Supplier[];
  products: Product[];
}

interface EditProps extends BaseProps {
  mode: "edit";
  control: EditControl;
  products: Product[];
  suppliers: Supplier[];
}

type ProductSupplierFormProps = AddProps | EditProps;

export function ProductSupplierForm(props: ProductSupplierFormProps) {
  const { control, mode } = props;

  return (
    <div className="space-y-8">
      <FormSection icon={Truck} title="Identificação">
        {mode === "add" && (
          <>
            <FormField
              control={props.control as AddControl}
              name="supplierName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Fornecedor <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <ProductSupplierCombobox
                      value={field.value ?? ""}
                      supplierId={props.supplierId}
                      suppliers={props.suppliers}
                      onChange={(value) => {
                        field.onChange(value);
                        props.setValue("supplierId", undefined);
                      }}
                      onSupplierSelect={(supplier) => {
                        field.onChange(supplier.name);
                        props.setValue("supplierId", supplier.id);
                      }}
                      className={
                        fieldState.error
                          ? "border border-destructive rounded-md"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={props.control as AddControl}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Material <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Selecione um material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {props.products.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {mode === "edit" && (
          <>
            <FormField
              control={control as EditControl}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {props.suppliers.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control as EditControl}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {props.products.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={control as AddControl}
          name="observations"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>
                Observações{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (opcional)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  onFocus={(e) => e.target.select()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection icon={DollarSign} title="Custos">
        <FormField
          control={control as AddControl}
          name="density"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Densidade <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  {...field}
                  onFocus={(e) => e.target.select()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control as AddControl}
          name="tonCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Custo por tonelada <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <CurrencyInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control as AddControl}
          name="costPerCubicMeter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Custo por m³ <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <CurrencyInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control as AddControl}
          name="costFor5CubicMeters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Custo por 5m³ <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <CurrencyInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>
    </div>
  );
}
