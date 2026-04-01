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
import { ConfirmDialog, FormActions, FormSection } from "@/components/shared";
import { ImagePlus, Store, Trash2 } from "lucide-react";
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
    <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full space-y-8">
      <Form {...form}>
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit((data) => onSubmit(data, selectedImage))}
        >
          <div className="space-y-8">
            <FormSection icon={Store} title="Identidade do negócio">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Nome do comércio{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onFocus={(e) => e.target.select()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 space-y-3">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  Foto do negócio
                </p>

                <div
                  className="w-full aspect-video rounded-xl overflow-hidden
                             flex items-center justify-center"
                  style={{
                    border: "1px solid var(--color-outline-variant)",
                    backgroundColor: "var(--color-surface-container-low)",
                  }}
                >
                  {hasImage ? (
                    <img
                      src={displayedImage}
                      alt="Foto do negócio"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImagePlus
                        className="w-10 h-10"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        Nenhuma foto adicionada
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="w-4 h-4" />
                    {hasImage ? "Alterar foto" : "Adicionar foto"}
                  </Button>

                  {currentImgName && !selectedImage && (
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 cursor-pointer text-destructive
                                 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setIsConfirmRemoveOpen(true)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                      Remover foto
                    </Button>
                  )}
                </div>
              </div>
            </FormSection>
          </div>
        </form>
      </Form>

      <FormActions
        cancelPath={cancelPath}
        submitLabel="Salvar"
        formId={FORM_ID}
      />

      <ConfirmDialog
        open={isConfirmRemoveOpen}
        onOpenChange={setIsConfirmRemoveOpen}
        title="Remover foto do negócio?"
        description="A foto será removida permanentemente da tela de login."
        onConfirm={handleRemoveImage}
        confirmLabel="Remover"
        variant="destructive"
      />
    </div>
  );
}
