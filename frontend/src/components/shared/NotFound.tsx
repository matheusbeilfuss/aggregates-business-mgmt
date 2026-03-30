import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export function NotFound() {
  usePageTitle("Página não encontrada");
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "var(--color-primary-90)" }}
      >
        <FileQuestion
          className="h-8 w-8"
          style={{ color: "var(--color-primary-40)" }}
        />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Página não encontrada
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          A página que você procura não existe ou foi movida.
        </p>
      </div>
      <Button
        onClick={() => navigate("/")}
        className="mt-2 h-9 px-5 text-sm font-medium text-white
                   hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "var(--color-primary-40)" }}
      >
        Voltar ao início
      </Button>
    </div>
  );
}
