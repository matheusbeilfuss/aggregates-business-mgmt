import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Tag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoryActionsProps {
  categoryId: string;
  onRename: () => void;
  onDelete: () => void;
}

export function CategoryActions({
  categoryId,
  onRename,
  onDelete,
}: CategoryActionsProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate(`/prices/categories/${categoryId}`)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar preços
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={onRename}>
          <Tag className="mr-2 h-4 w-4" />
          Renomear
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-500 focus:text-red-500 cursor-pointer"
          onClick={onDelete}
        >
          <X className="mr-2 h-4 w-4 text-red-500" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
