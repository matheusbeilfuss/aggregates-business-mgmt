import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navGroups, profileItem } from "./sidebar-items";
import { useSettings } from "@/modules/settings/hooks/useSettings";
import { API_URL } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getBusinessInitials } from "@/utils";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { businessName, businessImgName } = useSettings();
  const { isMobile, setOpenMobile } = useSidebar();

  const initials = getBusinessInitials(businessName);
  const initialsSize =
    initials.length <= 2
      ? "text-sm"
      : initials.length <= 4
        ? "text-xs"
        : "text-[9px]";

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center
                       overflow-hidden flex-shrink-0"
            style={{ backgroundColor: "var(--color-primary-40)" }}
          >
            {businessImgName ? (
              <div
                className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 p-0.5"
                style={{ backgroundColor: "var(--color-primary-40)" }}
              >
                <img
                  src={`${API_URL}/settings/business-image`}
                  alt={businessName}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ) : (
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "var(--color-primary-40)" }}
              >
                <span className={`${initialsSize} font-bold text-white`}>
                  {initials}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="text-sm font-medium truncate cursor-default"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  {businessName}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {businessName}
              </TooltipContent>
            </Tooltip>
            <span
              className="text-[10px] tracking-wide"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Sistema de gestão
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 gap-0">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-2">
            <p
              className="px-2 py-1 text-[10px] font-medium uppercase tracking-widest mb-1"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {group.label}
            </p>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="h-10 text-sm gap-2.5 rounded-lg
                               data-[active=true]:bg-sidebar-primary
                               data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <Link to={item.url} onClick={handleNavClick}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive(profileItem.url)}
              className="h-10 text-sm gap-2.5 rounded-lg
                         data-[active=true]:bg-sidebar-primary
                         data-[active=true]:text-sidebar-primary-foreground"
            >
              <Link to={profileItem.url} onClick={handleNavClick}>
                <profileItem.icon className="h-4 w-4 shrink-0" />
                <span>{profileItem.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
