import { FileVideo, Trash2 } from "lucide-react";
import { AppButton } from "@workspace/ui/custom/app-button";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import type { GalleryFileOutputType } from "@workspace/orpc-contract";

interface FileItemProps {
  file: GalleryFileOutputType;
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
    <div className="flex flex-col gap-2 group">
      <div
        className={cn(
          "relative aspect-square flex items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all cursor-pointer hover:bg-accent/50",
          isSelected && "border-primary ring-2 ring-primary ring-offset-2"
        )}
        onClick={onSelect}
      >
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

        {/* Overlay Actions */}
        {(isSelected || !selectionMode) && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <AppButton
              variant="destructive"
              size="icon"
              className="h-8 w-8 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </AppButton>
          </div>
        )}
      </div>

      <div className="px-1">
        <p className="text-sm font-medium truncate text-center select-none">
          {file.name}
        </p>
      </div>
    </div>
  );
}
