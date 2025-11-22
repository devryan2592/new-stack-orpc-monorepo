import { publicProcedure } from "@/config/orpc";
import { attractionService } from "./service";

const createAttraction = publicProcedure.attraction.create.handler(
  async ({ input }) => {
    return attractionService.create(input);
  }
);

const updateAttraction = publicProcedure.attraction.update.handler(
  async ({ input }) => {
    return attractionService.update(input);
  }
);

const getAttractionById = publicProcedure.attraction.getById.handler(
  async ({ input }) => {
    return attractionService.getById(input);
  }
);

const getAttractionBySlug = publicProcedure.attraction.getBySlug.handler(
  async ({ input }) => {
    return attractionService.getBySlug(input);
  }
);

const getAllAttractions = publicProcedure.attraction.getAll.handler(
  async ({ input }) => {
    return attractionService.getAll(input);
  }
);

const deleteAttraction = publicProcedure.attraction.delete.handler(
  async ({ input }) => {
    return attractionService.delete(input);
  }
);

const getAttractionMetrics = publicProcedure.attraction.getMetrics.handler(
  async () => {
    return attractionService.getMetrics();
  }
);

export const attractionRouter = {
  create: createAttraction,
  update: updateAttraction,
  getById: getAttractionById,
  getBySlug: getAttractionBySlug,
  getAll: getAllAttractions,
  delete: deleteAttraction,
  getMetrics: getAttractionMetrics,
};
