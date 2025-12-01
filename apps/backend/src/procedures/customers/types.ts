import { Inputs, Outputs } from "@/config/orpc";

export type CreateCustomerInput = Inputs["customers"]["createCustomer"];
export type ListCustomersInput = Inputs["customers"]["listCustomers"];
export type UpdateCustomerInput = Inputs["customers"]["updateCustomer"];
export type DeleteCustomerInput = Inputs["customers"]["deleteCustomer"];
export type GetCustomerByIdInput = Inputs["customers"]["getCustomerById"];

export type CustomerOutput = Outputs["customers"]["createCustomer"];
export type ListCustomersOutput = Outputs["customers"]["listCustomers"];
export type GetCustomerByIdOutput = Outputs["customers"]["getCustomerById"];
