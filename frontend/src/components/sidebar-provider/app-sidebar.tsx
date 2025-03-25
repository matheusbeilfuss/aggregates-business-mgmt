import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { items } from "./sidebar-items";

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
