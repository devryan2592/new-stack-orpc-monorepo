"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLayoutStore } from "../../store/layout";
import { usePathname } from "next/navigation";
import { getMenuList, NavMenuItem } from "@/lib/nav-menu";
import { MODULES, ModuleId, MODULE_LIST } from "@/lib/modules";
import SidebarModuleSelector from "./sidebar-module-selector";
import { useNavStore } from "@/store/nav";
import { CRM_LINKS, BACKOFFICE_LINKS, WEBSITE_LINKS } from "@/lib/links";

const LeftSidebar = () => {
  const { open, toggleSidebar } = useSidebar();
  const { leftOpen } = useLayoutStore();
  const { activeModule, setActiveModule } = useNavStore();
  const pathname = usePathname();

  const getModuleIdFromPath = (path: string): ModuleId | null => {
    if (
      Object.values(CRM_LINKS).some(
        (link) => link !== "/" && (path === link || path.startsWith(link + "/"))
      )
    )
      return MODULES.CRM;
    if (
      Object.values(BACKOFFICE_LINKS).some(
        (link) => link !== "/" && (path === link || path.startsWith(link + "/"))
      )
    )
      return MODULES.BACKOFFICE;
    if (
      Object.values(WEBSITE_LINKS).some(
        (link) => link !== "/" && (path === link || path.startsWith(link + "/"))
      )
    )
      return MODULES.WEBSITE;
    return null;
  };

  React.useEffect(() => {
    const detected = getModuleIdFromPath(pathname);
    if (detected && detected !== activeModule) {
      setActiveModule(detected);
    }
  }, [pathname, activeModule, setActiveModule]);

  const menuGroups = getMenuList(activeModule);

  const isPathActive = (url?: string, exact: boolean = false) => {
    if (!url) return false;

    // 1. Always check for exact match first
    if (pathname === url) return true;

    // 2. If 'exact' flag is passed (used for sub-items), stop here.
    if (exact) return false;

    // 3. For non-exact matches (used for parent items to check against children)
    if (pathname.startsWith(url)) {
      // Ensure we're matching complete path segments (e.g., /blogs/ not /blogssomething)
      const nextChar = pathname.charAt(url.length);
      return nextChar === "/" || nextChar === "";
    }

    return false;
  };

  const isParentActive = (item: NavMenuItem): boolean => {
    // For parent items with children, check if any child is active
    // Don't highlight parent based on its own URL if it has children
    if (item.items && item.items.length > 0) {
      return item.items.some((subItem) => isPathActive(subItem.url));
    }

    // For items without children, check if the item itself is active
    return isPathActive(item.url);
  };

  React.useEffect(() => {
    if (leftOpen && !open) toggleSidebar();
    else if (!leftOpen && open) toggleSidebar();
  }, [leftOpen, open, toggleSidebar]);

  const renderMenuItem = (item: NavMenuItem) => {
    // If item has sub-items, render as collapsible
    if (item.items && item.items.length > 0) {
      const parentActive = isParentActive(item);
      const anyChildActive = item.items.some((sub) => isPathActive(sub.url));

      return (
        <Collapsible key={item.title} defaultOpen={anyChildActive}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className="w-full group"
                isActive={parentActive}
              >
                {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="mt-0.5">
                {item.items.map((subItem) => (
                  <div key={subItem.title} className="relative">
                    <SidebarMenuSubItem key={subItem.title} className="">
                      <SidebarMenuSubButton
                        asChild
                        // isActive={isPathActive(subItem.url, true)}
                      >
                        <Link href={subItem.url || "#"}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    {isPathActive(subItem.url, true) && (
                      <div className="absolute -left-3 top-0 h-full w-[2px] bg-primary" />
                    )}
                  </div>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    // If item has no sub-items, render as direct link
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isPathActive(item.url)}>
          <Link href={item.url || "#"}>
            {item.icon && <item.icon className="mr-1 h-4 w-4" />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const activeModuleLabel =
    MODULE_LIST.find((m) => m.id === activeModule)?.label || "CRM";

  const sidebarHeader = (
    <div className="sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b  px-3 py-2 z-10">
      <div className="h-9 flex items-center justify-center-safe text-sm font-medium ">
        <span className="text-xs mr-1.5   text-muted-foreground">Module:</span>{" "}
        {activeModuleLabel}
      </div>
    </div>
  );

  const sidebarContent = (
    <SidebarContent className="">
      {menuGroups.map((group, index) => (
        <SidebarGroup key={group.groupLabel || `group-${index}`}>
          {group.groupLabel && (
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
          )}
          <SidebarMenu>{group.items.map(renderMenuItem)}</SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );

  return (
    <Sidebar className="border-r left-[calc(var(--sidebar-width-icon)_+_1px)]">
      {sidebarHeader}
      {sidebarContent}
      <SidebarFooter>
        <SidebarModuleSelector />
      </SidebarFooter>
    </Sidebar>
  );
};

export const LeftSidebarContainer = () => {
  return (
    <SidebarProvider
      accessKey="left-sidebar"
      className="w-fit shrink-0 overflow-hidden max-h-dvh hidden md:flex"
    >
      <LeftSidebar />
    </SidebarProvider>
  );
};
