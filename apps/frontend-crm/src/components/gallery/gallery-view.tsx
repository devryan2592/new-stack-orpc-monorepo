"use client";

import { useState, useRef } from "react";
import {
  useGallery,
  useUpdateFolder,
  useDeleteFolder,
  useGenerateUploadSignature,
  useCreateFile,
  useDeleteFile,
} from "@workspace/orpc-client";
import { FolderItem } from "./folder-item";
import { FileItem } from "./file-item";
import { CreateFolderDialog } from "./create-folder-dialog";
import { AppButton } from "@workspace/ui/custom/app-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  ChevronRight,
  Home,
  Loader2,
  Upload,
  Plus,
  MoreHorizontal,
  CornerUpLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import type { GalleryItemOutputType } from "@workspace/orpc-contract";

interface GalleryViewProps {
  onSelect?: (items: GalleryItemOutputType[]) => void;
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
  const [selectedItems, setSelectedItems] = useState<GalleryItemOutputType[]>(
    []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "folder" | "file";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track the "active" item for selection UI (borders) even if not in selectionMode
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const { data: galleryData, isLoading } = useGallery({
    folderId: currentFolderId,
  });
  const updateFolder = useUpdateFolder();
  const deleteFolder = useDeleteFolder();
  const generateSignature = useGenerateUploadSignature();
  const createFile = useCreateFile();
  const deleteFile = useDeleteFile();

  const handleNavigate = (folderId: string | undefined, folderName: string) => {
    setCurrentFolderId(folderId);
    setActiveItemId(null); // Clear active item on navigation
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
  };

  const handleNavigateUp = () => {
    if (folderHistory.length > 1) {
      const parent = folderHistory[folderHistory.length - 2];
      if (parent) {
        handleNavigate(parent.id, parent.name);
      }
    }
  };

  const handleDeleteFolder = (id: string) => {
    setItemToDelete({ id, type: "folder" });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "folder") {
        await deleteFolder.mutateAsync({ params: { id: itemToDelete.id } });
        toast.success("Folder deleted successfully");
      } else {
        await deleteFile.mutateAsync({ params: { id: itemToDelete.id } });
        toast.success("File deleted successfully");
      }
      if (activeItemId === itemToDelete.id) setActiveItemId(null);
    } catch (error) {
      toast.error(`Failed to delete ${itemToDelete.type}`);
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleRenameFolder = async (id: string, newName: string) => {
    try {
      await updateFolder.mutateAsync({
        params: { id },
        body: { name: newName },
      });
      toast.success("Folder renamed successfully");
    } catch (error) {
      toast.error("Failed to rename folder");
      console.error(error);
    }
  };

  const handleDeleteFile = (id: string) => {
    setItemToDelete({ id, type: "file" });
    setDeleteDialogOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      let successCount = 0;

      for (const file of fileArray) {
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
        successCount++;
      }

      if (successCount > 0) {
        toast.success(
          `Successfully uploaded ${successCount} file${successCount > 1 ? "s" : ""}`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleSelection = (item: GalleryItemOutputType) => {
    // Always set active item for UI purposes
    setActiveItemId(item.id);

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

  // Breadcrumb Logic
  const renderBreadcrumbs = () => {
    if (folderHistory.length <= 3) {
      return folderHistory.map((folder, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
          )}
          <AppButton
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 ",
              index === folderHistory.length - 1 && "font-bold"
            )}
            onClick={() => handleNavigate(folder.id, folder.name)}
            icon={index === 0 ? Home : undefined}
          >
            <span className="text-xs">{folder.name}</span>
          </AppButton>
        </div>
      ));
    }

    // > 3 items: Home > ... > Last
    const home = folderHistory[0];
    const current = folderHistory[folderHistory.length - 1];
    const middleFolders = folderHistory.slice(1, folderHistory.length - 1);

    if (!home || !current) {
      return null;
    }

    return (
      <>
        <div className="flex items-center">
          <AppButton
            variant="ghost"
            size="sm"
            className="h-8 px-2 "
            onClick={() => handleNavigate(home.id, home.name)}
            icon={Home}
            iconOnly={middleFolders.length >= 2}
          >
            {middleFolders.length < 2 && (
              <span className="text-xs">{home.name}</span>
            )}
          </AppButton>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground " />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <AppButton
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              icon={MoreHorizontal}
              iconOnly
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {middleFolders.map((folder) => (
              <DropdownMenuItem
                key={folder.id}
                onClick={() => handleNavigate(folder.id, folder.name)}
              >
                {folder.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ChevronRight className="h-4 w-4 text-muted-foreground " />
        <AppButton
          variant="ghost"
          size="sm"
          className="h-8 px-2 font-bold"
          onClick={() => handleNavigate(current.id, current.name)}
        >
          <span className="text-xs">{current.name}</span>
        </AppButton>
      </>
    );
  };

  return (
    <div className="flex h-full flex-col  gap-4">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-card">
        <div className="flex items-center gap-2 overflow-x-auto">
          {renderBreadcrumbs()}
        </div>
        <div className="flex items-center gap-2">
          <CreateFolderDialog currentFolderId={currentFolderId}>
            <AppButton variant="outline" size="sm" icon={Plus}>
              New Folder
            </AppButton>
          </CreateFolderDialog>
          <div className="relative">
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*,video/*"
            />
            <AppButton
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              loading={isUploading}
              icon={Upload}
            >
              Upload
            </AppButton>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8  gap-4">
            {/* Back Button Item */}
            {currentFolderId && (
              <div className="flex flex-col gap-2 group">
                <div
                  className="relative aspect-square flex items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground shadow-sm transition-all cursor-pointer hover:bg-accent/50"
                  onClick={handleNavigateUp}
                >
                  <CornerUpLeft className="h-8 w-8" />
                </div>
                <div className="px-1">
                  <p className="text-sm font-medium truncate text-center select-none text-muted-foreground">
                    ...
                  </p>
                </div>
              </div>
            )}

            {folders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                onSelect={() => toggleSelection(folder)}
                onNavigate={() => handleNavigate(folder.id, folder.name)}
                onDelete={() => handleDeleteFolder(folder.id)}
                onRename={(newName) => handleRenameFolder(folder.id, newName)}
                isSelected={
                  activeItemId === folder.id ||
                  selectedItems.some((i) => i.id === folder.id)
                }
              />
            ))}
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onSelect={() => toggleSelection(file)}
                onDelete={() => handleDeleteFile(file.id)}
                isSelected={
                  activeItemId === file.id ||
                  selectedItems.some((i) => i.id === file.id)
                }
                selectionMode={selectionMode}
              />
            ))}
            {folders.length === 0 && files.length === 0 && !currentFolderId && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>This folder is empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {itemToDelete?.type === "folder"
                ? "folder and all its contents"
                : "file"}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
