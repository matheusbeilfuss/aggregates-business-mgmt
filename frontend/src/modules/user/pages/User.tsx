import { FormActions, PageContainer } from "@/components/shared";
import { Badge } from "@/components/ui/badge";

export function User() {
  const isAdmin = true;

  return (
    <PageContainer title="Minha conta">
      {isAdmin && (
        <div className="flex items-center">
          <Badge variant="secondary">Administrador</Badge>
        </div>
      )}

      <FormActions cancelPath="/home" submitLabel="Salvar" />
    </PageContainer>
  );
}
