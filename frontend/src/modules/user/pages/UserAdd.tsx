import { PageContainer } from "@/components/shared";
import { userService } from "../services/user.service";
import { toast } from "sonner";
import { CreateUserFormData } from "../schemas/user.schemas";
import { UserForm } from "../components/UserForm";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";

export function UserAdd() {
  usePageTitle("Adicionar acesso");

  const navigate = useNavigate();

  const handleSubmit = async (data: CreateUserFormData, image?: File) => {
    try {
      await userService.create(data, image);
      toast.success("Usuário criado com sucesso!");
      navigate("/admin/users");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível criar o usuário. Tente novamente.");
      }
      throw error;
    }
  };
  return (
    <PageContainer title="Adicionar acesso">
      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        cancelPath="/admin/users"
      />
    </PageContainer>
  );
}
