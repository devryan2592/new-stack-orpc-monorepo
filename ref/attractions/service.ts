import { prisma } from "@workspace/db";
import {
  CreateAttractionInput,
  CreateAttractionOutput,
  UpdateAttractionInput,
  UpdateAttractionOutput,
  GetAttractionByIdInput,
  GetAttractionByIdOutput,
  GetAttractionBySlugInput,
  GetAttractionBySlugOutput,
  GetAllAttractionsInput,
  GetAllAttractionsOutput,
  DeleteAttractionInput,
  DeleteAttractionOutput,
  GetAttractionMetricsOutput,
} from "./types";
import { createUniqueSlug, generateSlug } from "@/utils/slug-generator";
import { ORPCError } from "@orpc/server";
import mapAttractionToOutput from "./mapper";

export const attractionServiceFactory = (db: typeof prisma) => {
  // -------------------- Utilities --------------------
  const slugExists = async (
    slug: string,
    excludeId?: string
  ): Promise<boolean> => {
    const existing = await db.attraction.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return !!existing;
  };

  // Ensure option slug uniqueness per attraction
  const optionSlugExists = async (
    slug: string,
    attractionId: string
  ): Promise<boolean> => {
    const existing = await db.attractionOption.findFirst({
      where: { attractionId, slug },
    });
    return !!existing;
  };

  async function replaceFaqs(
    attractionId: string,
    faqs: CreateAttractionInput["body"]["faqs"],
    tx?: Omit<
      typeof db,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ) {
    const dbInstance = tx || db;

    await dbInstance.fAQ.deleteMany({
      where: {
        attractionId,
      },
    });

    if (faqs?.length) {
      await dbInstance.fAQ.createMany({
        data: faqs.map((f) => ({
          ...f,
          attractionId,
        })),
      });
    }
  }

  async function replaceImages(
    attractionId: string,
    images: CreateAttractionInput["body"]["images"],
    tx?: Omit<
      typeof db,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ) {
    const dbInstance = tx || db;

    await dbInstance.attractionImage.deleteMany({
      where: {
        attractionId,
      },
    });

    if (images?.length) {
      await dbInstance.attractionImage.createMany({
        data: images.map((image, index) => ({
          attractionId,
          imageId: image.id,
          position: index,
          customAlt: image.altText,
        })),
      });
    }
  }

  async function replaceSeo(
    attractionId: string,
    seo: CreateAttractionInput["body"]["seo"],
    tx?: Omit<
      typeof db,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ) {
    const dbInstance = tx || db;

    await dbInstance.seo.deleteMany({
      where: {
        attractionId,
      },
    });

    if (seo) {
      // Validate JSON-LD defensively on the server side
      if (seo.jsonLd) {
        try {
          JSON.parse(seo.jsonLd);
        } catch {
          throw new ORPCError("BAD_REQUEST", {
            message: "Invalid JSON-LD format",
          });
        }
      }
      await dbInstance.seo.create({
        data: {
          ...seo,
          attractionId,
        },
      });
    }
  }

  // NEW: Replace Options tree (options -> transfers -> rates)
  async function replaceOptions(
    attractionId: string,
    options: CreateAttractionInput["body"]["options"],
    tx?: Omit<
      typeof db,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ) {
    const dbInstance = tx || db;

    try {
      // Delete in child-to-parent order via relations
      await dbInstance.optionRate.deleteMany({
        where: { transfer: { option: { attractionId } } },
      });
      await dbInstance.optionTransfer.deleteMany({
        where: { option: { attractionId } },
      });
      await dbInstance.attractionOption.deleteMany({
        where: { attractionId },
      });

      if (options?.length) {
        for (const opt of options) {
          // Ensure a valid, unique slug per attraction for each option
          const baseSlug = opt.slug?.trim() || generateSlug(opt.name);
          const ensuredSlug = await createUniqueSlug(baseSlug, (s) =>
            optionSlugExists(s, attractionId)
          );

          const createdOption = await dbInstance.attractionOption.create({
            data: {
              attractionId,
              name: opt.name,
              slug: ensuredSlug,
              active: opt.active ?? true,
              position: opt.position,
            },
          });

          for (const tr of opt.transfers || []) {
            const createdTransfer = await dbInstance.optionTransfer.create({
              data: {
                optionId: createdOption.id,
                type: tr.type,
                label: tr.label,
                active: tr.active ?? true,
              },
            });

            for (const rate of tr.rates || []) {
              await dbInstance.optionRate.create({
                data: {
                  optionTransferId: createdTransfer.id,
                  ageBand: rate.ageBand,
                  price: rate.price,
                },
              });
            }
          }
        }
      }
    } catch (err: any) {
      // Normalize Prisma and other errors to a helpful message
      const message =
        err?.message ||
        "Failed to update options. Ensure each option has a unique slug and valid transfers/rates.";
      throw new ORPCError("BAD_REQUEST", { message, cause: err });
    }
  }

  // -------------------- CRUD Operations --------------------

  async function create(
    input: CreateAttractionInput
  ): Promise<CreateAttractionOutput> {
    const {
      body: { thumbnail, images, faqs, seo, options, ...rest },
    } = input;
    try {
      const createdAttraction = await db.$transaction(async (tx) => {
        // Generate Slug
        const slug = await createUniqueSlug(rest.name, (s) => slugExists(s));

        // Create Attraction
        const created = await tx.attraction.create({
          data: {
            ...rest,
            slug,
          },
        });

        // Thumbnail
        if (thumbnail) {
          await tx.attractionThumbnail.create({
            data: {
              attractionId: created.id,
              imageId: thumbnail.id,
              customAlt: thumbnail.altText,
            },
          });
        }

        // Images
        if (images?.length) {
          await replaceImages(created.id, images, tx);
        }

        // FAQs
        if (faqs?.length) {
          await replaceFaqs(created.id, faqs, tx);
        }

        // SEO
        if (seo) {
          await replaceSeo(created.id, seo, tx);
        }

        // Options
        if (options) {
          await replaceOptions(created.id, options, tx);
        }

        return await tx.attraction.findUniqueOrThrow({
          where: { id: created.id },
          include: {
            thumbnail: { include: { image: true } },
            images: { include: { image: true }, orderBy: { position: "asc" } },
            faqs: true,
            seo: true,
            options: { include: { transfers: { include: { rates: true } } } },
          },
        });
      });

      return {
        success: true,
        data: await mapAttractionToOutput(createdAttraction),
      };
    } catch (err: any) {
      const message = err?.message || "Failed to create attraction";
      console.error("[createAttraction] Error:", message, err);
      throw new ORPCError("BAD_REQUEST", { message, cause: err });
    }
  }

  async function update(
    input: UpdateAttractionInput
  ): Promise<UpdateAttractionOutput> {
    const {
      params: { id },
      body: { thumbnail, images, faqs, seo, options, ...rest },
    } = input;
    try {
      const updatedAttraction = await db.$transaction(async (tx) => {
        // Slug
        if (rest.name) {
          const slug = await createUniqueSlug(rest.name, (s) =>
            slugExists(s, id)
          );
          rest.slug = slug;
        }
        // Update Attraction
        const updated = await tx.attraction.update({
          where: { id },
          data: {
            ...rest,
          },
        });

        // Thumbnail logic
        const existingThumbnail = await tx.attractionThumbnail.findUnique({
          where: { attractionId: updated.id },
        });

        if (thumbnail) {
          // Case 1: Thumbnail exists in input - create or update
          if (existingThumbnail) {
            // Update existing thumbnail
            await tx.attractionThumbnail.update({
              where: { attractionId: updated.id },
              data: {
                imageId: thumbnail.id,
                customAlt: thumbnail.altText || null,
              },
            });
          } else {
            // Create new thumbnail
            await tx.attractionThumbnail.create({
              data: {
                attractionId: updated.id,
                imageId: thumbnail.id,
                customAlt: thumbnail.altText || null,
              },
            });
          }
        } else if (existingThumbnail) {
          // Case 2: No thumbnail in input but exists in DB - delete it
          await tx.attractionThumbnail.delete({
            where: { attractionId: updated.id },
          });
        }
        // Case 3: No thumbnail in input and none in DB - do nothing

        // Images
        if (images?.length) {
          await replaceImages(updated.id, images, tx);
        }

        // FAQs
        if (faqs?.length) {
          await replaceFaqs(updated.id, faqs, tx);
        }

        // SEO
        if (seo !== undefined) {
          await replaceSeo(updated.id, seo, tx);
        }

        // Options
        if (options !== undefined) {
          await replaceOptions(updated.id, options || [], tx);
        }

        return await tx.attraction.findUniqueOrThrow({
          where: { id: updated.id },
          include: {
            thumbnail: { include: { image: true } },
            images: { include: { image: true }, orderBy: { position: "asc" } },
            faqs: true,
            seo: true,
            options: { include: { transfers: { include: { rates: true } } } },
          },
        });
      });

      return {
        success: true,
        data: await mapAttractionToOutput(updatedAttraction),
      };
    } catch (err: any) {
      const message = err?.message || "Failed to update attraction";
      console.error("[updateAttraction] Error:", message, err);
      throw new ORPCError("BAD_REQUEST", { message, cause: err });
    }
  }

  async function getBySlug(
    input: GetAttractionBySlugInput
  ): Promise<GetAttractionBySlugOutput> {
    const attraction = await db.attraction.findUnique({
      where: { slug: input.params.slug },
      include: {
        thumbnail: { include: { image: true } },
        images: { include: { image: true }, orderBy: { position: "asc" } },
        faqs: true,
        seo: true,
        options: { include: { transfers: { include: { rates: true } } } },
      },
    });

    if (!attraction)
      throw new ORPCError("NOT_FOUND", { message: "Attraction not found" });

    return { success: true, data: await mapAttractionToOutput(attraction) };
  }

  async function getById(
    input: GetAttractionByIdInput
  ): Promise<GetAttractionByIdOutput> {
    const attraction = await db.attraction.findUnique({
      where: { id: input.params.id },
      include: {
        thumbnail: { include: { image: true } },
        images: { include: { image: true }, orderBy: { position: "asc" } },
        faqs: true,
        seo: true,
        options: { include: { transfers: { include: { rates: true } } } },
      },
    });

    if (!attraction)
      throw new ORPCError("NOT_FOUND", { message: "Attraction not found" });

    return { success: true, data: await mapAttractionToOutput(attraction) };
  }

  async function deleteAttraction(
    input: DeleteAttractionInput
  ): Promise<DeleteAttractionOutput> {
    const existing = await db.attraction.findUnique({
      where: { id: input.params.id },
    });
    if (!existing)
      throw new ORPCError("NOT_FOUND", { message: "Attraction not found" });

    await db.attraction.delete({ where: { id: input.params.id } });

    return { success: true };
  }

  async function getAll(
    input: GetAllAttractionsInput
  ): Promise<GetAllAttractionsOutput> {
    try {
      const {
        query: {
          page = 1,
          limit,
          sortBy = "createdAt",
          sortOrder = "desc",
          search,
          minDuration,
          maxDuration,
          minPrice,
          maxPrice,
          featured,
          published,
        },
      } = input;
      const skip = limit ? (page - 1) * limit : undefined;

      // Validate ranges to avoid confusing server errors
      if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        minPrice > maxPrice
      ) {
        throw new ORPCError("BAD_REQUEST", {
          message: "minPrice cannot be greater than maxPrice",
        });
      }

      if (
        minDuration !== undefined &&
        maxDuration !== undefined &&
        minDuration > maxDuration
      ) {
        throw new ORPCError("BAD_REQUEST", {
          message: "minDuration cannot be greater than maxDuration",
        });
      }

      const where: any = {};

      if (search?.trim()) {
        where.OR = [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { content: { contains: search.trim(), mode: "insensitive" } },
        ];
      }

      if (minDuration !== undefined || maxDuration !== undefined) {
        where.duration = {};
        if (minDuration !== undefined) where.duration.gte = minDuration;
        if (maxDuration !== undefined) where.duration.lte = maxDuration;
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }

      if (featured !== undefined) where.featured = featured;
      if (published !== undefined) where.published = published;

      console.log("Searching attractions with where:", where);
      console.log("Searching attractions with limit:", limit);

      // Use Promise.all to run count and findMany in parallel for better performance
      const [total, attractions] = await Promise.all([
        db.attraction.count({ where }),
        db.attraction.findMany({
          where,
          ...(limit ? { skip, take: limit } : {}),
          orderBy: { [sortBy]: sortOrder },
          include: {
            thumbnail: { include: { image: true } },
            images: { include: { image: true }, orderBy: { position: "asc" } },
            faqs: true,
            seo: true,
            options: { include: { transfers: { include: { rates: true } } } },
          },
        }),
      ]);

      const mappedAttractions = await Promise.all(
        attractions.map((attraction) => mapAttractionToOutput(attraction))
      );

      return {
        success: true,
        data: {
          attractions: mappedAttractions,
          pagination: {
            total,
            page: limit ? page : 1,
            limit: limit || undefined,
            totalPages: limit ? Math.ceil(total / limit) : 1,
          },
        },
      };
    } catch (err: any) {
      // Normalize unexpected errors and bubble up expected validation errors
      if (err?.code === "BAD_REQUEST") {
        throw err; // already an ORPCError from our validation above
      }
      throw new ORPCError("BAD_REQUEST", {
        message:
          err?.message || "Failed to fetch attractions with provided filters",
      });
    }
  }

  async function getAttractionMetrics(): Promise<GetAttractionMetricsOutput> {
    const attractions = await db.attraction.findMany({});

    const totalAttractions = attractions.length;
    const featuredAttractions = attractions.filter((a) => a.featured).length;
    const publishedAttractions = attractions.filter((a) => a.published).length;

    // Normalize prices to simple numbers; filter out invalids and compute safely
    const priceNumbers = attractions
      .map((a) => {
        try {
          return a.price?.toNumber();
        } catch {
          return undefined;
        }
      })
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v));

    const minPrice = priceNumbers.length
      ? Math.min(...priceNumbers)
      : null;
    const maxPrice = priceNumbers.length
      ? Math.max(...priceNumbers)
      : null;

    // Durations are plain numbers; compute only from defined ones
    const durations = attractions
      .map((a) => a.duration ?? undefined)
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v));

    const minDuration = durations.length ? Math.min(...durations) : null;
    const maxDuration = durations.length ? Math.max(...durations) : null;

    return {
      success: true,
      data: {
        totalCount: totalAttractions,
        featuredCount: featuredAttractions,
        publishedCount: publishedAttractions,
        minPrice,
        maxPrice,
        minDuration,
        maxDuration,
      },
    };
  }

  return {
    create,
    update,
    getById,
    getBySlug,
    getAll,
    delete: deleteAttraction,
    getMetrics: getAttractionMetrics,
  };
};

export const attractionService = attractionServiceFactory(prisma);
