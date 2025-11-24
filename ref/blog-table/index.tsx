"use client";

import { FC, useCallback, useMemo, useState } from "react";
import AppButton from "@/components/app-ui/button";
import { SearchInput } from "@/components/app-ui/search-input";
import useDebounce from "@workspace/orpc-client/hooks/use-debounce";
import { Card } from "@workspace/ui/components/card";
import { DataTable } from "@workspace/ui/components/data-table";
import { Filter } from "lucide-react";
import { useBlogPosts } from "@workspace/orpc-client/hooks/use-blogs";
import { columns } from "./columns";

interface BlogTableProps {
  // Add your props here
  children?: React.ReactNode;
}

const BlogTable: FC<BlogTableProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: blogData,
    isLoading,
    error,
  } = useBlogPosts({
    search: debouncedSearchQuery,
  });

  const blogs = useMemo(() => {
    return blogData?.data?.blogPosts || [];
  }, [blogData]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <div className="space-y-4">
      <Card className="flex flex-row gap-4 p-2">
        <div className="flex-1">
          <SearchInput />
        </div>

        <div className="flex flex-row gap-2">
          <AppButton
            icon={Filter}
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          />
        </div>
      </Card>

      {showFilters && (
        <Card className="p-2">
          <div></div>
        </Card>
      )}
      <Card className="p-2">
        <DataTable
          columns={columns}
          data={blogs}
          isLoading={isLoading}
          error={error}
          emptyMessage="No blogs found."
          loadingMessage="Loading blogs..."
          showPagination={true}
        />
      </Card>
    </div>
  );
};

export default BlogTable;
