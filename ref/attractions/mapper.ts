import type { Prisma } from "@workspace/db";
import { AttractionOutputType } from "@workspace/orpc-contracts";

// Use Prisma payload type to ensure the mapper input exactly matches what our queries return
// We need the joined image for both thumbnail and images, and FAQs array
export type AttractionWithRelations = Prisma.AttractionGetPayload<{
  include: {
    thumbnail: { include: { image: true } };
    images: { include: { image: true } };

    faqs: true;
    seo: true;
    // NEW nested options
    options: {
      include: {
        transfers: { include: { rates: true } };
      };
    };
  };
}>;

const mapAttractionToOutput = async (
  attraction: AttractionWithRelations
): Promise<AttractionOutputType> => {
  return {
    id: attraction.id,
    name: attraction.name,
    slug: attraction.slug,
    content: attraction.content,
    price: attraction.price,
    offerPrice: attraction.offerPrice,
    highlights: attraction.highlights,
    inclusions: attraction.inclusions,
    exclusions: attraction.exclusions,
    info: attraction.info,
    cancellationPolicy: attraction.cancellationPolicy,
    childPolicy: attraction.childPolicy,
    duration: attraction.duration,
    featured: attraction.featured,
    published: attraction.published,
    createdAt: attraction.createdAt,
    updatedAt: attraction.updatedAt,
    faqs: attraction.faqs,
    thumbnail: attraction.thumbnail
      ? {
          ...attraction.thumbnail.image,
          altText: attraction.thumbnail.customAlt ?? null,
          url: attraction.thumbnail.image.url,
        }
      : null,
    images: attraction.images.map((image) => ({
      ...image.image,
      altText: image.customAlt ?? null,
      url: image.image.url,
      position: image.position,
    })),
    // SEO
    seo: attraction.seo
      ? {
          ...attraction.seo,
        }
      : null,
    // NEW options mapping
    options: (attraction.options || []).map((opt) => ({
      id: opt.id,
      name: opt.name,
      slug: opt.slug,
      active: opt.active,
      position: opt.position ?? null,
      transfers: (opt.transfers || []).map((t) => ({
        id: t.id,
        type: t.type,
        label: t.label,
        active: t.active,
        rates: (t.rates || []).map((r) => ({
          id: r.id,
          ageBand: r.ageBand,
          price: r.price,
        })),
      })),
    })),
  };
};

export default mapAttractionToOutput;
