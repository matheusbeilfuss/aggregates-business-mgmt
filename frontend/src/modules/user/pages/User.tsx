import { FormActions, PageContainer } from "@/components/shared";
import { Badge } from "@/components/ui/badge";

export function User() {
  const isAdmin = true;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement user data saving logic here.
  };

  return (
    <PageContainer title="Minha conta">
      <form onSubmit={handleSubmit}>
        {isAdmin && (
          <div className="flex items-center">
            <Badge variant="secondary">Administrador</Badge>
          </div>
        )}
        <FormActions cancelPath="/home" submitLabel="Salvar" />
      </form>
    </PageContainer>
  );
}
