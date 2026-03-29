import { PageContainer, LoadingState } from "@/components/shared";
import { settingsService } from "../services/settings.service";
import { toast } from "sonner";
import { SettingsFormData } from "../schemas/settings.schemas";
import { SettingsForm } from "../components/SettingsForm";
import { ApiError } from "@/lib/api";
import { useSettings } from "../hooks/useSettings";
import { usePageTitle } from "@/hooks/usePageTitle";

export function Settings() {
  usePageTitle("Configurações");

  const { businessName, businessImgName, isLoading, refetchSettings } =
    useSettings();

  async function handleSubmit(data: SettingsFormData, image?: File) {
    try {
      await settingsService.update(data.businessName);

      if (image) {
        await settingsService.updateBusinessImage(image);
      }

      await refetchSettings();
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível salvar as configurações.");
      }
      throw error;
    }
  }

  async function handleRemoveImage() {
    try {
      await settingsService.deleteBusinessImage();
      await refetchSettings();
      toast.success("Foto removida com sucesso.");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível remover a foto.");
      }
      throw error;
    }
  }

  if (isLoading) {
    return (
      <PageContainer title="Configurações">
        <LoadingState rows={4} variant="form" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Configurações">
      <SettingsForm
        defaultValues={{ businessName }}
        currentImgName={businessImgName}
        onSubmit={handleSubmit}
        onRemoveImage={handleRemoveImage}
        cancelPath="/"
      />
    </PageContainer>
  );
}
