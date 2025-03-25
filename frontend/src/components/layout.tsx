import { AppSidebar } from "./sidebar-provider/app-sidebar";
import { Navbar } from "./navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-full">
        <Navbar />
        {children}
      </div>
    </SidebarProvider>
  );
}
