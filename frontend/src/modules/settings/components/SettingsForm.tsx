import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, FormActions } from "@/components/shared";
import { ImagePlus, Trash2 } from "lucide-react";
import { settingsSchema, SettingsFormData } from "../schemas/settings.schemas";
import { API_URL } from "@/lib/api";

const FORM_ID = "settings-form";

interface SettingsFormProps {
  defaultValues: SettingsFormData;
  currentImgName?: string;
  onSubmit: (data: SettingsFormData, image?: File) => Promise<void>;
  onRemoveImage: () => Promise<void>;
  cancelPath: string;
}

export function SettingsForm({
  defaultValues,
  currentImgName,
  onSubmit,
  onRemoveImage,
  cancelPath,
}: SettingsFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreviewUrl(url);
    setSelectedImage(file);
  }

  async function handleRemoveImage() {
    try {
      await onRemoveImage();
      setSelectedImage(undefined);
      setPreviewUrl(undefined);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = undefined;
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsConfirmRemoveOpen(false);
    }
  }

  const displayedImage =
    previewUrl ??
    (currentImgName ? `${API_URL}/settings/business-image` : undefined);

  const hasImage = !!displayedImage;

  return (
    <div className="flex flex-col flex-1">
      <Form {...form}>
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit((data) => onSubmit(data, selectedImage))}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full aspect-video rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                {hasImage ? (
                  <img
                    src={displayedImage}
                    alt="Foto do negócio"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlus className="w-12 h-12 text-muted-foreground" />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />

              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                {hasImage ? "Alterar foto" : "Adicionar foto"}
              </Button>

              {currentImgName && !selectedImage && (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full cursor-pointer"
                    onClick={() => setIsConfirmRemoveOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover foto
                  </Button>

                  <ConfirmDialog
                    open={isConfirmRemoveOpen}
                    onOpenChange={setIsConfirmRemoveOpen}
                    title="Você tem certeza que deseja remover a foto do negócio?"
                    description="A foto será removida permanentemente da tela de login."
                    onConfirm={handleRemoveImage}
                    confirmLabel="Remover"
                    variant="destructive"
                  />
                </>
              )}
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do comércio</FormLabel>
                    <FormControl>
                      <Input className="h-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>

      <FormActions
        cancelPath={cancelPath}
        submitLabel="Salvar"
        formId={FORM_ID}
      />
    </div>
  );
}
