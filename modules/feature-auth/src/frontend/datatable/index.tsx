"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@workspace/ui/components/card";
import DataTable from "@workspace/ui/components/data-table/data-table";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { Filter, Search, RotateCcw } from "lucide-react";
import { admin } from "../client";
import { columns } from "./columns";
import { UsersTableActions } from "./actions";
import { User } from "@workspace/db";
import { SearchInput } from "@workspace/ui/custom/search-input";

interface UsersDataTableProps {}

type SortDirection = "asc" | "desc";

export const UsersDataTable: FC<UsersDataTableProps> = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<"email" | "name">("email");
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("any");
  const [bannedFilter, setBannedFilter] = useState<string>("");
  const [limit, setLimit] = useState<number>(100);
  const [offset, setOffset] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await admin.listUsers({
        query: {
          searchValue: searchQuery || undefined,
          searchField,
          searchOperator: "contains",
          limit,
          offset,
          sortBy,
          sortDirection,
          filterField: roleFilter
            ? "role"
            : bannedFilter
              ? "banned"
              : undefined,
          filterValue: roleFilter
            ? roleFilter
            : bannedFilter
              ? bannedFilter === "true"
              : undefined,
          filterOperator: "eq",
        },
      });

      console.log(data, error);
      if (error) {
        setError(error);
        setUsers([]);
      } else {
        setUsers((data as any) || []);
      }
    } catch (e) {
      setError(e);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    searchField,
    limit,
    offset,
    sortBy,
    sortDirection,
    roleFilter,
    bannedFilter,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  const tableData = useMemo(() => users, [users]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSearchField("email");
    setRoleFilter("");
    setBannedFilter("");
    setLimit(100);
    setOffset(0);
    setSortBy("createdAt");
    setSortDirection("desc");
  };

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-2 p-2 md:flex-row md:items-center md:gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center gap-2 w-full">
            <SearchInput className="w-80" />
          </div>
          <Select
            value={searchField}
            onValueChange={(v) => setSearchField(v as any)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-2">
        <DataTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          error={error}
          emptyMessage="No users found."
          loadingMessage="Loading users..."
          showPagination={true}
        />
      </Card>
    </div>
  );
};

export default UsersDataTable;
