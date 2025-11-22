import { Inputs, Outputs } from "@/config/orpc";

export type CreateAttractionInput = Inputs["attraction"]["create"];
export type CreateAttractionOutput = Outputs["attraction"]["create"];

export type UpdateAttractionInput = Inputs["attraction"]["update"];
export type UpdateAttractionOutput = Outputs["attraction"]["update"];

export type GetAttractionByIdInput = Inputs["attraction"]["getById"];
export type GetAttractionByIdOutput = Outputs["attraction"]["getById"];

export type GetAttractionBySlugInput = Inputs["attraction"]["getBySlug"];
export type GetAttractionBySlugOutput = Outputs["attraction"]["getBySlug"];

export type GetAllAttractionsInput = Inputs["attraction"]["getAll"];
export type GetAllAttractionsOutput = Outputs["attraction"]["getAll"];

export type DeleteAttractionInput = Inputs["attraction"]["delete"];
export type DeleteAttractionOutput = Outputs["attraction"]["delete"];

export type GetAttractionMetricsOutput = Outputs["attraction"]["getMetrics"];
