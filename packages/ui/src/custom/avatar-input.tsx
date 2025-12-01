"use client";

import { CircleUserRoundIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@workspace/ui/hooks/use-file-upload";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface AvatarInputProps {
  value?: string | null;
  onChange?: (file: File | null) => void;
  className?: string;
}

export default function AvatarInput({
  value,
  onChange,
  className,
}: AvatarInputProps) {
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: "image/*",
    onFilesChange: (files) => {
      if (onChange) {
        const file = files[0]?.file;
        if (!file) return;
        if (file instanceof File) {
          onChange(file);
        }
      }
    },
  });

  const previewUrl = files[0]?.preview || value || null;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative inline-flex">
        {/* Drop area */}
        <button
          type="button"
          className="relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed border-input transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none data-[dragging=true]:bg-accent/50"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={previewUrl ? "Change image" : "Upload image"}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Avatar"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </button>
        {previewUrl && (
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (files.length > 0) {
                const fileId = files[0]?.id;
                if (fileId) removeFile(fileId);
              }
              if (onChange) onChange(null);
            }}
            size="icon"
            className="absolute -top-1 -right-1 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
