"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { GalleryView } from "./gallery-view";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";

interface GalleryDialogProps {
  trigger?: React.ReactNode;
  onSelect: (items: any[]) => void;
  maxSelection?: number;
  allowedTypes?: ("IMAGE" | "VIDEO")[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GalleryDialog({
  trigger,
  onSelect,
  maxSelection = 1,
  allowedTypes,
  open,
  onOpenChange,
}: GalleryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const handleSelect = (items: any[]) => {
    onSelect(items);
    // Optional: close on selection if maxSelection is 1?
    // setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Media Gallery</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <GalleryView
            onSelect={handleSelect}
            selectionMode={true}
            maxSelection={maxSelection}
            allowedTypes={allowedTypes}
          />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
