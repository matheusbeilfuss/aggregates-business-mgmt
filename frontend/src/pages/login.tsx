import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  user: z.string().nonempty(),
  password: z.string().nonempty(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export interface LoginProps {}

export function Login() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    values: {
      user: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
  }

  return (
    <>
      <div className="w-full h-[30vh] bg-blue-300 flex flex-col justify-center items-center gap-2">
        <h1 className="font-bold text-xl text-blue-600">Nome do Comércio</h1>
        <h3 className="font-medium text-blue-600">Seja bem vindo!</h3>
      </div>
      <div className="w-full h-[55vh] flex flex-col justify-center items-center gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel className="font-bold">Usuário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel className="font-bold">Senha</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                </>
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
