import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { PageContainer } from "@/components/shared";
import { ConfirmDialog } from "@/components/shared";
import { LoadingState } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useClients } from "../hooks";
import { clientService } from "../services/client.service";
import type { Client } from "../types";
import { ClientProfile } from "../components/ClientProfile";
import { groupByLetter } from "../utils/groupByLetter";
import { ApiError } from "@/lib/api";

export function Client() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: clients, loading, refetch } = useClients();

  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (!idParam || !clients) return;

    const found = clients.find((c) => c.id === Number(idParam));
    if (found) setSelectedClient(found);
  }, [clients, searchParams]);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered = useMemo(() => {
    if (!clients) return [];
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(q));
  }, [clients, search]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [filtered],
  );

  const grouped = useMemo(() => groupByLetter(sorted), [sorted]);
  const letters = Object.keys(grouped).sort();
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  function scrollToLetter(letter: string) {
    sectionRefs.current[letter]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleDelete() {
    if (!clientToDelete) return;
    try {
      await clientService.delete(clientToDelete.id);
      toast.success("Cliente excluído com sucesso.");
      if (selectedClient?.id === clientToDelete.id) setSelectedClient(null);
      refetch();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível excluir o cliente.");
      }
    } finally {
      setClientToDelete(null);
    }
  }

  const showProfile = !!selectedClient;

  return (
    <PageContainer title="Clientes">
      {loading ? (
        <LoadingState />
      ) : (
        <div className="flex h-[calc(100vh-10rem)] overflow-hidden border rounded-lg bg-background">
          <div
            className={`flex flex-col w-full md:w-80 lg:w-96 border-r shrink-0 ${showProfile ? "hidden md:flex" : "flex"}`}
          >
            <div className="flex items-center gap-2 px-3 py-3 border-b">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Pesquise pelo nome"
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => navigate("/clients/add")}
                title="Adicionar cliente"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto py-2">
                {sorted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground px-4 text-center">
                    <Users className="h-8 w-8" />
                    <p className="text-sm">
                      {search
                        ? "Nenhum cliente encontrado."
                        : "Nenhum cliente cadastrado ainda."}
                    </p>
                  </div>
                ) : (
                  letters.map((letter) => (
                    <div
                      key={letter}
                      ref={(el) => {
                        sectionRefs.current[letter] = el;
                      }}
                    >
                      <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {letter}
                      </p>
                      {grouped[letter].map((client) => (
                        <button
                          key={client.id}
                          onClick={() => setSelectedClient(client)}
                          className={`
                            w-full text-left px-4 py-2.5 text-sm transition-colors
                            hover:bg-muted/60 focus-visible:outline-none focus-visible:bg-muted/60
                            ${selectedClient?.id === client.id ? "bg-muted font-medium" : ""}
                          `}
                        >
                          <span className="block truncate">{client.name}</span>
                          {client.address?.city && (
                            <span className="block text-xs text-muted-foreground truncate">
                              {client.address.city}/{client.address.state}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>

              {sorted.length > 0 && (
                <div className="flex flex-col items-center justify-center py-2 px-1 text-[10px] text-muted-foreground select-none">
                  {allLetters.map((l) => (
                    <button
                      key={l}
                      onClick={() => scrollToLetter(l)}
                      disabled={!grouped[l]}
                      className={`
                        leading-tight py-px w-4 text-center transition-colors
                        ${grouped[l] ? "text-foreground hover:text-primary font-medium cursor-pointer" : "opacity-30 cursor-default"}
                      `}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className={`
              flex-1 overflow-hidden
              ${showProfile ? "flex" : "hidden md:flex"}
              flex-col
            `}
          >
            {selectedClient ? (
              <ClientProfile
                client={selectedClient}
                onEdit={(c) => navigate(`/clients/${c.id}/edit`)}
                onDelete={(c) => setClientToDelete(c)}
                onBack={() => setSelectedClient(null)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Users className="h-12 w-12 opacity-30" />
                <p className="text-sm">
                  Selecione um cliente para ver os detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!clientToDelete}
        onOpenChange={(open) => !open && setClientToDelete(null)}
        title="Você tem certeza de que deseja excluir o cliente abaixo?"
        description={
          clientToDelete
            ? [clientToDelete.name, clientToDelete.cpfCnpj]
                .filter(Boolean)
                .join(" · ")
            : ""
        }
        onConfirm={handleDelete}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
