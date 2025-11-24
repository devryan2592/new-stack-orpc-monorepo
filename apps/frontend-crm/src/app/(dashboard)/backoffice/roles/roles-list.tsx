"use client";

import {
  useRoles,
  useDeleteRole,
} from "@workspace/orpc-client/hooks/use-roles";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { RoleForm } from "./role-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";

export function RolesList() {
  const { data: roles, isLoading } = useRoles();
  const deleteRole = useDeleteRole();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Add a new role and assign permissions.
              </DialogDescription>
            </DialogHeader>
            <RoleForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.label}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={editingRole?.id === role.id}
                      onOpenChange={(open) => !open && setEditingRole(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingRole(role)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Edit Role</DialogTitle>
                          <DialogDescription>
                            Update role details and permissions.
                          </DialogDescription>
                        </DialogHeader>
                        <RoleForm
                          role={role}
                          onSuccess={() => setEditingRole(null)}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the role and remove it from any assigned
                            users.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              deleteRole.mutate({ params: { id: role.id } })
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {roles?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center h-24 text-muted-foreground"
                >
                  No roles found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
