import { OrderFormData } from "../schemas/order.schemas";
import { toIsoDate } from "@/utils";

export const orderFormDefaults: OrderFormData = {
  scheduledDate: toIsoDate(new Date()),
  type: "MATERIAL",
  clientName: "",
  clientId: undefined,
  phone: "",
  phoneType: "WHATSAPP",
  cpfCnpj: "",
  cep: "",
  state: "",
  city: "",
  neighborhood: "",
  street: "",
  number: "",
  complement: "",
  productId: undefined,
  service: "",
  m3Quantity: undefined,
  orderValue: undefined,
  scheduledTime: "",
  observations: "",
};
