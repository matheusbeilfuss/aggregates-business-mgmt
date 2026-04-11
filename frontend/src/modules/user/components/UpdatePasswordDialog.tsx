import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpdatePasswordFormData,
  updatePasswordSchema,
} from "../schemas/user.schemas";
import { userService } from "../services/user.service";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { ApiError } from "@/lib/api";

interface UpdatePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdatePasswordDialog({
  open,
  onOpenChange,
  onSuccess,
}: UpdatePasswordDialogProps) {
  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(data: UpdatePasswordFormData) {
    try {
      await userService.updatePassword(data.newPassword);
      toast.success("Senha atualizada com sucesso.");
      onOpenChange(false);
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível atualizar a senha.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          Trocar senha
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Trocar senha</DialogTitle>
          <DialogDescription>
            Insira a nova senha para atualizar sua conta.
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite sua nova senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirme sua nova senha"
                      {...field}
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
                Salvar senha
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
