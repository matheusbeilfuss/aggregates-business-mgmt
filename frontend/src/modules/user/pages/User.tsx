import { PageContainer, LoadingState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useUser, useUserAvatar } from "../hooks/useUsers";
import { useState } from "react";
import { userService } from "../services/user.service";
import { toast } from "sonner";
import { UpdateUserFormData } from "../schemas/user.schemas";
import { UpdatePasswordDialog } from "../components/UpdatePasswordDialog";
import { UserForm } from "../components/UserForm";
import { useNavigate } from "react-router-dom";

export function User() {
  const navigate = useNavigate();

  const { data: user, loading: userLoading, refetch: refetchUser } = useUser();
  const avatar = useUserAvatar(user?.imgUrl);

  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] =
    useState(false);

  if (userLoading) {
    return (
      <PageContainer title="Meu perfil">
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  if (!user) return null;

  const handleSubmit = async (data: UpdateUserFormData, image?: File) => {
    try {
      await userService.update(user.id, data, image);
      await refetchUser();
      toast.success("Perfil atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  return (
    <PageContainer title="Meu perfil">
      <UserForm
        mode="edit"
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          imgUrl: avatar,
        }}
        isAdmin={user.admin}
        onSubmit={handleSubmit}
        cancelPath="/"
        extraActions={
          <>
            {user.admin && (
              <Button
                type="button"
                variant="secondary"
                className="w-full cursor-pointer"
                onClick={() => navigate("/admin/users")}
              >
                <Users className="w-4 h-4 mr-2" />
                Gerenciar acessos
              </Button>
            )}

            <UpdatePasswordDialog
              open={isUpdatePasswordDialogOpen}
              onOpenChange={setIsUpdatePasswordDialogOpen}
              onSuccess={() => setIsUpdatePasswordDialogOpen(false)}
            />
          </>
        }
      />
    </PageContainer>
  );
}
