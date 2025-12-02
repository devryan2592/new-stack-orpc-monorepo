"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import { GalleryView } from "@/components/gallery/gallery-view";

export default function GalleryPage() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <DashboardPageHeader
        title="Media Gallery"
        description="Manage your images and videos."
      />
      <div className="flex-1 border rounded-lg overflow-hidden bg-background">
        <GalleryView />
      </div>
    </div>
  );
}
