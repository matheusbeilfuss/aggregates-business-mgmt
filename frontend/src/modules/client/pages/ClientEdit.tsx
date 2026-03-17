import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { usePageTitle } from "@/hooks/usePageTitle";
import { ApiError } from "@/lib/api";
import { formatPhone, formatCpfCnpj, formatCep } from "@/utils";
import { clientService } from "../services/client.service";
import { clientSchema, ClientFormData } from "../schemas/client.schemas";
import { ClientForm } from "../components/ClientForm";
import { useClient } from "../hooks";

export function ClientEdit() {
  usePageTitle("Editar cliente");

  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  const navigate = useNavigate();

  const { data: client, loading } = useClient(clientId);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      cpfCnpj: "",
      email: "",
      phones: [{ number: "", type: "CELULAR" }],
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  useEffect(() => {
    if (!client) return;

    form.reset({
      name: client.name,
      cpfCnpj: formatCpfCnpj(client.cpfCnpj ?? ""),
      email: client.email ?? "",
      phones: client.phones.map((p) => ({
        number: formatPhone(p.number),
        type: p.type,
      })),
      cep: formatCep(client.address?.cep ?? ""),
      street: client.address?.street ?? "",
      number: client.address?.number ?? "",
      complement: client.address?.complement ?? "",
      neighborhood: client.address?.neighborhood ?? "",
      city: client.address?.city ?? "",
      state: client.address?.state ?? "",
    });
  }, [client, form]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      await clientService.update(clientId, {
        name: data.name,
        cpfCnpj: data.cpfCnpj || undefined,
        email: data.email || undefined,
        phones: data.phones,
        cep: data.cep || undefined,
        street: data.street,
        number: data.number,
        complement: data.complement || undefined,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      });

      toast.success("Cliente atualizado com sucesso.");
      navigate(`/clients?id=${clientId}`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível atualizar o cliente.");
      }
    }
  };

  return (
    <ClientForm
      title="Editar cliente"
      form={form}
      loading={loading}
      onSubmit={onSubmit}
      submitLabel="Salvar alterações"
    />
  );
}
