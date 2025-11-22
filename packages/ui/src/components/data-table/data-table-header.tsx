"use client";

import {
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";
import { flexRender, Table } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { FC } from "react";

/**
 * Props interface for the DataTableHeader component
 * @template TData - The type of data being displayed in the table
 */
interface DataTableHeaderProps<TData> {
  /** The table instance from @tanstack/react-table */
  table: Table<TData>;
  /** Optional custom styling classes */
  className?: string;
  /** Whether to show sorting indicators */
  showSortingIndicators?: boolean;
}

/**
 * DataTableHeader component that renders the table header with sorting functionality
 * Follows gallery component patterns for consistency and accessibility
 * @template TData - The type of data being displayed
 */
function DataTableHeader<TData>({
  table,
  className,
  showSortingIndicators = true,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader className={cn("bg-sidebar border-b", className)}>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const sortDirection = header.column.getIsSorted();

            return (
              <TableHead
                key={header.id}
                style={{ width: `${header.getSize()}px` }}
                className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                {header.isPlaceholder ? null : canSort ? (
                  <div
                    className={cn(
                      "flex h-full cursor-pointer items-center justify-between gap-2 select-none transition-colors",
                      "hover:text-foreground focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={(e) => {
                      // Enhanced keyboard accessibility
                      if (canSort && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        header.column.getToggleSortingHandler()?.(e);
                      }
                    }}
                    tabIndex={canSort ? 0 : undefined}
                    role="button"
                    aria-label={`Sort by ${header.column.id} ${sortDirection === "asc" ? "descending" : "ascending"}`}
                  >
                    <span className="truncate">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                    {showSortingIndicators && (
                      <div className="flex-shrink-0">
                        {sortDirection === "asc" ? (
                          <ChevronUpIcon
                            className="h-4 w-4 opacity-60"
                            aria-hidden="true"
                          />
                        ) : sortDirection === "desc" ? (
                          <ChevronDownIcon
                            className="h-4 w-4 opacity-60"
                            aria-hidden="true"
                          />
                        ) : (
                          <div className="h-4 w-4" aria-hidden="true" />
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="truncate">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </span>
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}

export default DataTableHeader;
