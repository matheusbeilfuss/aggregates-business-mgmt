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

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Pedidos",
    url: "#",
    icon: Truck,
  },
  {
    title: "Estoque",
    url: "#",
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

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-gray-300">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="h-12 text-lg p-4 hover:bg-gray-400 active:bg-gray-500"
              >
                <a href={item.url}>
                  <item.icon />
                  <span className="ml-3">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
