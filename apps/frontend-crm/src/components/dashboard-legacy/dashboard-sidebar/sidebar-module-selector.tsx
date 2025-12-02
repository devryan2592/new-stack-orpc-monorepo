import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FC, useId } from "react";

interface SidebarModuleSelectorProps {
  // Add your props here
  children?: React.ReactNode;
}

const SidebarModuleSelector: FC<SidebarModuleSelectorProps> = ({
  children,
}) => {
  const id = useId();
  return (
    <div className="p-2 ">
      <div className="w-full max-w-xs space-y-2">
        <Select defaultValue="1">
          <SelectTrigger id={id} className="w-full">
            <p className="flex gap-1.5 items-center">
              <span className="text-xs text-muted-foreground font-medium">
                Favorite Movie:
              </span>
              <SelectValue placeholder="Select a movie" />
            </p>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Inception</SelectItem>
            <SelectItem value="2">Interstellar</SelectItem>
            <SelectItem value="3">The Dark Knight</SelectItem>
            <SelectItem value="4">Pulp Fiction</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SidebarModuleSelector;
