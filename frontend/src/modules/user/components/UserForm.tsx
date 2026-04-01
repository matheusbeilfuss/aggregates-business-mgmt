import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { FormActions } from "@/components/shared";
import { User as UserIcon, Pencil, ShieldCheck } from "lucide-react";
import { useRef, useState, ReactNode, useEffect } from "react";
import {
  createUserSchema,
  updateUserSchema,
  CreateUserFormData,
  UpdateUserFormData,
} from "../schemas/user.schemas";

const FORM_ID = "user-form";

type CreateMode = {
  mode: "create";
  onSubmit: (data: CreateUserFormData, image?: File) => Promise<void>;
  defaultValues?: never;
  isAdmin?: never;
};

type EditMode = {
  mode: "edit";
  onSubmit: (data: UpdateUserFormData, image?: File) => Promise<void>;
  defaultValues: UpdateUserFormData & { imgName?: string };
  isAdmin?: boolean;
};

type UserFormProps = (CreateMode | EditMode) & {
  cancelPath: string;
  isSubmitting?: boolean;
  extraActions?: ReactNode;
};

type CombinedFormData = UpdateUserFormData & {
  imgName?: string;
  password?: string;
  admin?: boolean;
};

export function UserForm({
  mode,
  defaultValues,
  isAdmin,
  onSubmit,
  cancelPath,
  isSubmitting = false,
  extraActions,
}: UserFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined,
  );

  const schema = mode === "create" ? createUserSchema : updateUserSchema;

  const form = useForm<CombinedFormData>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "edit"
        ? defaultValues
        : {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            admin: false,
            imgName: undefined,
          },
  });

  const handleSubmit = async (data: CombinedFormData) => {
    try {
      if (mode === "create") {
        await (onSubmit as CreateMode["onSubmit"])(
          data as CreateUserFormData,
          selectedImage,
        );
      } else {
        await (onSubmit as EditMode["onSubmit"])(
          data as UpdateUserFormData,
          selectedImage,
        );
      }
    } catch (error) {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = undefined;
      }
      form.setValue(
        "imgName",
        mode === "edit" ? defaultValues?.imgName : undefined,
      );
      setSelectedImage(undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (mode === "edit" && defaultValues?.imgName && !selectedImage) {
      form.setValue("imgName", defaultValues.imgName);
    }
  }, [defaultValues?.imgName, form, mode, selectedImage]);

  return (
    <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full space-y-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            if (previewUrlRef.current)
              URL.revokeObjectURL(previewUrlRef.current);
            const newUrl = URL.createObjectURL(file);
            previewUrlRef.current = newUrl;
            setSelectedImage(file);
            form.setValue("imgName", newUrl);
          }
        }}
      />

      <Form {...form}>
        <form id={FORM_ID} onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-48 h-48 md:w-64 md:h-64">
                  <AvatarImage src={form.watch("imgName")} />
                  <AvatarFallback
                    style={{ backgroundColor: "var(--color-primary-90)" }}
                  >
                    <UserIcon
                      className="w-20 h-20 md:w-28 md:h-28"
                      style={{ color: "var(--color-primary-40)" }}
                    />
                  </AvatarFallback>
                </Avatar>

                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute bottom-4 right-4 rounded-full h-9 w-9
             shadow-sm cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              {mode === "edit" && isAdmin && (
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold
                             px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--color-primary-90)",
                    color: "var(--color-primary-40)",
                  }}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Administrador
                </span>
              )}
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Sobrenome <span className="text-destructive">*</span>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Usuário <span className="text-destructive">*</span>
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
                        type="email"
                        {...field}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === "create" && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Senha <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="admin"
                    render={({ field }) => (
                      <FormItem
                        className="flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer"
                        style={{ borderColor: "var(--color-outline-variant)" }}
                      >
                        <FormLabel className="cursor-pointer text-sm font-medium">
                          Administrador
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {extraActions && (
                <div className="space-y-2 pt-2">{extraActions}</div>
              )}
            </div>
          </div>
        </form>
      </Form>

      <FormActions
        cancelPath={cancelPath}
        submitLabel="Salvar"
        isSubmitting={isSubmitting}
        formId={FORM_ID}
      />
    </div>
  );
}
