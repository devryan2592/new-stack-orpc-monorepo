"use client";

import { useState, useRef } from "react";
import {
  useGallery,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useGenerateUploadSignature,
  useCreateFile,
  useDeleteFile,
} from "@workspace/orpc-client";
import { FolderItem } from "./folder-item";
import { FileItem } from "./file-item";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { ChevronRight, Home, Loader2, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";

interface GalleryViewProps {
  onSelect?: (items: any[]) => void;
  selectionMode?: boolean;
  maxSelection?: number;
  allowedTypes?: ("IMAGE" | "VIDEO")[];
}

export function GalleryView({
  onSelect,
  selectionMode = false,
  maxSelection = 1,
  allowedTypes,
}: GalleryViewProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(
    undefined
  );
  const [folderHistory, setFolderHistory] = useState<
    { id: string | undefined; name: string }[]
  >([{ id: undefined, name: "Home" }]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: galleryData, isLoading } = useGallery({
    folderId: currentFolderId,
  });
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();
  const deleteFolder = useDeleteFolder();
  const generateSignature = useGenerateUploadSignature();
  const createFile = useCreateFile();
  const deleteFile = useDeleteFile();

  const handleNavigate = (folderId: string | undefined, folderName: string) => {
    setCurrentFolderId(folderId);
    if (folderId === undefined) {
      setFolderHistory([{ id: undefined, name: "Home" }]);
    } else {
      // Check if we are going back
      const index = folderHistory.findIndex((f) => f.id === folderId);
      if (index !== -1) {
        setFolderHistory(folderHistory.slice(0, index + 1));
      } else {
        setFolderHistory([
          ...folderHistory,
          { id: folderId, name: folderName },
        ]);
      }
    }
    // Clear selection when changing folders if not in selection mode?
    // Maybe keep it.
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder.mutateAsync({
        body: { name: newFolderName, parentId: currentFolderId },
      });
      setIsCreateFolderOpen(false);
      setNewFolderName("");
    } catch (error) {
      // handled by hook
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (confirm("Are you sure you want to delete this folder?")) {
      await deleteFolder.mutateAsync({ id });
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      await deleteFile.mutateAsync({ id });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const type = file.type.startsWith("image/") ? "IMAGE" : "VIDEO";
        if (allowedTypes && !allowedTypes.includes(type)) {
          toast.error(`File type ${type} not allowed`);
          continue;
        }

        // 1. Get signature
        const { data: signatureData } = await generateSignature.mutateAsync({
          body: { folderId: currentFolderId, type },
        });

        if (!signatureData) throw new Error("Failed to generate signature");

        // 2. Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signatureData.apiKey);
        formData.append("timestamp", signatureData.timestamp.toString());
        formData.append("signature", signatureData.signature);
        if (signatureData.folder) {
          formData.append("folder", signatureData.folder);
        }

        const resourceType = type === "VIDEO" ? "video" : "image";
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();

        // 3. Save metadata
        await createFile.mutateAsync({
          body: {
            name: file.name,
            url: result.secure_url,
            type,
            size: result.bytes,
            publicId: result.public_id,
            folderId: currentFolderId,
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleSelection = (item: any) => {
    if (!selectionMode) return;

    const isSelected = selectedItems.some((i) => i.id === item.id);
    let newSelection;
    if (isSelected) {
      newSelection = selectedItems.filter((i) => i.id !== item.id);
    } else {
      if (maxSelection === 1) {
        newSelection = [item];
      } else {
        if (selectedItems.length >= maxSelection) return;
        newSelection = [...selectedItems, item];
      }
    }
    setSelectedItems(newSelection);
    onSelect?.(newSelection);
  };

  const folders =
    galleryData?.data?.filter((i) => i.itemType === "FOLDER") || [];
  const files = galleryData?.data?.filter((i) => i.itemType === "FILE") || [];

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2 overflow-x-auto">
          {folderHistory.map((folder, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
              )}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2",
                  index === folderHistory.length - 1 && "font-bold"
                )}
                onClick={() => handleNavigate(folder.id, folder.name)}
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {folder.name}
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateFolderOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <div className="relative">
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*,video/*"
            />
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                onSelect={() => handleNavigate(folder.id, folder.name)}
                onDelete={() => handleDeleteFolder(folder.id)}
                onRename={() => {
                  // TODO: Implement rename dialog
                  const newName = prompt("Enter new name", folder.name);
                  if (newName && newName !== folder.name) {
                    updateFolder.mutate({
                      params: { id: folder.id },
                      body: { name: newName },
                    });
                  }
                }}
              />
            ))}
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onSelect={() => toggleSelection(file)}
                onDelete={() => handleDeleteFile(file.id)}
                isSelected={selectedItems.some((i) => i.id === file.id)}
                selectionMode={selectionMode}
              />
            ))}
            {folders.length === 0 && files.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>This folder is empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="My Folder"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateFolderOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
