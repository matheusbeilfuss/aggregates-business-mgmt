import { SidebarTrigger } from "@/components/ui/sidebar";
import { CircleUserRound, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full h-22 bg-gray-300 flex justify-between items-center px-4">
      <SidebarTrigger className="hover:bg-gray-400 h-10 w-10" />
      <h3>Nome do Comércio</h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-10 w-10 hover:bg-gray-400 rounded-full flex justify-center items-center">
            <CircleUserRound className="h-6 w-6" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate("/user")}>
            <User className="mr-2 h-4 w-4" />
            Meu perfil
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onLogout}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="text-red-600 mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
