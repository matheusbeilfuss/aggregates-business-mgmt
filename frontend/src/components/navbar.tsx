import { SidebarTrigger } from "@/components/ui/sidebar";
import { CircleUserRound } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full h-22 bg-gray-300 flex justify-between items-center px-4">
      <SidebarTrigger className="hover:bg-gray-400 h-10 w-10" />
      <h3>Nome do Comércio</h3>
      <a
        href="#"
        className="h-10 w-10 hover:bg-gray-400 rounded-full flex justify-center items-center"
      >
        <CircleUserRound className="h-6 w-6" />
      </a>
    </nav>
  );
}
