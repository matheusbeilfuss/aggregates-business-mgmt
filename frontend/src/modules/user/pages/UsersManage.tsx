import {
  LoadingState,
  PageContainer,
  ConfirmDialog,
} from "@/components/shared";
import { useUsers } from "../hooks/useUsers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { userService } from "../services/user.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export function UsersManage() {
  const navigate = useNavigate();

  const { data: users, loading, refetch } = useUsers();
  const { user: loggedUser } = useAuth();

  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  async function handleDeleteUser() {
    if (!userToDelete) return;

    try {
      await userService.delete(userToDelete);
      toast.success("Usuário excluído com sucesso.");
    } catch {
      toast.error("Não foi possível excluir o usuário.");
    } finally {
      setUserToDelete(null);
      refetch();
    }
  }

  if (loading) {
    return (
      <PageContainer title="Gerenciar acessos">
        <LoadingState rows={5} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Gerenciar acessos">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users?.map((user) => {
          const isSelf = user.id === loggedUser?.id;

          return (
            <Card
              key={user.id}
              className="rounded-2xl shadow-sm flex flex-col justify-between"
            >
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        user.imgName
                          ? `/users/${user.id}/avatar?v=${user.imgName}`
                          : undefined
                      }
                    />
                    <AvatarFallback>
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <CardTitle className="text-base">
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <CardDescription>@{user.username}</CardDescription>
                  </div>
                </div>

                <Badge variant={user.admin ? "secondary" : "outline"}>
                  {user.admin ? "Administrador" : "Usuário"}
                </Badge>
              </CardHeader>

              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      disabled={isSelf}
                      onClick={() => setUserToDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-auto flex justify-end py-12">
        <Button
          className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-6 text-base cursor-pointer"
          onClick={() => navigate("/admin/users/new")}
        >
          <UserPlus />
          Adicionar acesso
        </Button>
      </div>

      <ConfirmDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        title="Você tem certeza que deseja excluir este usuário?"
        description={
          userToDelete
            ? `O usuário ${users?.find((u) => u.id === userToDelete)?.firstName || ""} será removido permanentemente.`
            : ""
        }
        onConfirm={handleDeleteUser}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
