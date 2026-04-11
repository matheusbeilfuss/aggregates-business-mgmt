import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import {
  PageContainer,
  ConfirmDialog,
  LoadingState,
} from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClients } from "../hooks";
import { clientService } from "../services/client.service";
import type { Client } from "../types";
import { ClientProfile } from "../components/ClientProfile";
import { groupByLetter } from "../utils/groupByLetter";
import { ApiError } from "@/lib/api";
import { formatCpfCnpj } from "@/utils";

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
    const q = search
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.nameNormalized.includes(q));
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
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir o cliente.",
      );
    } finally {
      setClientToDelete(null);
    }
  }

  const showProfile = !!selectedClient;

  return (
    <PageContainer
      title="Clientes"
      actions={
        <Button
          className="h-9 px-4 text-sm font-medium text-white gap-1.5
                     hover:opacity-90 active:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--color-primary-40)" }}
          onClick={() => navigate("/clients/add")}
        >
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      }
    >
      {loading ? (
        <LoadingState />
      ) : (
        <div
          className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-xl bg-background"
          style={{ border: "1px solid var(--color-outline-variant)" }}
        >
          <div
            className={`flex flex-col shrink-0 w-full md:w-80 lg:w-96
                        border-r ${showProfile ? "hidden md:flex" : "flex"}`}
            style={{ borderColor: "var(--color-outline-variant)" }}
          >
            <div
              className="flex items-center gap-2 px-3 py-3 border-b"
              style={{ borderColor: "var(--color-outline-variant)" }}
            >
              <div className="relative flex-1">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                  style={{ color: "var(--color-on-surface-variant)" }}
                />
                <Input
                  placeholder="Pesquise pelo nome"
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto py-2">
                {sorted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
                    <Users
                      className="h-8 w-8"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
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
                      <p
                        className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        {letter}
                      </p>
                      {grouped[letter].map((client) => {
                        const isSelected = selectedClient?.id === client.id;
                        return (
                          <button
                            key={client.id}
                            onClick={() => setSelectedClient(client)}
                            className="w-full text-left px-4 py-2.5 text-sm
                                       transition-colors focus-visible:outline-none"
                            style={{
                              backgroundColor: isSelected
                                ? "var(--color-primary-90)"
                                : undefined,
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected)
                                (
                                  e.currentTarget as HTMLElement
                                ).style.backgroundColor =
                                  "var(--color-surface-container-low)";
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected)
                                (
                                  e.currentTarget as HTMLElement
                                ).style.backgroundColor = "";
                            }}
                          >
                            <span
                              className="block truncate font-medium text-sm"
                              style={{
                                color: isSelected
                                  ? "var(--color-primary-10)"
                                  : "var(--color-on-surface)",
                              }}
                            >
                              {client.name}
                            </span>
                            {client.address?.city && (
                              <span
                                className="block text-xs truncate"
                                style={{
                                  color: isSelected
                                    ? "var(--color-primary-40)"
                                    : "var(--color-on-surface-variant)",
                                }}
                              >
                                {client.address.city}/{client.address.state}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {sorted.length > 0 && (
                <div
                  className="flex flex-col items-center justify-center py-2 px-1
                             text-[10px] select-none border-l"
                  style={{ borderColor: "var(--color-outline-variant)" }}
                >
                  {allLetters.map((l) => (
                    <button
                      key={l}
                      onClick={() => scrollToLetter(l)}
                      disabled={!grouped[l]}
                      className="leading-tight py-px w-4 text-center transition-colors"
                      style={{
                        color: grouped[l]
                          ? "var(--color-primary-40)"
                          : "var(--color-outline-variant)",
                        fontWeight: grouped[l] ? 600 : 400,
                        cursor: grouped[l] ? "pointer" : "default",
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className={`flex-1 overflow-hidden flex-col
                        ${showProfile ? "flex" : "hidden md:flex"}`}
          >
            {selectedClient ? (
              <ClientProfile
                client={selectedClient}
                onEdit={(c) => navigate(`/clients/${c.id}/edit`)}
                onDelete={(c) => setClientToDelete(c)}
                onBack={() => setSelectedClient(null)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Users
                  className="h-12 w-12"
                  style={{ color: "var(--color-outline-variant)" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
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
        title="Excluir este cliente?"
        description={
          clientToDelete
            ? [clientToDelete.name, formatCpfCnpj(clientToDelete.cpfCnpj)]
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
