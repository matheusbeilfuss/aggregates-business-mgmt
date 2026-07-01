import { AppSidebar } from "./sidebar-provider/AppSidebar";
import { Navbar } from "./Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { useFavicon } from "@/hooks/useFavicon";

export function Layout({ children }: { children: ReactNode }) {
  useFavicon();

  return (
    <SidebarProvider>
      <div className="flex min-h-dvh w-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="sticky top-0 z-30">
            <Navbar />
          </div>
          <main
            className="flex-1 overflow-x-hidden"
            style={{ backgroundColor: "var(--color-surface-container-low)" }}
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
