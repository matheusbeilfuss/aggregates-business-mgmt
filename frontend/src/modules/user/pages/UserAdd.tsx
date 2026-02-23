import { PageContainer } from "@/components/shared";
import { userService } from "../services/user.service";
import { toast } from "sonner";
import { CreateUserFormData } from "../schemas/user.schemas";
import { UserForm } from "../components/UserForm";
import { useNavigate } from "react-router-dom";

export function UserAdd() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateUserFormData, image?: File) => {
    try {
      await userService.create(data, image);
      toast.success("Usuário criado com sucesso!");
      navigate("/admin/users");
    } catch {
      toast.error("Erro ao criar usuário. Tente novamente.");
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
