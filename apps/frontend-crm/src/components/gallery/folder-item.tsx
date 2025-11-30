import { Folder, Pencil, Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import type { GalleryFolderOutputType } from "@workspace/orpc-contract";
import { useState, useRef, useEffect } from "react";

interface FolderItemProps {
  folder: GalleryFolderOutputType;
  onSelect: () => void;
  onNavigate: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  isSelected?: boolean;
}

export function FolderItem({
  folder,
  onSelect,
  onNavigate,
  onDelete,
  onRename,
  isSelected,
}: FolderItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRenameSubmit = () => {
    if (editName.trim() && editName !== folder.name) {
      onRename(editName);
    } else {
      setEditName(folder.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit();
    } else if (e.key === "Escape") {
      setEditName(folder.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 group">
      <div
        className={cn(
          "relative aspect-square flex items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm transition-all cursor-pointer hover:bg-accent/50",
          isSelected && "border-primary ring-2 ring-primary ring-offset-2"
        )}
        onClick={onSelect}
        onDoubleClick={onNavigate}
      >
        <Folder className="h-1/3 w-1/3 text-blue-500 fill-blue-500/20" />

        {/* Overlay Actions */}
        {(isSelected || isEditing) && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background border border-border"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="px-1">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleKeyDown}
            className="h-8 text-sm text-center"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="text-sm font-medium truncate text-center select-none">
            {folder.name}
          </p>
        )}
      </div>
    </div>
  );
}
