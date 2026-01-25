import { AppSidebar } from "./sidebar-provider/app-sidebar";
import { Navbar } from "./navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
