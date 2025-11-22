import { os } from "@/config/orpc";

import { blogRouter } from "@/procedures/blog";
import { galleryRouter } from "@/procedures/gallery";
import { seoRouter } from "@/procedures/seo";
import { attractionRouter } from "@/procedures/attractions";
import { destinationRouter } from "@/procedures/destination";
import { tourRouter } from "@/procedures/tour";
import { backupRouter } from "@/procedures/backup";
import { settingsRouter } from "@/procedures/settings";
import { customerRouter } from "@/procedures/customer";
import { leadRouter } from "@/procedures/lead";
import { customerDocumentRouter } from "@/procedures/customer-document";
import { enquiryRouter } from "@/procedures/enquiry";
import { itineraryRouter } from "@/procedures/itinerary";
import { libraryRouter } from "@/procedures/library";

export const router = os.router({
  blog: blogRouter,
  gallery: galleryRouter,
  seo: seoRouter,
  attraction: attractionRouter,
  destination: destinationRouter,
  tour: tourRouter,
  backup: backupRouter,
  settings: settingsRouter,
  customer: customerRouter,
  lead: leadRouter,
  customerDocument: customerDocumentRouter,
  enquiry: enquiryRouter,
  itinerary: itineraryRouter,
  library: libraryRouter,
});

export default router;

export type Router = typeof router;
