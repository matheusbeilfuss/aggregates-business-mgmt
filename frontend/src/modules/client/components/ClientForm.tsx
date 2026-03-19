import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useEffect } from "react";

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
import { Separator } from "@/components/ui/separator";
import {
  PageContainer,
  FormActions,
  LoadingState,
  PhoneTypeSelect,
} from "@/components/shared";

import { ClientFormData } from "../schemas/client.schemas";
import { formatPhone, formatCpfCnpj, formatCep } from "@/utils";
import { useCepLookup } from "@/hooks/useCepLookup";

interface ClientFormProps {
  title: string;
  form: UseFormReturn<ClientFormData>;
  loading?: boolean;
  onSubmit: (data: ClientFormData) => void;
  submitLabel: string;
}

export function ClientForm({
  title,
  form,
  loading = false,
  onSubmit,
  submitLabel,
}: ClientFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phones",
  });

  const cep = useWatch({ control: form.control, name: "cep" });
  const {
    address,
    loading: cepLoading,
    error: cepError,
  } = useCepLookup(cep ?? "");

  useEffect(() => {
    if (!address) return;
    form.setValue("street", address.street, { shouldValidate: true });
    form.setValue("neighborhood", address.neighborhood, {
      shouldValidate: true,
    });
    form.setValue("city", address.city, { shouldValidate: true });
    form.setValue("state", address.state, { shouldValidate: true });
  }, [address, form]);

  if (loading) {
    return (
      <PageContainer title={title}>
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title={title}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CPF / CNPJ{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        field.onChange(formatCpfCnpj(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    E-mail{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Telefones</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => append({ number: "", type: "CELULAR" })}
              >
                <Plus className="h-4 w-4" />
                Adicionar telefone
              </Button>
            </div>

            {form.formState.errors.phones?.message && (
              <p className="text-sm text-destructive">
                {form.formState.errors.phones.message}
              </p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[1fr_8rem_2rem] items-start gap-3"
              >
                <FormField
                  control={form.control}
                  name={`phones.${index}.number`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Número</FormLabel>}
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="(XX) XXXXX-XXXX"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) =>
                            field.onChange(formatPhone(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`phones.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Tipo</FormLabel>}
                      <PhoneTypeSelect
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={fields.length === 1}
                  className={`text-muted-foreground hover:text-destructive ${index === 0 ? "mt-6" : ""}`}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <p className="text-sm font-medium mb-4">Endereço</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CEP{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="text"
                        placeholder="00000-000"
                        onChange={(e) =>
                          field.onChange(formatCep(e.target.value))
                        }
                      />
                      {cepLoading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </FormControl>
                  {cepError && (
                    <p className="text-sm text-destructive">{cepError}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Complemento{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Apto, bloco, sala..."
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      onFocus={(e) => e.target.select()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormActions
            cancelPath="/clients"
            submitLabel={submitLabel}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </form>
      </Form>
    </PageContainer>
  );
}
