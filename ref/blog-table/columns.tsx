"use client";

import { ColumnDef } from "@workspace/ui/components/data-table";

import {
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import { BlogPostOutputType } from "@workspace/orpc-contracts/outputs";

import CategoryTableActions from "./actions";
import Image from "next/image";
import Link from "next/link";
import AppButton from "@/components/app-ui/button";
import { FeaturedBadge, PublishedBadge } from "@/components/app-ui";
import { Badge } from "@workspace/ui/components/badge";
import { format } from "date-fns";
import BlogTableActions from "./actions";

/**
 * Column definitions for the categories data table
 * Follows the same patterns as other table components for consistency
 */
export const columns: ColumnDef<BlogPostOutputType>[] = [
  {
    id: "thumbnail",
    header: "",
    cell: ({ row }) => {
      const thumbUrl = row.original.thumbnail?.url || null;
      const alt = row.original.thumbnail?.altText || row.original.title;
      return (
        <div className="flex items-center justify-center">
          <div className="relative h-12 w-20 overflow-hidden rounded-md bg-muted ">
            {thumbUrl ? (
              <Image
                src={thumbUrl}
                alt={alt || "Thumbnail"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">
                No image
              </div>
            )}
          </div>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <AppButton
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-medium"
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </AppButton>
    ),
    cell: ({ row }) => {
      const blogPost = row.original;
      return (
        <Link 
          href={`/blogs/${blogPost.id}`}
          className="flex flex-col gap-1 hover:text-primary transition-colors"
        >
          <div className="flex flex-wrap font-medium line-clamp-1">
            {blogPost.title}
          </div>
          {blogPost.slug && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              /{blogPost.slug}
            </div>
          )}
        </Link>
      );
    },
    size: 250,
    minSize: 250,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      return category ? (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-indigo-500/10 text-indigo-500 w-fit"
        >
          {category.name}
        </Badge>
      ) : (
        <span className="text-muted-foreground">No category</span>
      );
    },
    minSize: 120,
  },

  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      const featured = row.original.featured;
      return <FeaturedBadge featured={!!featured} />;
    },
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => {
      const published = row.original.published;
      return <PublishedBadge published={!!published} />;
    },
    size: 120,
    minSize: 120,
  },

  {
    accessorKey: "publishedAt",
    header: ({ column }) => (
      <AppButton
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-medium"
      >
        Published Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </AppButton>
    ),
    cell: ({ row }) => {
      const publishedAt = row.original.publishedAt;
      return publishedAt ? (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3" />
          {format(new Date(publishedAt), "MMM dd, yyyy")}
        </div>
      ) : (
        <span className="text-muted-foreground">Not published</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <AppButton
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-medium"
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </AppButton>
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return createdAt ? (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3" />
          {format(new Date(createdAt), "MMM dd, yyyy")}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <BlogTableActions blogPost={row.original} />,
    size: 50,
    minSize: 50,
  },
];
