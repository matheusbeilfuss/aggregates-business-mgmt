import { OrderFormData } from "../schemas/order.schemas";
import { toIsoDate } from "./toIsoDate";

export const orderFormDefaults: OrderFormData = {
  scheduledDate: toIsoDate(new Date()),
  type: "MATERIAL",
  clientName: "",
  clientId: undefined,
  phone: "",
  phoneType: "WHATSAPP",
  cpfCnpj: "",
  state: "",
  city: "",
  neighborhood: "",
  street: "",
  number: "",
  productId: undefined,
  service: "",
  quantity: undefined,
  orderValue: undefined,
  scheduledTime: "",
  observations: "",
};
