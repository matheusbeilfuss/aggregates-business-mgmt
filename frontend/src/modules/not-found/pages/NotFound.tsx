import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">Página não encontrada</p>
        <p>A página que procura não existe ou foi movida.</p>
        <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
      </div>
    </Layout>
  );
}
