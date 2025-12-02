"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FC, useId } from "react";
import { useNavStore } from "@/store/nav";
import { MODULES, ModuleId, MODULE_LIST } from "@/lib/modules";
import { useRouter } from "next/navigation";
import { CRM_LINKS, BACKOFFICE_LINKS, WEBSITE_LINKS } from "@/lib/links";

interface SidebarModuleSelectorProps {
  children?: React.ReactNode;
}

const SidebarModuleSelector: FC<SidebarModuleSelectorProps> = ({
  children,
}) => {
  const id = useId();
  const { activeModule, setActiveModule } = useNavStore();
  const router = useRouter();

  const handleModuleChange = (value: string) => {
    const moduleId = value as ModuleId;
    setActiveModule(moduleId);

    // Navigate to the module's home
    switch (moduleId) {
      case MODULES.CRM:
        router.push(CRM_LINKS.HOME);
        break;
      case MODULES.BACKOFFICE:
        router.push(BACKOFFICE_LINKS.HOME);
        break;
      case MODULES.WEBSITE:
        router.push(WEBSITE_LINKS.HOME);
        break;
    }
  };

  return (
    <div className="w-full max-w-xs space-y-2">
      <Select value={activeModule} onValueChange={handleModuleChange}>
        <SelectTrigger id={id} className="w-full">
          <p className="flex gap-1.5 items-center">
            <span className="text-xs text-muted-foreground font-medium">
              Module:
            </span>
            <SelectValue placeholder="Select a module" />
          </p>
        </SelectTrigger>
        <SelectContent>
          {MODULE_LIST.map((module) => (
            <SelectItem key={module.id} value={module.id}>
              {module.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SidebarModuleSelector;
