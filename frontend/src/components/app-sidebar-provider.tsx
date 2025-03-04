import { AppSidebar } from "./app-sidebar";
import { Navbar } from "./navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
