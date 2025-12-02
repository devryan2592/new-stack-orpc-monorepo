"use client";

import { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MODULE_LIST, ModuleId } from "@/lib/modules";
import { AppButton } from "@workspace/ui/custom/app-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

interface DashboardModulesProps {
  className?: string;
}

const DashboardModules: FC<DashboardModulesProps> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  // Determine active module based on pathname
  const activeModule = MODULE_LIST.find((module) =>
    pathname.startsWith(`/${module.id}`)
  );

  const handleModuleChange = (moduleId: string) => {
    router.push(`/${moduleId}`);
  };

  if (isMobile) {
    return (
      <Select value={activeModule?.id} onValueChange={handleModuleChange}>
        <SelectTrigger className={cn("w-[140px]", className)}>
          <SelectValue placeholder="Select Module" />
        </SelectTrigger>
        <SelectContent>
          {MODULE_LIST.map((module) => (
            <SelectItem key={module.id} value={module.id}>
              {module.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {MODULE_LIST.map((module) => {
        const isActive = pathname.startsWith(`/${module.id}`);
        return (
          <AppButton
            key={module.id}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleModuleChange(module.id)}
            className={cn(
              "text-sm font-medium transition-colors",
              isActive && "bg-secondary text-secondary-foreground"
            )}
          >
            {module.label}
          </AppButton>
        );
      })}
    </div>
  );
};

export default DashboardModules;
