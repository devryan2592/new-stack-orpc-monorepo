"use client";

import { useUsers, useDeleteUser } from "@workspace/orpc-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { UserForm } from "@/forms/user-form";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { isAdmin } from "@/lib/auth-utils";
import { useRouter } from "next/navigation";
import { DASHBOARD_LINKS } from "@/lib/links";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading: isUsersLoading } = useUsers({ page, limit: 10 });
  const deleteUser = useDeleteUser();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAdmin(user)) {
      router.push(DASHBOARD_LINKS.HOME);
    }
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || isUsersLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin(user)) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Create User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <UserForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.roles?.map((r) => r.name).join(", ") || "No roles"}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this user?")
                      ) {
                        deleteUser.mutate({ params: { id: user.id } });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data?.users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
