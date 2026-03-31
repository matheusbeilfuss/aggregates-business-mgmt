import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Tag, Trash2 } from "lucide-react";
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
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            navigate(`/prices/categories/${categoryId}`);
          }}
        >
          <Pencil className="h-4 w-4" />
          Editar preços
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2 cursor-pointer" onSelect={onRename}>
          <Tag className="h-4 w-4" />
          Renomear
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2 cursor-pointer text-destructive
                     focus:text-destructive focus:bg-destructive/10"
          onSelect={onDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
