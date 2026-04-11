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
  LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { title: "Home", url: "/", icon: Home },
      { title: "Pedidos", url: "/orders", icon: Truck },
      { title: "Estoque", url: "/stocks", icon: Warehouse },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { title: "Financeiro", url: "/finance", icon: Banknote },
      { title: "Balanços", url: "/balance", icon: Scale },
      { title: "Cobranças", url: "/receivables", icon: HandCoins },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { title: "Preços", url: "/prices", icon: Tags },
      { title: "Clientes", url: "/clients", icon: BookUser },
      { title: "Combustível", url: "/fuel", icon: Fuel },
    ],
  },
];

export const profileItem: NavItem = {
  title: "Meu perfil",
  url: "/user",
  icon: UserRound,
};
