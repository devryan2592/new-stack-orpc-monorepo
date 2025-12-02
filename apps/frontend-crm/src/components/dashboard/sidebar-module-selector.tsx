import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FC, useId } from "react";

interface SidebarModuleSelectorProps {
  children?: React.ReactNode;
}

const SidebarModuleSelector: FC<SidebarModuleSelectorProps> = ({
  children,
}) => {
  const id = useId();
  return (
    <div className="w-full max-w-xs space-y-2">
      <Select defaultValue="1">
        <SelectTrigger id={id} className="w-full">
          <p className="flex gap-1.5 items-center">
            <span className="text-xs text-muted-foreground font-medium">
              Module:
            </span>
            <SelectValue placeholder="Select a module" />
          </p>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">CRM</SelectItem>
          <SelectItem value="2">Backoffice</SelectItem>
          <SelectItem value="3">Website</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SidebarModuleSelector;
