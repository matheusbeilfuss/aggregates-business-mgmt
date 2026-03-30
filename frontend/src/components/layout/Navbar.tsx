import { Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useSettings } from "@/modules/settings/hooks/useSettings";
import { useUserAvatar } from "@/modules/user/hooks";
import { useBreadcrumbs } from "./breadcrumb";

export function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { businessName } = useSettings();
  const avatar = useUserAvatar(user?.imgName);
  const crumbs = useBreadcrumbs();

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((s) => s!.charAt(0).toUpperCase())
    .join("");

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <nav
      className="w-full h-14 flex items-center justify-between px-4
                 border-b border-border bg-background shrink-0"
    >
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="h-8 w-8 shrink-0 rounded-md text-muted-foreground hover:bg-accent" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {crumbs.length > 0 ? (
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-sm">
                    {businessName}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-sm font-medium">
                  {businessName}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <Fragment key={`${crumb.url}-${i}`}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-sm">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.url} className="text-sm">
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full h-9 w-9 flex items-center justify-center
                       shrink-0 hover:ring-2 hover:ring-border transition-all"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} />
              <AvatarFallback
                className="text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-primary-90)",
                  color: "var(--color-primary-10)",
                }}
              >
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {user?.firstName && (
            <>
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user.username}
                </p>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={() => navigate("/user")}>
            <User className="mr-2 h-4 w-4" />
            Meu perfil
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onLogout}
            className="text-destructive focus:text-destructive
                       focus:bg-destructive/10 hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
