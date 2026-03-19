import {
  Home,
  Scale,
  Tags,
  Banknote,
  Truck,
  BookUser,
  HandCoins,
  Warehouse,
  Fuel,
  UserRound,
} from "lucide-react";

export const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Pedidos",
    url: "/orders",
    icon: Truck,
  },
  {
    title: "Estoque",
    url: `/stocks`,
    icon: Warehouse,
  },
  {
    title: "Financeiro",
    url: "/finance",
    icon: Banknote,
  },
  {
    title: "Balanços",
    url: "#",
    icon: Scale,
  },
  {
    title: "Preços",
    url: "/prices",
    icon: Tags,
  },
  {
    title: "Clientes",
    url: "/clients",
    icon: BookUser,
  },
  {
    title: "Cobranças",
    url: "/receivables",
    icon: HandCoins,
  },
  {
    title: "Combustível",
    url: "/fuel",
    icon: Fuel,
  },
  {
    title: "Meu perfil",
    url: "/user",
    icon: UserRound,
  },
];
