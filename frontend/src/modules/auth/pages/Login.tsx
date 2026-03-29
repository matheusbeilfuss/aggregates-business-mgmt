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
import { API_URL } from "@/lib/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export function Login() {
  usePageTitle("Login");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { businessName, businessImgName } = useSettings();
  const [forgotOpen, setForgotOpen] = useState(false);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { username: "", password: "" },
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

  const initial = businessName.charAt(0).toUpperCase();

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div
          className="relative flex flex-col items-center justify-center
                   md:w-1/2 py-14 px-8 overflow-hidden"
          style={{
            backgroundColor: "var(--color-primary-40)",
            animation: "slide-in-left 0.6s ease both",
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="36"
                height="36"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 36 0 L 0 0 0 36"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div
            className="absolute -top-28 -right-28 w-96 h-96 rounded-full
                     opacity-20 blur-3xl pointer-events-none"
            style={{ backgroundColor: "var(--color-primary-10)" }}
          />
          <div
            className="absolute -bottom-36 -left-20 w-80 h-80 rounded-full
                     opacity-20 blur-3xl pointer-events-none"
            style={{ backgroundColor: "var(--color-primary-10)" }}
          />
          <div
            className="relative flex flex-col items-center gap-7 text-center"
            style={{ animation: "fade-up 0.7s 0.2s ease both" }}
          >
            <div
              className="w-28 h-28 md:w-56 md:h-56 rounded-3xl bg-white
                       shadow-2xl overflow-hidden flex items-center justify-center
                       ring-4 ring-white/20"
            >
              {businessImgName ? (
                <img
                  src={`${API_URL}/settings/business-image`}
                  alt={businessName}
                  className="w-full h-full object-contain p-3"
                />
              ) : (
                <span
                  className="text-5xl md:text-8xl font-black select-none"
                  style={{ color: "var(--color-primary-40)" }}
                >
                  {initial}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                {businessName}
              </h1>
              <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
                Sistema de gestão
              </p>
            </div>
          </div>
          <p className="absolute bottom-5 text-white/30 text-xs">
            v{__APP_VERSION__}
          </p>{" "}
        </div>

        <div
          className="flex flex-col items-center justify-center
                   md:w-1/2 px-8 py-16 bg-background"
          style={{ animation: "slide-in-right 0.6s ease both" }}
        >
          <div
            className="w-full max-w-sm space-y-8"
            style={{ animation: "fade-up 0.7s 0.25s ease both" }}
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">
                Bem-vindo de volta
              </h2>
              <p className="text-sm text-muted-foreground">
                Insira suas credenciais para acessar o sistema.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-sm">
                        Usuário
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11"
                          placeholder="Digite seu usuário"
                          autoComplete="username"
                        />
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-semibold text-sm">
                          Senha
                        </FormLabel>
                        <button
                          type="button"
                          onClick={() => setForgotOpen(true)}
                          className="text-xs font-medium transition-opacity hover:opacity-70"
                          style={{ color: "var(--color-primary-40)" }}
                        >
                          Esqueci minha senha
                        </button>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="h-11"
                          placeholder="Digite sua senha"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold text-white
                           transition-opacity hover:opacity-90 active:opacity-80"
                  style={{ backgroundColor: "var(--color-primary-40)" }}
                >
                  Acessar
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Recuperação de acesso</DialogTitle>
            <DialogDescription className="pt-1 leading-relaxed">
              A redefinição de senha não é feita pelo sistema.
              <br />
              <br />
              Entre em contato com o{" "}
              <span className="font-medium text-foreground">
                administrador do sistema
              </span>{" "}
              para que ele atualize suas credenciais de acesso.
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button
              className="w-full font-medium text-white"
              style={{
                backgroundColor: "var(--color-primary-40)",
              }}
            >
              Entendido
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
