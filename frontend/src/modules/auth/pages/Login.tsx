import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "../schemas/login.schema";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LoginPayload } from "../types";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "@/lib/api";
import { useSettings } from "@/modules/settings/hooks/useSettings";
import { usePageTitle } from "@/hooks/usePageTitle";

export function Login() {
  usePageTitle("Login");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { businessName } = useSettings();

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await login(values);

      toast.success("Login bem-sucedido!");
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Falha no login. Verifique suas credenciais.");
      }
    }
  }

  return (
    <>
      <div className="w-full h-[30vh] bg-blue-300 flex flex-col justify-center items-center gap-2">
        <h1 className="font-bold text-xl text-blue-600">{businessName}</h1>
        <h3 className="font-medium text-blue-600">Seja bem vindo!</h3>
      </div>
      <div className="w-full h-[55vh] flex flex-col justify-center items-center gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Usuário</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-800"
            >
              Acessar
            </Button>
            <a
              href="https://google.com"
              target="_blank"
              className="text-blue-600 underline"
            >
              Esqueci minha senha
            </a>
          </form>
        </Form>
      </div>
      <div className="w-full h-[5vh] flex flex-col justify-center items-center gap-2">
        <p className="italic text-gray-400">Versão 0.0.1</p>
      </div>
    </>
  );
}
