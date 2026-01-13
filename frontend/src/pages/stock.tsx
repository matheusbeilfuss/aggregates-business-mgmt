import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: number;
  name: string;
}

interface StockItem {
  id: number;
  tonQuantity: number;
  m3Quantity: number;
  product: Product;
}

export function Stock() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const controller = new AbortController();

    fetch(`${apiUrl}/stocks`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStocks(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError" || err.message.includes("aborted"))
          return;
        setError("Não foi possível carregar os dados de estoque.");
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col mx-auto w-[80%] h-full">
        <div className="py-15 text-center">
          <h1 className="text-3xl">Estoque</h1>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-md"></Skeleton>
            <Skeleton className="h-12 w-full rounded-md"></Skeleton>
            <Skeleton className="h-12 w-full rounded-md"></Skeleton>
          </div>
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Toneladas</TableHead>
                  <TableHead>M³</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {stocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.product.name}</TableCell>

                    <TableCell>{stock.tonQuantity ?? "-"}</TableCell>

                    <TableCell>{stock.m3Quantity} m³</TableCell>

                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => console.log("Editar", stock.id)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => console.log("Excluir", stock.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => console.log("Adicionar", stock.id)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              <span>Adicionar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {stocks.length === 0 && (
                  <TableRow>
                    <TableCell
                      className="text-center text-muted-foreground italic"
                      colSpan={4}
                    >
                      Nenhum item no estoque.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-auto flex justify-end py-12">
          <Button className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base shadow-sm">
            Adicionar Produto
          </Button>
        </div>
      </div>
    </Layout>
  );
}
