import { MessageCircle, Phone, Smartphone, PhoneCall } from "lucide-react";
import { PhoneType } from "../types";

interface PhoneTypeIconProps {
  type: PhoneType;
  className?: string;
}

export function PhoneTypeIcon({
  type,
  className = "h-4 w-4",
}: PhoneTypeIconProps) {
  switch (type) {
    case "WHATSAPP":
      return <MessageCircle className={className} />;
    case "FIXO":
      return <Phone className={className} />;
    case "CELULAR":
      return <Smartphone className={className} />;
    default:
      return <PhoneCall className={className} />;
  }
}
