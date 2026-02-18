import { FormActions, PageContainer } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Pencil } from "lucide-react";

export function User() {
  const isAdmin = true;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <PageContainer title="Minha conta">
      <form onSubmit={handleSubmit} className="space-y-8">
        {isAdmin && (
          <div className="flex justify-center">
            <Badge variant="secondary">Administrador</Badge>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative w-56 h-56 md:w-80 md:h-80">
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                <UserIcon className="w-24 h-24 md:w-40 md:h-40 text-muted-foreground" />
              </div>

              <button
                type="button"
                className="absolute bottom-3 right-3 md:bottom-5 md:right-5 
                 bg-background border rounded-full p-3 shadow-md"
              >
                <Pencil size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input className="h-9" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sobrenome</label>
              <Input className="h-9" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Usuário</label>
              <Input className="h-9" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <Input type="email" className="h-9" />
            </div>

            {isAdmin && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nome do Comércio
                  </label>
                  <Input className="h-9" />
                </div>

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

        <FormActions cancelPath="/home" submitLabel="Salvar" />
      </form>
    </PageContainer>
  );
}
