"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  RowSelectionState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table";
import { Loader2 } from "lucide-react";

import DataTableHeader from "./data-table-header";
import DataTablePagination from "./data-table-pagination";
import { FC, useEffect, useState, useMemo } from "react";

/**
 * Props interface for the DataTable component
 * @template TData - The type of data being displayed in the table
 * @template TValue - The type of values in the table cells
 */
export interface DataTableProps<TData, TValue> {
  /** Array of data to display in the table */
  data?: TData[];
  /** Column definitions for the table */
  columns: ColumnDef<TData, TValue>[];
  /** Whether the table is in a loading state */
  isLoading?: boolean;
  /** Error state for the table */
  error?: Error | null;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Custom loading message */
  loadingMessage?: string;
  /** Whether to show pagination */
  showPagination?: boolean;
  /** Custom pagination configuration */
  paginationConfig?: {
    pageCount?: number;
    manualPagination?: boolean;
    onPageChange?: (pageIndex: number, pageSize: number) => void;
    pageSize?: number;
    pageIndex?: number;
  };
}

/**
 * DataTable component that provides a flexible, reusable table with sorting, filtering, and pagination
 * Follows the same patterns as gallery components for consistency
 * @template TData - The type of data being displayed
 * @template TValue - The type of values in table cells
 */
const DataTable = <TData, TValue>({
  columns,
  data,
  isLoading = false,
  error = null,
  emptyMessage = "No results found.",
  loadingMessage = "Loading data...",
  showPagination = true,
}: DataTableProps<TData, TValue>) => {
  const [tableData, setTableData] = useState<TData[]>(data || []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Update table data when props change
  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  // Memoize table configuration for performance
  const tableConfig = useMemo(
    () => ({
      data: tableData,
      columns,
      onColumnVisibilityChange: setColumnVisibility,
      onColumnFiltersChange: setColumnFilters,
      onSortingChange: setSorting,
      onRowSelectionChange: setRowSelection,

      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    }),
    [tableData, columns, sorting, columnFilters, columnVisibility, rowSelection]
  );

  const table = useReactTable(tableConfig);

  // Early return for error state
  if (error) {
    return (
      <div className="bg-background border border-border rounded-lg">
        <div className="p-8 text-center">
          <div className="text-destructive mb-2">
            <span className="text-sm font-medium">Error loading data</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden">
      <TableComponent className="table-fixed">
        <DataTableHeader table={table} />
        <TableBody>
          {isLoading ? (
            // Enhanced loading state following gallery patterns
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {loadingMessage}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            // Render data rows with improved accessibility
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Enhanced empty state following gallery patterns
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-sm text-muted-foreground">
                    {emptyMessage}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
      {showPagination && <DataTablePagination table={table} />}
    </div>
  );
};

export default DataTable;
