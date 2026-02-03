import {
  Home,
  Scale,
  Tags,
  TrendingDown,
  TrendingUp,
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
    url: "/home",
    icon: Home,
  },
  {
    title: "Pedidos",
    url: "#",
    icon: Truck,
  },
  {
    title: "Estoque",
    url: `/stocks`,
    icon: Warehouse,
  },
  {
    title: "Entradas",
    url: "#",
    icon: TrendingUp,
  },
  {
    title: "Saídas",
    url: "#",
    icon: TrendingDown,
  },
  {
    title: "Balanços",
    url: "#",
    icon: Scale,
  },
  {
    title: "Preços",
    url: "#",
    icon: Tags,
  },
  {
    title: "Clientes",
    url: "#",
    icon: BookUser,
  },
  {
    title: "Cobranças",
    url: "#",
    icon: HandCoins,
  },
  {
    title: "Combustível",
    url: "#",
    icon: Fuel,
  },
  {
    title: "Minha Conta",
    url: "#",
    icon: UserRound,
  },
];
