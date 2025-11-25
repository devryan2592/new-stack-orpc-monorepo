"use client";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { GalleryView } from "@/components/gallery/gallery-view";

export default function GalleryPage() {
  return (
    <DashboardLayout>
      <DashboardLayout.Body>
        <DashboardPageHeader
          title="Media Gallery"
          description="Manage your images and videos."
        />
        <div className="h-[calc(100vh-200px)] border rounded-lg overflow-hidden bg-background">
          <GalleryView />
        </div>
      </DashboardLayout.Body>
    </DashboardLayout>
  );
}
