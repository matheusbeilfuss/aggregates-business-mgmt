import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { settingsService } from "../services/settings.service";
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
import { Store } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useEffect } from "react";
import { useSettings } from "../hooks/useSettings";

const businessNameSchema = z.object({
  businessName: z.string().min(1, "O nome do comércio é obrigatório."),
});

type BusinessNameFormData = z.infer<typeof businessNameSchema>;

interface UpdateBusinessNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateBusinessNameDialog({
  open,
  onOpenChange,
}: UpdateBusinessNameDialogProps) {
  const { businessName, refetchSettings } = useSettings();

  const form = useForm<BusinessNameFormData>({
    resolver: zodResolver(businessNameSchema),
    defaultValues: { businessName: "" },
  });

  const { reset } = form;
  useEffect(() => {
    if (open) {
      reset({ businessName });
    }
  }, [open, businessName, reset]);

  async function onSubmit(data: BusinessNameFormData) {
    try {
      await settingsService.update(data);
      await refetchSettings();
      toast.success("Nome do comércio atualizado com sucesso.");
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar o nome do comércio. Tente novamente.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className="w-full cursor-pointer"
        >
          <Store className="w-4 h-4 mr-2" />
          Nome do comércio
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Nome do comércio</DialogTitle>
          <DialogDescription>
            Atualize o nome exibido na tela de login e na barra de navegação.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Comércio do João" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
