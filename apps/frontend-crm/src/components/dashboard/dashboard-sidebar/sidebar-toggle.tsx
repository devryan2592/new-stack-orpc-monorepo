import { cn } from "@workspace/ui/lib/utils";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { FC } from "react";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";

interface DashboardSidebarToggleProps {
  className?: string;
}

const DashboardSidebarToggle: FC<DashboardSidebarToggleProps> = ({
  className,
}) => {
  const { toggleSidebar, open, isMobile } = useSidebar();

  if (isMobile) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute -left-3 top-1/2 -translate-y-1/2 z-20 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={toggleSidebar}
    >
      <CircleChevronLeft
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          !open && "rotate-180"
        )}
      />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default DashboardSidebarToggle;
