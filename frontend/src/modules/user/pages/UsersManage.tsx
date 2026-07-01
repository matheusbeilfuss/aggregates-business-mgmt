import {
  LoadingState,
  PageContainer,
  ConfirmDialog,
} from "@/components/shared";
import { useUsers } from "../hooks/useUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { userService } from "../services/user.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ApiError } from "@/lib/api";
import { usePageTitle } from "@/hooks/usePageTitle";

export function UsersManage() {
  usePageTitle("Gerenciar acessos");

  const navigate = useNavigate();
  const { data: users, loading, error, refetch } = useUsers();
  const { user: loggedUser } = useAuth();

  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [avatarUrls, setAvatarUrls] = useState<Record<number, string>>({});
  const avatarUrlsRef = useRef<Record<number, string>>({});

  useEffect(() => {
    if (!users?.length) return;

    const usersWithAvatar = users.filter((u) => u.imgName);

    Promise.allSettled(
      usersWithAvatar.map(async (u) => {
        const blob = await userService.getAvatarById(u.id, u.imgName);
        return [u.id, URL.createObjectURL(blob)] as const;
      }),
    ).then((results) => {
      Object.values(avatarUrlsRef.current).forEach(URL.revokeObjectURL);
      const newUrls = Object.fromEntries(
        results
          .filter((r) => r.status === "fulfilled")
          .map(
            (r) =>
              (r as PromiseFulfilledResult<readonly [number, string]>).value,
          ),
      );
      avatarUrlsRef.current = newUrls;
      setAvatarUrls(newUrls);
    });

    return () => {
      Object.values(avatarUrlsRef.current).forEach(URL.revokeObjectURL);
      avatarUrlsRef.current = {};
    };
  }, [users]);

  async function handleDeleteUser() {
    if (userToDelete === null) return;
    try {
      await userService.delete(userToDelete);
      toast.success("Usuário excluído com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Não foi possível excluir o usuário.",
      );
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
    <PageContainer
      title="Gerenciar acessos"
      actions={
        <Button
          className="h-9 px-4 text-sm font-medium text-white gap-1.5
                     hover:opacity-90 active:opacity-80 transition-opacity cursor-pointer"
          style={{ backgroundColor: "var(--color-primary-40)" }}
          onClick={() => navigate("/admin/users/add")}
        >
          <UserPlus className="h-4 w-4" />
          Adicionar acesso
        </Button>
      }
    >
      {error && (
        <p className="text-sm text-destructive mb-4">{error.message}</p>
      )}

      {!users?.length ? (
        <div
          className="flex flex-col items-center justify-center gap-2 py-16
                     rounded-xl border border-dashed"
          style={{ borderColor: "var(--color-outline-variant)" }}
        >
          <Users
            className="h-6 w-6"
            style={{ color: "var(--color-on-surface-variant)" }}
          />
          <p
            className="text-sm"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Nenhum usuário cadastrado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => {
            const isSelf = user.id === loggedUser?.id;
            const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

            return (
              <div
                key={user.id}
                className="flex items-center gap-4 px-4 py-4 rounded-xl border
                           bg-background transition-colors hover:bg-accent/50"
                style={{ borderColor: "var(--color-outline-variant)" }}
              >
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarImage src={avatarUrls[user.id]} />
                  <AvatarFallback
                    className="text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--color-primary-90)",
                      color: "var(--color-primary-10)",
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {user.firstName} {user.lastName}{" "}
                    {user.admin && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-semibold
                   px-2 py-0.5 rounded-full align-middle"
                        style={{
                          backgroundColor: "var(--color-primary-90)",
                          color: "var(--color-primary-40)",
                        }}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        Admin
                      </span>
                    )}{" "}
                    {isSelf && (
                      <span
                        className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full align-middle"
                        style={{
                          backgroundColor: "var(--color-surface-container-low)",
                          color: "var(--color-on-surface-variant)",
                        }}
                      >
                        Você
                      </span>
                    )}
                  </p>
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    @{user.username}
                    {user.email && ` · ${user.email}`}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer text-destructive
                                 focus:text-destructive focus:bg-destructive/10"
                      disabled={isSelf}
                      onClick={() => setUserToDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={userToDelete !== null}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        title="Excluir este usuário?"
        description={
          userToDelete
            ? `${users?.find((u) => u.id === userToDelete)?.firstName || ""} será removido permanentemente.`
            : ""
        }
        onConfirm={handleDeleteUser}
        confirmLabel="Excluir"
        variant="destructive"
      />
    </PageContainer>
  );
}
