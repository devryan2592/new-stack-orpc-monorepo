"use client";

import { ColumnDef } from "@workspace/ui/components/data-table/index";
import { ArrowUpDown } from "lucide-react";
import { User } from "@workspace/db";
import { UsersTableActions } from "./actions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export const columns: ColumnDef<User>[] = [
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => {
      const image = (row.original as any).image as string | null;
      const alt = row.original.name || row.original.email;
      return (
        <div className="flex items-center justify-center">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
            {image ? (
              <Image
                src={image}
                alt={alt || "Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">
                NA
              </div>
            )}
          </div>
        </div>
      );
    },
    size: 60,
    minSize: 60,
    maxSize: 60,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-medium"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Link
          href={`/users/${user.id}`}
          className="flex flex-col gap-1 hover:text-primary transition-colors"
        >
          <div className="flex flex-wrap font-medium line-clamp-1">
            {user.name}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {user.email}
          </div>
        </Link>
      );
    },
    size: 250,
    minSize: 200,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = (row.original as any).role as string | null;
      return (
        <span className="text-sm text-muted-foreground">{role || "user"}</span>
      );
    },
    size: 120,
    minSize: 100,
  },
  {
    accessorKey: "banned",
    header: "Banned",
    cell: ({ row }) => {
      const banned = (row.original as any).banned as boolean | null;
      return (
        <span className="text-sm text-muted-foreground">
          {banned ? "Yes" : "No"}
        </span>
      );
    },
    size: 90,
    minSize: 80,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <span className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleString()}
        </span>
      );
    },
    size: 180,
    minSize: 160,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <UsersTableActions user={row.original} />,
    size: 60,
    minSize: 50,
  },
];
