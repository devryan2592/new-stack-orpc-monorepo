"use client";

import { Button } from "@workspace/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLayoutStore } from "../../store/layout";
import ThemeToggle from "@/components/app-ui/theme-toggle";

export function DashboardHeader() {
  const { toggleLeft, toggleRight } = useLayoutStore();

  return (
    <header className="sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-background px-3 z-10 py-2">
      <div className="flex items-center gap-2">
        <Button
          aria-label="Toggle left sidebar"
          variant="ghost"
          size="icon"
          onClick={toggleLeft}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <span className="text-sm font-semibold">Dashboard</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          aria-label="Toggle right sidebar"
          variant="ghost"
          size="icon"
          onClick={toggleRight}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </header>
  );
}
