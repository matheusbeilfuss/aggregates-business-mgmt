import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { Plus, Trash2, Loader2, User, Phone, MapPin } from "lucide-react";
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
import {
  PageContainer,
  FormActions,
  FormSection,
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
          <div className="max-w-3xl mx-auto space-y-8">
            <FormSection icon={User} title="Dados pessoais">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Nome <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
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
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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
                      <span className="text-muted-foreground font-normal text-xs">
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
            </FormSection>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                  style={{ backgroundColor: "var(--color-primary-90)" }}
                >
                  <Phone
                    className="h-3.5 w-3.5"
                    style={{ color: "var(--color-primary-40)" }}
                  />
                </div>
                <h2 className="text-sm font-semibold text-foreground">
                  Telefones
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "var(--color-outline-variant)" }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs shrink-0 cursor-pointer"
                  onClick={() => append({ number: "", type: "CELULAR" })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </Button>
              </div>

              {form.formState.errors.phones?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phones.message}
                </p>
              )}

              <div className="space-y-3">
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
                      className={`text-muted-foreground hover:text-destructive
                                  cursor-pointer ${index === 0 ? "mt-6" : ""}`}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <FormSection icon={MapPin} title="Endereço">
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      CEP{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="00000-000"
                          onChange={(e) =>
                            field.onChange(formatCep(e.target.value))
                          }
                        />
                        {cepLoading && (
                          <Loader2
                            className="absolute right-3 top-1/2 -translate-y-1/2
                                       h-4 w-4 animate-spin text-muted-foreground"
                          />
                        )}
                      </div>
                    </FormControl>
                    {cepError && (
                      <p className="text-xs text-destructive">{cepError}</p>
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
                    <FormLabel>
                      Rua <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
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
                    <FormLabel>
                      Número <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
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
                      <span className="text-muted-foreground font-normal text-xs">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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
                    <FormLabel>
                      Bairro <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
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
                    <FormLabel>
                      Cidade <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
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
                    <FormLabel>
                      Estado <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>
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
