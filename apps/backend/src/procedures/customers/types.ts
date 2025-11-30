import { Inputs, Outputs } from "@/config/orpc";

export type CreateCustomerInput = Inputs["customers"]["create"];
export type ListCustomersInput = Inputs["customers"]["getAll"];
export type UpdateCustomerInput = Inputs["customers"]["update"];
export type DeleteCustomerInput = Inputs["customers"]["delete"];
export type GetCustomerByIdInput = Inputs["customers"]["getById"];

export type CustomerOutput = Outputs["customers"]["create"];
export type ListCustomersOutput = Outputs["customers"]["getAll"];
export type GetCustomerByIdOutput = Outputs["customers"]["getById"];
