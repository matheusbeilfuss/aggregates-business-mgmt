import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebarProvider } from "@/components/app-sidebar-provider";

export function Home() {
  return (
    <AppSidebarProvider>
      <div className="flex flex-col justify-center items-center mx-auto">
        <div className="w-[80%] h-[20vh] flex flex-col justify-center items-start">
          <h1 className="text-3xl">Olá, [Usuário]</h1>
        </div>
        <div className="w-[80%] grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="hover:shadow-lg px-4">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl lg:text-2xl">
                Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent className="ml-5 text-lg md:text-xl lg:text-2xl">
              <ul className="list-disc">
                <li className="mb-2">João da Silva - 5m³ Areia Fina - 7h</li>
                <li className="mb-2">
                  Maria de Oliveira - 5m³ Areia c/ Brita - 8h
                </li>
                <li className="mb-2">José Costa - 2m³ - Areia c/ Brita - 9h</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg px-4">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl lg:text-2xl">
                Estoque
              </CardTitle>
            </CardHeader>
            <CardContent className="ml-5 text-lg md:text-xl lg:text-2xl">
              <ul className="list-disc">
                <li className="mb-2">Areia c/ Brita - 10m³ - 30000 ton</li>
                <li className="mb-2">Areia Fina - 5m³ - 15000 ton</li>
                <li className="mb-2">Pedra de Rio - 10m³ - 40000 ton</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg px-4">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl lg:text-2xl">
                Cobranças
              </CardTitle>
            </CardHeader>
            <CardContent className="ml-5 text-lg md:text-xl lg:text-2xl">
              <ul className="list-disc">
                <li className="mb-2">João da Silva - 24/01/25 - R$ 500</li>
                <li className="mb-2">Maria da Silva - 31/01/25 - R$ 495</li>
                <li className="mb-2">José Costa - 02/02/2025 - R$ 1000</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg px-4">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl lg:text-2xl">
                Balanço - Jan
              </CardTitle>
            </CardHeader>
            <CardContent className="ml-5 text-lg md:text-xl lg:text-2xl">
              <ul className="list-disc">
                <li className="mb-2">Entradas: R$ 3.500,00</li>
                <li className="mb-2">Saídas: R$ 4.000,00</li>
                <li className="mb-2">Média de Lucro: R$ -1.000,00</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppSidebarProvider>
  );
}
