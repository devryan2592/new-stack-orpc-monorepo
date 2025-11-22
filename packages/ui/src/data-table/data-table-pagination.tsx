"use client";

import { Table } from "@tanstack/react-table";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@workspace/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { FC } from "react";

/**
 * Props interface for the DataTablePagination component
 * @template TData - The type of data being displayed in the table
 */
interface DataTablePaginationProps<TData> {
  /** The table instance from @tanstack/react-table */
  table: Table<TData>;
  /** Total number of pages (for server-side pagination) */
  pageCount?: number;
  /** Custom styling classes */
  className?: string;
  /** Whether to show the rows per page selector */
  showRowsPerPage?: boolean;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Whether to show page info */
  showPageInfo?: boolean;
}

/**
 * DataTablePagination component that provides pagination controls for the data table
 * Follows gallery component patterns for consistency and accessibility
 * @template TData - The type of data being displayed
 */
function DataTablePagination<TData>({
  table,
  className,
  showRowsPerPage = true,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageInfo = true,
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  // Generate a responsive list of page numbers with ellipses
  const getPageNumbers = (
    total: number,
    current: number,
    maxLength = 7
  ): (number | string)[] => {
    if (total <= 1) return [1];
    if (total <= maxLength)
      return Array.from({ length: total }, (_, i) => i + 1);

    const half = Math.floor(maxLength / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, current + half);

    // Adjust to always show maxLength numbers when possible
    if (current <= half) {
      start = 1;
      end = maxLength - 1;
    } else if (current > total - half) {
      start = total - (maxLength - 2);
      end = total;
    }

    const pages: (number | string)[] = [];
    pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) pages.push(i);
    }
    if (end < total - 1) pages.push("...");
    if (total > 1) pages.push(total);
    return pages;
  };

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between px-4 py-3 border-t border-border bg-background",
        className
      )}
    >
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between w-full">
        {/* Page Information */}
        {showPageInfo && (
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <span className="whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-center">
          {/* Rows per page selector */}
          {showRowsPerPage && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Rows per page
              </span>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Pagination Controls */}
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => table.firstPage()}
                  disabled={!canPreviousPage}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </PaginationItem>

              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => table.previousPage()}
                  disabled={!canPreviousPage}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </PaginationItem>

              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => table.nextPage()}
                  disabled={!canNextPage}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </PaginationItem>

              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() =>
                    table.setPageIndex(Math.max(totalPages - 1, 0))
                  }
                  disabled={!canNextPage}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default DataTablePagination;
