import { Folder, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import type { GalleryFolderOutputType } from "@workspace/orpc-contract/outputs/gallery";

interface FolderItemProps {
  folder: GalleryFolderOutputType;
  onSelect: () => void;
  onDelete: () => void;
  onRename: () => void;
  isSelected?: boolean;
}

export function FolderItem({
  folder,
  onSelect,
  onDelete,
  onRename,
  isSelected,
}: FolderItemProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-accent/50 cursor-pointer transition-colors",
        isSelected && "border-primary bg-accent"
      )}
      onClick={onSelect}
    >
      <Folder className="h-12 w-12 text-blue-500 fill-blue-500/20" />
      <span className="text-sm font-medium truncate w-full text-center">
        {folder.name}
      </span>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRename();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
