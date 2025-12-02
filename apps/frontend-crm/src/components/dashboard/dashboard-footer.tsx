"use client";

import { Button } from "@workspace/ui/components/button";
import { AppButton } from "@workspace/ui/custom/app-button";
import { HelpCircleIcon } from "lucide-react";

export function DashboardFooter() {
  return (
    <footer className="sticky bottom-0 flex shrink-0 items-center justify-between gap-2 border-t bg-background px-3 py-2 z-10 ">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ORPC. All rights reserved.
        </div>
        <Button
          variant="link"
          size="sm"
          className="text-sm text-muted-foreground"
        >
          Terms of Service
        </Button>
        <AppButton icon={HelpCircleIcon} />
      </div>
    </footer>
  );
}
