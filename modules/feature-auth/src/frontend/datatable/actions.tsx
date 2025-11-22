"use client";

import { FC, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
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
import { Button } from "@workspace/ui/components/button";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ShieldX,
  ShieldCheck,
} from "lucide-react";
import { User } from "@workspace/db";
import { admin } from "../client";
import { toast } from "sonner";

interface UsersTableActionsProps {
  user: User;
}

export const UsersTableActions: FC<UsersTableActionsProps> = ({ user }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleView = () => {
    console.log("User profile", user);
  };

  const handleEdit = () => {
    toast.info("Edit user via the form below");
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      const res = await (admin as any).deleteUser({ userId: user.id });
      if (res?.error) throw res.error;
      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error?.message || "Failed to delete user");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleBan = async (ban: boolean) => {
    try {
      setIsProcessing(true);
      const res = await (admin as any).updateUser({
        userId: user.id,
        banned: ban,
      });
      if (res?.error) throw res.error;
      toast.success(ban ? "User banned" : "User unbanned");
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error?.message || "Failed to update user");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {((user as any).banned as boolean) ? (
            <DropdownMenuItem onClick={() => toggleBan(false)}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Unban
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => toggleBan(true)}>
              <ShieldX className="mr-2 h-4 w-4" />
              Ban
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{user.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isProcessing}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
