import { PageContainer, LoadingState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useUserAvatar } from "../hooks/useUsers";
import { useState } from "react";
import { userService } from "../services/user.service";
import { toast } from "sonner";
import { UpdateUserFormData } from "../schemas/user.schemas";
import { UpdatePasswordDialog } from "../components/UpdatePasswordDialog";
import { UserForm } from "../components/UserForm";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { UpdateBusinessNameDialog } from "@/modules/settings/components/UpdateBusinessNameDialog";

export function User() {
  const navigate = useNavigate();

  const { user, isLoading, refetchUser } = useAuth();
  const avatar = useUserAvatar(user?.imgName);

  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] =
    useState(false);
  const [isUpdateBusinessNameDialogOpen, setIsUpdateBusinessNameDialogOpen] =
    useState(false);

  if (isLoading) {
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
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao atualizar perfil. Tente novamente.");
      }
      throw error;
    }
  };

  return (
    <PageContainer title="Meu perfil">
      <UserForm
        key={avatar}
        mode="edit"
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          imgName: avatar,
        }}
        isAdmin={user.admin}
        onSubmit={handleSubmit}
        cancelPath="/"
        extraActions={
          <>
            <UpdatePasswordDialog
              open={isUpdatePasswordDialogOpen}
              onOpenChange={setIsUpdatePasswordDialogOpen}
              onSuccess={() => setIsUpdatePasswordDialogOpen(false)}
            />
            {user.admin && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full cursor-pointer"
                  onClick={() => navigate("/admin/users")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar acessos
                </Button>

                <UpdateBusinessNameDialog
                  open={isUpdateBusinessNameDialogOpen}
                  onOpenChange={setIsUpdateBusinessNameDialogOpen}
                />
              </>
            )}
          </>
        }
      />
    </PageContainer>
  );
}
