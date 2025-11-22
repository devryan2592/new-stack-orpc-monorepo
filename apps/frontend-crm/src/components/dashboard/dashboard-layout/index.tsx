"use client";
import { FC } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

interface DashboardLayoutProps {
  // Add your props here
  children?: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <main
      className={cn(
        "relative h-full transition-all duration-300 ease-in-out",
        // Desktop: header is 64px (h-16), collapsed sidebar makes it 48px (h-12)
        "max-h-[calc(100vh-4rem)] mt-16 group-has-data-[collapsible=icon]/sidebar-wrapper:max-h-[calc(100vh-3rem)] group-has-data-[collapsible=icon]/sidebar-wrapper:mt-12",
        // Mobile: header is always 48px (h-12)
        isMobile && "max-h-[calc(100vh-3rem)] mt-12"
      )}
    >
      <div className="absolute top-0 right-0 bottom-0 left-0 overflow-y-auto no-scrollbar m-4">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
