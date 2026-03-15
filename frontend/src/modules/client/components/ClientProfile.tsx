import {
  User,
  FileText,
  Mail,
  MapPin,
  Phone as PhoneIcon,
  MessageCircle,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Client } from "../types";
import { phoneTypeLabel } from "../utils/labels";
import { selectPrimaryPhone } from "@/utils";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import { PhoneTypeIcon } from "./PhoneTypeIcon";

interface ClientProfileProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onBack?: () => void;
}

export function ClientProfile({
  client,
  onEdit,
  onDelete,
  onBack,
}: ClientProfileProps) {
  const whatsappPhone = client.phones.find((p) => p.type === "WHATSAPP");
  const primaryPhone = selectPrimaryPhone(client.phones);

  const addressLine = client.address
    ? `${client.address.street}, Nº ${client.address.number} — ${client.address.neighborhood}, ${client.address.city}/${client.address.state}`
    : null;

  return (
    <div className="flex flex-col h-full">
      {onBack && (
        <div className="flex items-center gap-2 px-4 pt-2 pb-4 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Clientes
          </Button>
        </div>
      )}

      <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted">
            <User className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold leading-tight">{client.name}</h2>
        </div>

        <Separator />

        <div className="space-y-3">
          {client.cpfCnpj && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  CPF / CNPJ
                </p>
                <p className="text-sm font-medium">
                  {formatCpfCnpj(client.cpfCnpj)}
                </p>
              </div>
            </div>
          )}

          {client.phones.map((phone) => (
            <div key={phone.id} className="flex items-start gap-3">
              <PhoneTypeIcon
                type={phone.type}
                className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0"
              />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  {phoneTypeLabel[phone.type]}
                </p>
                <p className="text-sm font-medium">{phone.number}</p>
              </div>
            </div>
          ))}

          {client.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">E-mail</p>
                <p className="text-sm font-medium break-all">{client.email}</p>
              </div>
            </div>
          )}

          {addressLine && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Endereço</p>
                <p className="text-sm font-medium">{addressLine}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Contato rápido
          </p>
          <div className="flex gap-2 flex-wrap">
            {whatsappPhone && (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a
                  href={`https://wa.me/55${whatsappPhone.number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  WhatsApp
                </a>
              </Button>
            )}

            {primaryPhone && (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href={`tel:${primaryPhone.number.replace(/\D/g, "")}`}>
                  <PhoneIcon className="h-4 w-4 text-blue-600" />
                  Ligar
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="border-t px-6 py-3 flex items-center justify-end gap-2 bg-background">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => onEdit(client)}
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive"
          onClick={() => onDelete(client)}
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
