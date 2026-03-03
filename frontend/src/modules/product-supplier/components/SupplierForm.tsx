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
import {
  SupplierAddFormData,
  SupplierEditFormData,
} from "../schemas/productSupplier.schema";
import { Product } from "@/modules/product/types";
import { Supplier } from "../types";
import { SupplierCombobox } from "./SupplierCombobox";

type AddControl = Control<SupplierAddFormData>;
type EditControl = Control<SupplierEditFormData>;

interface BaseProps {
  control: AddControl | EditControl;
}

interface AddProps extends BaseProps {
  mode: "add";
  control: AddControl;
  setValue: UseFormSetValue<SupplierAddFormData>;
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

type SupplierFormProps = AddProps | EditProps;

export function SupplierForm(props: SupplierFormProps) {
  const { control, mode } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {mode === "add" && (
        <>
          <FormField
            control={props.control as AddControl}
            name="supplierName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Fornecedor</FormLabel>
                <FormControl>
                  <SupplierCombobox
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
                      fieldState.error ? "border border-red-500 rounded-md" : ""
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
                <FormLabel>Material</FormLabel>
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
        name="density"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Densidade</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
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
            <FormLabel>Custo por Tonelada (R$)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
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
            <FormLabel>Custo por m³ (R$)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
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
            <FormLabel>Custo por 5m³ (R$) </FormLabel>
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
        control={control as AddControl}
        name="observations"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Input {...field} type="text" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
