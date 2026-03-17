import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { usePageTitle } from "@/hooks/usePageTitle";
import { ApiError } from "@/lib/api";
import { clientService } from "../services/client.service";
import { clientSchema, ClientFormData } from "../schemas/client.schemas";
import { ClientForm } from "../components/ClientForm";

export function ClientAdd() {
  usePageTitle("Adicionar cliente");

  const navigate = useNavigate();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      cpfCnpj: "",
      email: "",
      phones: [{ number: "", type: "WHATSAPP" }],
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      await clientService.insert({
        name: data.name,
        cpfCnpj: data.cpfCnpj || undefined,
        email: data.email || undefined,
        phones: data.phones,
        cep: data.cep || undefined,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      });

      toast.success("Cliente cadastrado com sucesso.");
      navigate("/clients");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível cadastrar o cliente.");
      }
    }
  };

  return (
    <ClientForm
      title="Adicionar cliente"
      form={form}
      onSubmit={onSubmit}
      submitLabel="Adicionar"
    />
  );
}
