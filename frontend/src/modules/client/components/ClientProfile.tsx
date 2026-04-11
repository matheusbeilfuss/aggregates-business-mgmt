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
import { getPhoneHref, getMapsHref } from "../utils";
import {
  selectPrimaryPhone,
  formatCpfCnpj,
  formatPhone,
  formatCep,
  stripNonDigits,
} from "@/utils";
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

  return (
    <div className="flex flex-col h-full">
      {onBack && (
        <div
          className="flex items-center gap-2 px-4 pt-2 pb-2 md:hidden border-b"
          style={{ borderColor: "var(--color-outline-variant)" }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1 -ml-2"
            style={{ color: "var(--color-primary-40)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Clientes
          </Button>
        </div>
      )}

      <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-primary-90)" }}
          >
            <User
              className="h-7 w-7"
              style={{ color: "var(--color-primary-40)" }}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-tight text-foreground">
              {client.name}
            </h2>
            {client.address?.city && (
              <p className="text-sm text-muted-foreground">
                {client.address.city}/{client.address.state}
              </p>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          {client.cpfCnpj && (
            <div className="flex items-start gap-3">
              <FileText
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: "var(--color-on-surface-variant)" }}
              />
              <div>
                <p
                  className="text-[10px] font-medium uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
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
                className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground"
              />
              <div>
                <p
                  className="text-[10px] font-medium uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {phoneTypeLabel[phone.type]}
                </p>
                <a
                  href={getPhoneHref(phone)}
                  target={phone.type === "WHATSAPP" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline underline-offset-2"
                >
                  {formatPhone(phone.number)}
                </a>
              </div>
            </div>
          ))}

          {client.email && (
            <div className="flex items-start gap-3">
              <Mail
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: "var(--color-on-surface-variant)" }}
              />
              <div>
                <p
                  className="text-[10px] font-medium uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  E-mail
                </p>
                <a
                  href={`mailto:${client.email}`}
                  className="text-sm font-medium break-all hover:underline underline-offset-2"
                >
                  {client.email}
                </a>
              </div>
            </div>
          )}

          {client.address && (
            <div className="flex items-start gap-3">
              <MapPin
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: "var(--color-on-surface-variant)" }}
              />
              <div>
                <p
                  className="text-[10px] font-medium uppercase tracking-wide mb-0.5"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Endereço
                </p>
                <a
                  href={getMapsHref(client.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-2"
                >
                  <p className="text-sm font-medium">
                    {client.address.street}, Nº {client.address.number}
                    {client.address.complement &&
                      `, ${client.address.complement}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {client.address.neighborhood}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {client.address.city}/{client.address.state}
                    {client.address.cep &&
                      ` — ${formatCep(client.address.cep)}`}
                  </p>
                </a>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <p
            className="text-[10px] font-medium uppercase tracking-widest"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Contato rápido
          </p>
          <div className="flex gap-2 flex-wrap">
            {whatsappPhone && (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a
                  href={getPhoneHref(whatsappPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle
                    className="h-4 w-4"
                    style={{ color: "#15803d" }}
                  />
                  WhatsApp
                </a>
              </Button>
            )}
            {primaryPhone && (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href={`tel:+55${stripNonDigits(primaryPhone.number)}`}>
                  <PhoneIcon
                    className="h-4 w-4"
                    style={{ color: "var(--color-primary-40)" }}
                  />
                  Ligar
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        className="border-t px-6 py-3 flex items-center justify-end gap-2 bg-background shrink-0"
        style={{ borderColor: "var(--color-outline-variant)" }}
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2 cursor-pointer"
          onClick={() => onEdit(client)}
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 cursor-pointer text-destructive hover:text-destructive
                     focus:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(client)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
