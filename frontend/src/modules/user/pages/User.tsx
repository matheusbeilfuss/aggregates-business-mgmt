import { useForm } from "react-hook-form";
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
import { PageContainer, FormActions, LoadingState } from "@/components/shared";
import { User as UserIcon, Pencil } from "lucide-react";
import { useUser, useUserAvatar } from "../hooks/useUsers";
import { useEffect, useRef, useState } from "react";
import { userService } from "../services/user.service";
import { toast } from "sonner";

interface UserFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  imgUrl?: string;
}

export function User() {
  const { data: user, loading: userLoading, refetch: refetchUser } = useUser();
  const avatar = useUserAvatar(user?.imgUrl);

  const isAdmin = user?.admin;

  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UserFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      email: user?.email || "",
      imgUrl: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        imgUrl: avatar,
      });
    }
  }, [user, avatar, form]);

  const onSubmit = async (data: UserFormData) => {
    if (!user) return;

    try {
      await userService.update(
        user.id,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
        },
        selectedImage,
      );

      await refetchUser();

      setSelectedImage(undefined);

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  if (userLoading) {
    return (
      <PageContainer title="Meu perfil">
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Meu perfil">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedImage(file);
                form.setValue("imgUrl", URL.createObjectURL(file));
              }
            }}
          />

          {isAdmin && (
            <div className="flex justify-center">
              <Badge variant="secondary">Administrador</Badge>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative w-56 h-56 md:w-80 md:h-80">
                <Avatar className="w-full h-full">
                  <AvatarImage src={form.watch("imgUrl")} />
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

              {isAdmin && (
                <>
                  {
                    // TODO: Adicionar campo para nome do comércio
                    /* <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Comércio</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */
                  }
                  <Button type="button" variant="secondary" className="w-full">
                    Gerenciar acessos
                  </Button>
                </>
              )}

              <Button type="button" variant="secondary" className="w-full">
                Trocar senha
              </Button>
            </div>
          </div>

          <FormActions cancelPath="/" submitLabel="Salvar" />
        </form>
      </Form>
    </PageContainer>
  );
}
