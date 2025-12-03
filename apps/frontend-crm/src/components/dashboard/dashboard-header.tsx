"use client";

import { AppButton } from "@workspace/ui/custom/app-button";
import { PanelLeftIcon, ChevronRight } from "lucide-react";
import { useLayoutStore } from "../../store/layout";
import ThemeToggle from "@/components/app-ui/theme-toggle";
import DashboardBreadcrumbs from "./dashboard-breadcrumbs";
import { Separator } from "@workspace/ui/components/separator";

export function DashboardHeader() {
  const { toggleLeft, toggleRight } = useLayoutStore();

  return (
    <header className="sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-background px-3 z-10 py-2">
      <div className="flex h-full items-center gap-2">
        <AppButton
          aria-label="Toggle left sidebar"
          variant="ghost"
          size="icon"
          onClick={toggleLeft}
        >
          <PanelLeftIcon className="size-5" />
        </AppButton>
        <div className="h-[50%]">
          <Separator orientation="vertical" />
        </div>
        <DashboardBreadcrumbs />
      </div>
    </header>
  );
}
