import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User, CircleUserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useUserAvatar } from "@/modules/user/hooks/useUsers";

export function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const avatar = useUserAvatar(user?.imgName);

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
          <button className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray-400 transition-colors">
            <Avatar className="h-9 w-9 border-gray-400">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-gray-200">
                <CircleUserRound className="h-5 w-5 text-gray-700" />
              </AvatarFallback>
            </Avatar>
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
