import { FC, useState } from "react";
import { useRouter } from "next/navigation";
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
import AppButton from "@/components/app-ui/button";

import { useDeleteBlogPost } from "@workspace/orpc-client/hooks/use-blogs";
import { toast } from "sonner";
import { BlogPostOutputType } from "@workspace/orpc-contracts/index";
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react";

interface BlogTableActionsProps {
  // Add your props here
  blogPost: BlogPostOutputType;
}

const BlogTableActions: FC<BlogTableActionsProps> = ({ blogPost }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const deleteBlogPostMutation = useDeleteBlogPost();

  const handleDelete = async () => {
    try {
      await deleteBlogPostMutation.mutateAsync({
        params: { id: blogPost.id },
      });
      toast.success("Blog deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      toast.error(error?.message || "Failed to delete blog. Please try again.");
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = () => {
    router.push(`/blogs/${blogPost.id}?mode=edit`);
  };

  const handleView = () => {
    router.push(`/blogs/${blogPost.id}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AppButton
            variant="ghost"
            className="h-8 w-8 p-0 ml-auto"
            icon={MoreHorizontal}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleView}
            className="flex items-center cursor-pointer group "
            disabled={deleteBlogPostMutation.isPending}
          >
            <Eye className="h-4 w-4 " />
            <span className="pt-0.5 ">View</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleEdit}
            className="flex items-center cursor-pointer group "
            disabled={deleteBlogPostMutation.isPending}
          >
            <Edit className="h-4 w-4 " />
            <span className="pt-0.5 ">Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="flex items-center cursor-pointer group hover:bg-destructive/15!"
            disabled={deleteBlogPostMutation.isPending}
          >
            <Trash2 className="h-4 w-4 group-hover:text-destructive" />
            <span className="pt-0.5 group-hover:text-destructive">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the blog post "{blogPost.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AppButton
              variant="destructive"
              onClick={handleDelete}
              loading={deleteBlogPostMutation.isPending}
              loadingText="Deleting..."
            >
              Delete Blog Post
            </AppButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlogTableActions;
