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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { FormActions } from "@/components/shared";
import { User as UserIcon, Pencil } from "lucide-react";
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

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <Form {...form}>
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (previewUrlRef.current) {
                  URL.revokeObjectURL(previewUrlRef.current);
                }

                const newUrl = URL.createObjectURL(file);
                previewUrlRef.current = newUrl;

                setSelectedImage(file);
                form.setValue("imgName", newUrl);
              }
            }}
          />

          {mode === "edit" && isAdmin && (
            <div className="flex justify-center">
              <Badge variant="secondary">Administrador</Badge>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex justify-center">
              <div className="relative w-56 h-56 md:w-80 md:h-80">
                <Avatar className="w-full h-full">
                  <AvatarImage src={form.watch("imgName")} />
                  <AvatarFallback>
                    <UserIcon className="w-24 h-24 md:w-40 md:h-40 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>

                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute bottom-3 right-3 md:bottom-5 md:right-5 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input className="h-9" {...field} />
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
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input className="h-9" {...field} />
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
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input className="h-9" {...field} />
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
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" className="h-9" {...field} />
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
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" className="h-9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="admin"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <FormLabel className="cursor-pointer">
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
            </div>
          </div>
        </form>
      </Form>

      {extraActions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mt-4">
          <div />
          <div className="space-y-4">{extraActions}</div>
        </div>
      )}

      <FormActions
        cancelPath={cancelPath}
        submitLabel="Salvar"
        isSubmitting={isSubmitting}
        formId={FORM_ID}
      />
    </div>
  );
}
