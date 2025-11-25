import { FileImage, FileVideo, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

interface FileItemProps {
  file: {
    id: string;
    name: string;
    url: string;
    type: string;
  };
  onSelect: () => void;
  onDelete: () => void;
  isSelected?: boolean;
  selectionMode?: boolean;
}

export function FileItem({
  file,
  onSelect,
  onDelete,
  isSelected,
  selectionMode,
}: FileItemProps) {
  const isImage = file.type === "IMAGE";

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer",
        isSelected && "border-primary ring-2 ring-primary ring-offset-2"
      )}
      onClick={onSelect}
    >
      <div className="aspect-square relative bg-muted flex items-center justify-center">
        {isImage ? (
          <Image
            src={file.url}
            alt={file.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <FileVideo className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <div className="p-2">
        <p className="text-sm font-medium truncate">{file.name}</p>
      </div>

      {!selectionMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6 bg-background/80 backdrop-blur-sm"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
      )}
    </div>
  );
}
